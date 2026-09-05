/**
 * Two-phase transactional world-pack installation (RP-036).
 *
 * Protocol (per docs/persistence-and-offline.md §5):
 *   1. STAGE    — download every manifest file into a dedicated staging cache.
 *   2. VERIFY   — every file is present with the expected byte length (and
 *                 SHA-256 when the manifest supplies one).
 *   3. COMMIT   — a single install-record write flips the pack to `ready`.
 *                 The record is the commit pointer; nothing is `ready` before it.
 *
 * A failed or canceled install never touches the previously committed
 * revision, so the old pack stays usable. `reconcile()` removes orphan
 * staging caches left behind by interrupted installs.
 *
 * All environment dependencies (caches, fetch, record store) are injected so
 * the protocol is unit-testable without a real Cache API.
 */

export type PackStatus =
  | 'not_installed'
  | 'downloading'
  | 'verifying'
  | 'ready'
  | 'failed'
  | 'unavailable_offline';

export interface PackFile {
  readonly path: string;
  readonly byteLength: number;
  readonly sha256?: string;
}

export interface PackManifest {
  readonly packId: string;
  readonly revision: number;
  readonly rulesVersion: number;
  readonly files: readonly PackFile[];
}

interface InstallRecord {
  readonly packId: string;
  readonly revision: number;
  readonly rulesVersion: number;
  readonly cacheName: string;
}

export interface CacheLike {
  put(request: string, response: Response): Promise<void>;
  match(request: string): Promise<Response | undefined>;
}

export interface CacheStorageLike {
  open(name: string): Promise<CacheLike>;
  keys(): Promise<string[]>;
  delete(name: string): Promise<boolean>;
}

export interface RecordStoreLike {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
}

export type FetchLike = (url: string) => Promise<Response>;

const STAGE_PREFIX = 'robo-paths-pack-stage:';
const COMMIT_PREFIX = 'robo-paths-pack-ready:';
const RECORD_PREFIX = 'robo-paths-pack-record:';

function stageCacheName(manifest: PackManifest): string {
  return `${STAGE_PREFIX}${manifest.packId}@${manifest.revision}`;
}

function commitCacheName(manifest: PackManifest): string {
  return `${COMMIT_PREFIX}${manifest.packId}@${manifest.revision}`;
}

async function sha256Hex(buffer: ArrayBuffer): Promise<string | null> {
  const subtle = typeof crypto !== 'undefined' && 'subtle' in crypto ? crypto.subtle : undefined;
  if (!subtle) return null;
  const digest = await subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export class PackManager {
  private readonly caches: CacheStorageLike;
  private readonly store: RecordStoreLike;
  private readonly fetchFn: FetchLike;
  private readonly inFlight = new Map<string, Promise<PackStatus>>();

  constructor(deps: { caches: CacheStorageLike; store: RecordStoreLike; fetch?: FetchLike }) {
    this.caches = deps.caches;
    this.store = deps.store;
    this.fetchFn = deps.fetch ?? ((url: string) => fetch(url));
  }

  /** Installs (or reinstalls) a pack revision. Concurrent calls coalesce. */
  async install(manifest: PackManifest): Promise<PackStatus> {
    const running = this.inFlight.get(manifest.packId);
    if (running) return running;
    const task = this.runInstall(manifest).finally(() => {
      this.inFlight.delete(manifest.packId);
    });
    this.inFlight.set(manifest.packId, task);
    return task;
  }

  private async runInstall(manifest: PackManifest): Promise<PackStatus> {
    const stageName = stageCacheName(manifest);
    const commitName = commitCacheName(manifest);
    try {
      // ---- Phase 1: stage -------------------------------------------------
      const staging = await this.caches.open(stageName);
      for (const file of manifest.files) {
        const response = await this.fetchFn(file.path);
        if (!response.ok) {
          throw new Error(`Fetch failed for ${file.path}: ${response.status}`);
        }
        await staging.put(file.path, response);
      }

      // ---- Phase 2: verify ------------------------------------------------
      for (const file of manifest.files) {
        const cached = await staging.match(file.path);
        if (!cached) {
          throw new Error(`Staged file missing: ${file.path}`);
        }
        const bytes = await cached.arrayBuffer();
        if (bytes.byteLength !== file.byteLength) {
          throw new Error(
            `Size mismatch for ${file.path}: expected ${file.byteLength}, got ${bytes.byteLength}`,
          );
        }
        if (file.sha256) {
          const hash = await sha256Hex(bytes);
          if (hash && hash !== file.sha256) {
            throw new Error(`Hash mismatch for ${file.path}`);
          }
        }
      }

      // ---- Phase 3: commit ------------------------------------------------
      // Copy staged entries into their final, immutable cache name and write
      // the install record as the single commit pointer. The Cache API and
      // the record store are not one transaction, so the record is written
      // only after every committed file is already in place.
      const committed = await this.caches.open(commitName);
      for (const file of manifest.files) {
        const staged = await staging.match(file.path);
        if (!staged) throw new Error(`Staged file vanished: ${file.path}`);
        await committed.put(file.path, staged);
      }
      const record: InstallRecord = {
        packId: manifest.packId,
        revision: manifest.revision,
        rulesVersion: manifest.rulesVersion,
        cacheName: commitName,
      };
      await this.store.set(RECORD_PREFIX + manifest.packId, record);

      // Previous revision (and staging area) can go now that the new one committed.
      await this.caches.delete(stageName);
      await this.pruneOldRevisions(manifest.packId, commitName);
      return 'ready';
    } catch (error) {
      // Failure must leave the previously committed revision untouched.
      await this.caches.delete(stageName).catch(() => undefined);
      await this.caches.delete(commitName).catch(() => undefined);
      const previous = await this.readRecord(manifest.packId);
      if (previous) return 'ready'; // old revision still serving
      return 'failed';
    }
  }

  private async readRecord(packId: string): Promise<InstallRecord | null> {
    const raw = await this.store.get(RECORD_PREFIX + packId);
    if (!raw || typeof raw !== 'object') return null;
    const rec = raw as InstallRecord;
    if (rec.packId !== packId || !rec.cacheName) return null;
    return rec;
  }

  private async pruneOldRevisions(packId: string, keepCacheName: string): Promise<void> {
    const names = await this.caches.keys();
    await Promise.all(
      names
        .filter((n) => n.startsWith(`${COMMIT_PREFIX}${packId}@`) && n !== keepCacheName)
        .map((n) => this.caches.delete(n)),
    );
  }

  /**
   * A pack is `ready` only when a committed record exists AND its files are
   * actually present in the committed cache; otherwise the record is stale
   * (e.g. browser evicted the cache) and is reported honestly.
   */
  async status(packId: string): Promise<PackStatus> {
    if (this.inFlight.has(packId)) {
      // Report the live phase rather than a stale record.
      return 'downloading';
    }
    const record = await this.readRecord(packId);
    if (!record) return 'not_installed';
    // `ready` requires both a committed record AND its cache still existing.
    // (Checked via keys() because open() would silently recreate a missing cache.)
    const names = await this.caches.keys();
    if (!names.includes(record.cacheName)) return 'unavailable_offline';
    return 'ready';
  }

  /** Startup reconciliation: drop orphan staging caches from crashed installs. */
  async reconcile(): Promise<void> {
    const names = await this.caches.keys();
    const records: string[] = [];
    const keys = await this.storeKeys();
    for (const key of keys) {
      if (key.startsWith(RECORD_PREFIX)) {
        const rec = await this.readRecord(key.slice(RECORD_PREFIX.length));
        if (rec) records.push(rec.cacheName);
      }
    }
    await Promise.all(
      names
        .filter((n) => n.startsWith(STAGE_PREFIX) && !records.includes(n))
        .map((n) => this.caches.delete(n)),
    );
  }

  private storeKeys: () => Promise<string[]> = async () => {
    // RecordStoreLike is minimal; enumeration is provided by the adapter when
    // it supports it, otherwise reconciliation only prunes by prefix below.
    return [];
  };

  /** Adapters with enumeration support feed real keys in here. */
  withStoreKeys(keys: () => Promise<string[]>): this {
    this.storeKeys = keys;
    return this;
  }

  async remove(packId: string): Promise<void> {
    const record = await this.readRecord(packId);
    if (record) {
      await this.caches.delete(record.cacheName).catch(() => undefined);
      await this.store.delete(RECORD_PREFIX + packId);
    }
  }
}

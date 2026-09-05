import { describe, it, expect } from 'vitest';
import {
  PackManager,
  PackManifest,
  CacheLike,
  CacheStorageLike,
  RecordStoreLike,
} from '../../src/offline/packManager';

class MemoryCache implements CacheLike {
  store = new Map<string, Response>();
  async put(request: string, response: Response): Promise<void> {
    this.store.set(request, response);
  }
  async match(request: string): Promise<Response | undefined> {
    return this.store.get(request);
  }
}

class MemoryCacheStorage implements CacheStorageLike {
  caches = new Map<string, MemoryCache>();
  async open(name: string): Promise<CacheLike> {
    if (!this.caches.has(name)) this.caches.set(name, new MemoryCache());
    return this.caches.get(name)!;
  }
  async keys(): Promise<string[]> {
    return Array.from(this.caches.keys());
  }
  async delete(name: string): Promise<boolean> {
    return this.caches.delete(name);
  }
}

class MemoryStore implements RecordStoreLike {
  data = new Map<string, unknown>();
  async get(key: string): Promise<unknown> {
    return this.data.get(key);
  }
  async set(key: string, value: unknown): Promise<void> {
    this.data.set(key, value);
  }
  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }
  keys(): string[] {
    return Array.from(this.data.keys());
  }
}

function manifest(revision: number, files: { path: string; bytes: string }[]): PackManifest {
  return {
    packId: 'world-2',
    revision,
    rulesVersion: 1,
    files: files.map((f) => ({ path: f.path, byteLength: f.bytes.length })),
  };
}

function okResponse(bytes: string): Response {
  return new Response(bytes, { status: 200 });
}

describe('Two-phase transactional pack installation (RP-036)', () => {
  it('stages, verifies and commits; status becomes ready only after commit', async () => {
    const caches = new MemoryCacheStorage();
    const store = new MemoryStore();
    const fetches: string[] = [];
    const manager = new PackManager({
      caches,
      store,
      fetch: async (url) => {
        fetches.push(url);
        return okResponse('aaaa');
      },
    }).withStoreKeys(async () => store.keys());

    const m = manifest(1, [{ path: '/packs/w2/level-1.json', bytes: 'aaaa' }]);
    const status = await manager.install(m);

    expect(status).toBe('ready');
    expect(fetches).toEqual(['/packs/w2/level-1.json']);
    expect(await manager.status('world-2')).toBe('ready');
    // Commit record written exactly once with the committed cache pointer.
    expect(store.data.size).toBe(1);
    const record = store.data.get('robo-paths-pack-record:world-2') as any;
    expect(record.cacheName).toContain('robo-paths-pack-ready:world-2@1');
  });

  it('verify failure keeps the previous ready revision usable', async () => {
    const caches = new MemoryCacheStorage();
    const store = new MemoryStore();
    const storeKeys = async () => store.keys();

    // First: successful install of revision 1.
    const good = new PackManager({
      caches,
      store,
      fetch: async () => okResponse('aaaa'),
    }).withStoreKeys(storeKeys);
    await good.install(manifest(1, [{ path: '/f.json', bytes: 'aaaa' }]));
    expect(await good.status('world-2')).toBe('ready');

    // Then: revision 2 announces the wrong size — verification must fail.
    const bad = new PackManager({
      caches,
      store,
      fetch: async () => okResponse('bbbb'), // 4 bytes served, manifest says 10
    }).withStoreKeys(storeKeys);
    const failing = {
      packId: 'world-2',
      revision: 2,
      rulesVersion: 1,
      files: [{ path: '/f.json', byteLength: 10 }],
    };
    const status = await bad.install(failing);

    // New revision failed, but the old committed revision still serves.
    expect(status).toBe('ready');
    const record = store.data.get('robo-paths-pack-record:world-2') as any;
    expect(record.revision).toBe(1);
    expect(caches.caches.has('robo-paths-pack-ready:world-2@1')).toBe(true);
    expect(caches.caches.has('robo-paths-pack-ready:world-2@2')).toBe(false);
  });

  it('fetch failure with no previous revision reports failed and cleans staging', async () => {
    const caches = new MemoryCacheStorage();
    const store = new MemoryStore();
    const manager = new PackManager({
      caches,
      store,
      fetch: async () => new Response('gone', { status: 404 }),
    });

    const status = await manager.install(manifest(1, [{ path: '/f.json', bytes: 'aaaa' }]));
    expect(status).toBe('failed');
    expect(await manager.status('world-2')).toBe('not_installed');
    expect((await caches.keys()).length).toBe(0);
  });

  it('reports unavailable_offline when the committed cache was evicted', async () => {
    const caches = new MemoryCacheStorage();
    const store = new MemoryStore();
    const manager = new PackManager({
      caches,
      store,
      fetch: async () => okResponse('aaaa'),
    });
    await manager.install(manifest(1, [{ path: '/f.json', bytes: 'aaaa' }]));

    // Simulate browser eviction of the committed cache.
    for (const name of await caches.keys()) {
      await caches.delete(name);
    }
    expect(await manager.status('world-2')).toBe('unavailable_offline');
  });

  it('reconcile removes orphan staging caches but keeps committed ones', async () => {
    const caches = new MemoryCacheStorage();
    const store = new MemoryStore();
    const manager = new PackManager({
      caches,
      store,
      fetch: async () => okResponse('aaaa'),
    }).withStoreKeys(async () => store.keys());

    await manager.install(manifest(1, [{ path: '/f.json', bytes: 'aaaa' }]));

    // Simulate a crashed install that left an orphan staging cache behind.
    await caches.open('robo-paths-pack-stage:world-2@9');
    await caches.open('robo-paths-pack-stage:other@1');

    await manager.reconcile();

    const names = await caches.keys();
    expect(names).toEqual(['robo-paths-pack-ready:world-2@1']);
  });

  it('installing a new revision prunes the old committed cache', async () => {
    const caches = new MemoryCacheStorage();
    const store = new MemoryStore();
    const manager = new PackManager({
      caches,
      store,
      fetch: async () => okResponse('aaaa'),
    }).withStoreKeys(async () => store.keys());

    await manager.install(manifest(1, [{ path: '/f.json', bytes: 'aaaa' }]));
    await manager.install(manifest(2, [{ path: '/f.json', bytes: 'aaaa' }]));

    const names = await caches.keys();
    expect(names).toEqual(['robo-paths-pack-ready:world-2@2']);
    const record = store.data.get('robo-paths-pack-record:world-2') as any;
    expect(record.revision).toBe(2);
  });
});

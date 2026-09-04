import { Node } from '../core/model';
import { createInitialProgress, PlayerProgress } from '../core/progression';

export interface SaveEnvelope {
  app: 'robo-paths';
  schemaVersion: 1;
  exportedAt: string;
  progress: PlayerProgress;
}

export interface StorageAdapter {
  isFallback(): boolean;
  loadProgress(): Promise<PlayerProgress>;
  saveProgress(progress: PlayerProgress): Promise<void>;
  loadDraft(levelId: string): Promise<readonly Node[] | null>;
  saveDraft(levelId: string, commands: readonly Node[]): Promise<void>;
  clearAll(): Promise<void>;
  exportSave(): Promise<string>;
  importSave(rawJson: string): Promise<{ ok: true } | { ok: false; error: string }>;
}

export class InMemoryStorageAdapter implements StorageAdapter {
  private progress: PlayerProgress = createInitialProgress();
  private drafts = new Map<string, readonly Node[]>();

  isFallback(): boolean {
    return true;
  }

  async loadProgress(): Promise<PlayerProgress> {
    return { ...this.progress };
  }

  async saveProgress(progress: PlayerProgress): Promise<void> {
    this.progress = { ...progress };
  }

  async loadDraft(levelId: string): Promise<readonly Node[] | null> {
    return this.drafts.get(levelId) || null;
  }

  async saveDraft(levelId: string, commands: readonly Node[]): Promise<void> {
    this.drafts.set(levelId, [...commands]);
  }

  async clearAll(): Promise<void> {
    this.progress = createInitialProgress();
    this.drafts.clear();
  }

  async exportSave(): Promise<string> {
    const envelope: SaveEnvelope = {
      app: 'robo-paths',
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      progress: this.progress,
    };
    return JSON.stringify(envelope, null, 2);
  }

  async importSave(rawJson: string): Promise<{ ok: true } | { ok: false; error: string }> {
    if (!rawJson || rawJson.length > 1024 * 1024) {
      return { ok: false, error: 'Import exceeds 1MB limit or is empty' };
    }
    try {
      const parsed = JSON.parse(rawJson);
      if (parsed.app !== 'robo-paths' || parsed.schemaVersion !== 1 || !parsed.progress) {
        return { ok: false, error: 'Incompatible save file or unknown format' };
      }
      this.progress = parsed.progress;
      return { ok: true };
    } catch {
      return { ok: false, error: 'Invalid JSON save format' };
    }
  }
}

export class LocalStorageAdapter implements StorageAdapter {
  private memoryFallback = new InMemoryStorageAdapter();
  private useFallback = false;

  private PROGRESS_KEY = 'robo_paths_progress_v1';
  private DRAFT_PREFIX = 'robo_paths_draft_v1_';

  constructor() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        this.useFallback = true;
      } else {
        const testKey = '__storage_probe__';
        window.localStorage.setItem(testKey, '1');
        window.localStorage.removeItem(testKey);
      }
    } catch {
      this.useFallback = true;
    }
  }

  isFallback(): boolean {
    return this.useFallback;
  }

  async loadProgress(): Promise<PlayerProgress> {
    if (this.useFallback) {
      return this.memoryFallback.loadProgress();
    }
    try {
      const raw = window.localStorage.getItem(this.PROGRESS_KEY);
      if (!raw) {
        return createInitialProgress();
      }
      const parsed = JSON.parse(raw);
      if (parsed && parsed.schemaVersion === 1) {
        return parsed as PlayerProgress;
      }
      return createInitialProgress();
    } catch {
      this.useFallback = true;
      return this.memoryFallback.loadProgress();
    }
  }

  async saveProgress(progress: PlayerProgress): Promise<void> {
    if (this.useFallback) {
      return this.memoryFallback.saveProgress(progress);
    }
    try {
      window.localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      this.useFallback = true;
      await this.memoryFallback.saveProgress(progress);
    }
  }

  async loadDraft(levelId: string): Promise<readonly Node[] | null> {
    if (this.useFallback) {
      return this.memoryFallback.loadDraft(levelId);
    }
    try {
      const raw = window.localStorage.getItem(`${this.DRAFT_PREFIX}${levelId}`);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return this.memoryFallback.loadDraft(levelId);
    }
  }

  async saveDraft(levelId: string, commands: readonly Node[]): Promise<void> {
    if (this.useFallback) {
      return this.memoryFallback.saveDraft(levelId, commands);
    }
    try {
      window.localStorage.setItem(`${this.DRAFT_PREFIX}${levelId}`, JSON.stringify(commands));
    } catch {
      this.useFallback = true;
      await this.memoryFallback.saveDraft(levelId, commands);
    }
  }

  async clearAll(): Promise<void> {
    if (this.useFallback) {
      await this.memoryFallback.clearAll();
      return;
    }
    try {
      window.localStorage.removeItem(this.PROGRESS_KEY);
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(this.DRAFT_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      for (const k of keysToRemove) {
        window.localStorage.removeItem(k);
      }
    } catch {
      // Ignored
    }
    await this.memoryFallback.clearAll();
  }

  async exportSave(): Promise<string> {
    const progress = await this.loadProgress();
    const envelope: SaveEnvelope = {
      app: 'robo-paths',
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      progress,
    };
    return JSON.stringify(envelope, null, 2);
  }

  async importSave(rawJson: string): Promise<{ ok: true } | { ok: false; error: string }> {
    if (!rawJson || rawJson.length > 1024 * 1024) {
      return { ok: false, error: 'Import exceeds 1MB limit or is empty' };
    }
    try {
      const parsed = JSON.parse(rawJson);
      if (parsed.app !== 'robo-paths' || parsed.schemaVersion !== 1 || !parsed.progress) {
        return { ok: false, error: 'Incompatible save file or unknown format' };
      }
      await this.saveProgress(parsed.progress);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Invalid JSON save format' };
    }
  }
}

import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryStorageAdapter, LocalStorageAdapter } from '../../src/storage/storageAdapter';
import { createInitialProgress, recordLevelSuccess } from '../../src/core/progression';
import { Node } from '../../src/core/model';

describe('Local storage adapter and fallback (RP-019)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and restores progress and drafts with durable storage adapter', async () => {
    const adapter = new LocalStorageAdapter();
    const init = await adapter.loadProgress();
    expect(init.completedLevels).toEqual([]);

    const updated = recordLevelSuccess(
      init,
      'w1-01',
      { completion: true, bonus: true, efficiency: true },
      4,
      4,
    );
    await adapter.saveProgress(updated);

    const loaded = await adapter.loadProgress();
    expect(loaded.completedLevels).toContain('w1-01');
    expect(loaded.levels['w1-01']?.bestBlocks).toBe(4);

    const draft: Node[] = [
      { id: 'c1', op: 'forward' },
      { id: 'c2', op: 'left' },
    ];
    await adapter.saveDraft('w1-01', draft);

    const loadedDraft = await adapter.loadDraft('w1-01');
    expect(loadedDraft).toEqual(draft);
  });

  it('falls back seamlessly to in-memory adapter when storage fails or is blocked', async () => {
    const memory = new InMemoryStorageAdapter();
    expect(memory.isFallback()).toBe(true);

    const progress = createInitialProgress('bolt');
    await memory.saveProgress(progress);

    const loaded = await memory.loadProgress();
    expect(loaded.selectedRobotId).toBe('bolt');

    const draft: Node[] = [{ id: '1', op: 'forward' }];
    await memory.saveDraft('w1-02', draft);
    expect(await memory.loadDraft('w1-02')).toEqual(draft);

    await memory.clearAll();
    const afterClear = await memory.loadProgress();
    expect(afterClear.selectedRobotId).toBe('pip');
    expect(await memory.loadDraft('w1-02')).toBeNull();
  });
});

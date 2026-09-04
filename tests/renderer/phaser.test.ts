import { describe, it, expect } from 'vitest';

describe('Phaser 4.2.1 browser environment verification (RP-002)', () => {
  it('loads Phaser in jsdom environment', async () => {
    const phaserModule = await import('phaser');
    const Phaser = (phaserModule as any).default || phaserModule;
    expect(Phaser).toBeDefined();
    expect(typeof Phaser.Game).toBe('function');
    expect(typeof Phaser.Scene).toBe('function');
  });
});

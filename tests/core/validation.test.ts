import { describe, it, expect } from 'vitest';
import { validateLevel, validateProgram } from '../../src/core/validate';
import { Level } from '../../src/core/model';

const validLevel: Level = {
  schemaVersion: 1,
  engineRulesVersion: 1,
  id: 'w1-01',
  revision: 1,
  worldId: 'w1',
  ordinal: 1,
  titleKey: 'levels.w1_01.title',
  board: {
    width: 3,
    height: 3,
    tiles: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 },
    ],
    walls: [],
  },
  start: { x: 0, y: 0, facing: 'E' },
  goal: { x: 2, y: 2 },
  collectibles: [],
  gates: [],
  switches: [],
  commands: ['forward', 'left', 'right'],
  limits: { maxBlocks: 8, maxActions: 10 },
  rating: { parBlocks: 5 },
  teaching: { concept: 'test', archetype: 'test', difficulty: 1 },
  hintKeys: ['h1', 'h2', 'h3'],
};

describe('Content validation (RP-005)', () => {
  it('rejects future or incompatible schema/engine versions', () => {
    const res = validateLevel({ ...validLevel, schemaVersion: 2 });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.some((e) => e.code === 'LEVEL_VERSION')).toBe(true);
    }
  });

  it('rejects start coordinate equal to goal coordinate', () => {
    const res = validateLevel({ ...validLevel, start: { x: 2, y: 2, facing: 'E' } });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.some((e) => e.code === 'INVALID_START_GOAL')).toBe(true);
    }
  });

  it('rejects wall outside of tiles', () => {
    const res = validateLevel({
      ...validLevel,
      board: { ...validLevel.board, walls: [{ x: 5, y: 5 }] },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.some((e) => e.code === 'WALL_OUTSIDE_TILES')).toBe(true);
    }
  });

  it('rejects unreferenced gate or switch referencing missing gate', () => {
    const res = validateLevel({
      ...validLevel,
      gates: [{ id: 'g1', x: 1, y: 1 }],
      switches: [{ id: 'sw1', x: 0, y: 1, opens: ['g2'] }], // g2 does not exist!
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.some((e) => e.code === 'INVALID_GATE_REFERENCE')).toBe(true);
    }
  });

  it('rejects duplicate coordinate in tiles', () => {
    const res = validateLevel({
      ...validLevel,
      board: {
        ...validLevel.board,
        tiles: [...validLevel.board.tiles, { x: 0, y: 0 }],
      },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.some((e) => e.code === 'DUPLICATE_COORDINATE')).toBe(true);
    }
  });

  it('rejects program with forbidden command', () => {
    const prog = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      commands: [{ id: '1', op: 'repeat', count: 2, body: [{ id: '2', op: 'forward' }] }],
    };
    // validLevel only allows forward, left, right (not repeat)
    const res = validateProgram(prog, validLevel);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.some((e) => e.code === 'COMMAND_NOT_ALLOWED')).toBe(true);
    }
  });

  it('rejects nested repeat in program', () => {
    const levelWithRepeat: Level = {
      ...validLevel,
      commands: ['forward', 'repeat'],
    };
    const nestedProg = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      commands: [
        {
          id: 'rep1',
          op: 'repeat',
          count: 2,
          body: [
            {
              id: 'rep2',
              op: 'repeat',
              count: 2,
              body: [{ id: 'fwd', op: 'forward' }],
            },
          ],
        },
      ],
    };

    const res = validateProgram(nestedProg, levelWithRepeat);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.some((e) => e.code === 'NESTED_REPEAT')).toBe(true);
    }
  });

  it('rejects empty repeat body', () => {
    const levelWithRepeat: Level = {
      ...validLevel,
      commands: ['forward', 'repeat'],
    };
    const emptyRepeat = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      commands: [{ id: 'rep1', op: 'repeat', count: 2, body: [] }],
    };

    const res = validateProgram(emptyRepeat, levelWithRepeat);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.some((e) => e.code === 'REPEAT_BODY_EMPTY')).toBe(true);
    }
  });

  it('rejects duplicate node IDs in program', () => {
    const prog = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      commands: [
        { id: 'same-id', op: 'forward' },
        { id: 'same-id', op: 'forward' },
      ],
    };

    const res = validateProgram(prog, validLevel);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.some((e) => e.code === 'DUPLICATE_NODE_ID')).toBe(true);
    }
  });

  it('rejects program exceeding maxBlocks limit', () => {
    const prog = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      commands: Array.from({ length: 9 }, (_, i) => ({ id: `cmd-${i}`, op: 'forward' })),
    };
    // validLevel has maxBlocks 8
    const res = validateProgram(prog, validLevel);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.some((e) => e.code === 'BLOCK_LIMIT')).toBe(true);
    }
  });
});

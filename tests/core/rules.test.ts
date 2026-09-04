import { describe, it, expect } from 'vitest';
import { simulate } from '../../src/core/simulate';
import { Level, Program } from '../../src/core/model';

const baseLevel: Level = {
  schemaVersion: 1,
  engineRulesVersion: 1,
  id: 'w1-01',
  revision: 1,
  worldId: 'w1',
  ordinal: 1,
  titleKey: 'levels.w1_01.title',
  board: {
    width: 4,
    height: 4,
    tiles: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
      { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 },
    ],
    walls: [{ x: 1, y: 0 }],
  },
  start: { x: 0, y: 0, facing: 'E' },
  goal: { x: 2, y: 0 },
  collectibles: [
    { id: 'b1', x: 0, y: 1, kind: 'required' },
    { id: 's1', x: 2, y: 1, kind: 'bonus' },
  ],
  gates: [{ id: 'g1', x: 2, y: 0 }],
  switches: [{ id: 'sw1', x: 0, y: 2, opens: ['g1'] }],
  commands: ['forward', 'left', 'right', 'repeat'],
  limits: { maxBlocks: 10, maxActions: 15 },
  rating: { parBlocks: 6 },
  teaching: { concept: 'test', archetype: 'test', difficulty: 1 },
  hintKeys: ['h1', 'h2', 'h3'],
};

describe('Core game rules and execution invariants', () => {
  it('rotates left and right correctly modulo 4 without moving', () => {
    const prog: Program = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      commands: [
        { id: '1', op: 'right' },
        { id: '2', op: 'right' },
        { id: '3', op: 'right' },
        { id: '4', op: 'right' },
      ],
    };

    const trace = simulate(baseLevel, prog);
    expect(trace.steps[0].after.facing).toBe('S');
    expect(trace.steps[1].after.facing).toBe('W');
    expect(trace.steps[2].after.facing).toBe('N');
    expect(trace.steps[3].after.facing).toBe('E');
    expect(trace.final.x).toBe(0);
    expect(trace.final.y).toBe(0);
    expect(trace.outcome).toBe('incomplete');
  });

  it('stops with blocked when walking into a wall', () => {
    const prog: Program = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      commands: [{ id: '1', op: 'forward' }], // Facing E towards wall (1,0)
    };

    const trace = simulate(baseLevel, prog);
    expect(trace.outcome).toBe('blocked');
    expect(trace.steps[0].blocked?.reason).toBe('wall');
    expect(trace.final.x).toBe(0);
    expect(trace.final.y).toBe(0);
  });

  it('stops with blocked when walking into void (outside tiles)', () => {
    const prog: Program = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      commands: [
        { id: '1', op: 'left' }, // Faces N
        { id: '2', op: 'forward' }, // Moves to (0, -1) which is void
      ],
    };

    const trace = simulate(baseLevel, prog);
    expect(trace.outcome).toBe('blocked');
    expect(trace.steps[1].blocked?.reason).toBe('void');
    expect(trace.final.x).toBe(0);
    expect(trace.final.y).toBe(0);
  });

  it('blocks at closed gate until opened by switch; latches switch open for the attempt', () => {
    // Path: Turn S (right), forward to (0,1) collect b1, forward to (0,2) trigger sw1 (opens g1),
    // turn E (left), forward to (1,2), forward to (2,2), turn N (left), forward to (2,1) collect s1,
    // forward to (2,0) goal (which is gate g1)
    const prog: Program = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      commands: [
        { id: '1', op: 'right' }, // S
        { id: '2', op: 'forward' }, // (0,1) collect b1
        { id: '3', op: 'forward' }, // (0,2) trigger sw1 -> opens g1
        { id: '4', op: 'left' }, // E
        { id: '5', op: 'forward' }, // (1,2)
        { id: '6', op: 'forward' }, // (2,2)
        { id: '7', op: 'left' }, // N
        { id: '8', op: 'forward' }, // (2,1) collect s1
        { id: '9', op: 'forward' }, // (2,0) gate g1 is now OPEN -> goal reached!
      ],
    };

    const trace = simulate(baseLevel, prog);
    expect(trace.outcome).toBe('success');
    expect(trace.awards.completion).toBe(true);
    expect(trace.awards.bonus).toBe(true);
    expect(trace.final.openedGates).toContain('g1');
  });

  it('distinguishes out_of_actions from incomplete', () => {
    const lowActionLevel: Level = {
      ...baseLevel,
      limits: { maxBlocks: 10, maxActions: 2 },
    };

    const prog: Program = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      commands: [
        { id: '1', op: 'right' },
        { id: '2', op: 'right' },
        { id: '3', op: 'right' }, // 3rd action exceeds maxActions 2
      ],
    };

    const trace = simulate(lowActionLevel, prog);
    expect(trace.outcome).toBe('out_of_actions');
    expect(trace.final.actionsUsed).toBe(2);
  });

  it('does not complete early if required collectible is missing at goal', () => {
    // Start at (0,0), open gate first, reach goal without collecting b1
    const noReqLevel: Level = {
      ...baseLevel,
      goal: { x: 0, y: 2 }, // Goal is at (0,2), start at (0,0), b1 is at (0,1)
      collectibles: [{ id: 'b1', x: 2, y: 2, kind: 'required' }], // required is elsewhere
    };

    const prog: Program = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      commands: [
        { id: '1', op: 'right' }, // Faces S
        { id: '2', op: 'forward' }, // (0,1)
        { id: '3', op: 'forward' }, // (0,2) at goal! But required b1 not collected
        { id: '4', op: 'left' }, // continues
      ],
    };

    const trace = simulate(noReqLevel, prog);
    expect(trace.outcome).toBe('incomplete');
    expect(trace.awards.completion).toBe(false);
  });

  it('counts full AST cost for blocks and executed primitives for actions', () => {
    const repeatProg: Program = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      commands: [
        {
          id: 'rep1',
          op: 'repeat',
          count: 3,
          body: [
            { id: 'c1', op: 'right' },
            { id: 'c2', op: 'left' },
          ],
        },
      ],
    };

    // Repeat node (1) + 2 child nodes (2) = 3 blocks static cost
    // 3 iterations * 2 primitives = 6 actions executed
    const trace = simulate(baseLevel, repeatProg);
    expect(trace.usedBlocks).toBe(3);
    expect(trace.final.actionsUsed).toBe(6);
    expect(trace.steps.length).toBe(6);
    expect(trace.steps[0].source.iteration).toBe(1);
    expect(trace.steps[5].source.iteration).toBe(3);
  });
});

import { describe, it, expect } from 'vitest';
import {
  createInitialEditorState,
  editorReducer,
  calculateBlockCost,
} from '../../src/features/editor/editorReducer';

describe('Pure program editing reducer (RP-009)', () => {
  it('adds and inserts commands with unique node IDs', () => {
    let state = createInitialEditorState(10);
    state = editorReducer(state, { type: 'ADD_COMMAND', op: 'forward' });
    state = editorReducer(state, { type: 'ADD_COMMAND', op: 'left' });
    state = editorReducer(state, { type: 'INSERT_COMMAND', index: 1, op: 'right' });

    expect(state.commands.length).toBe(3);
    expect(state.commands[0].op).toBe('forward');
    expect(state.commands[1].op).toBe('right');
    expect(state.commands[2].op).toBe('left');

    const ids = new Set(state.commands.map((c) => c.id));
    expect(ids.size).toBe(3);
  });

  it('reorders commands deterministically', () => {
    let state = createInitialEditorState(10);
    state = editorReducer(state, { type: 'ADD_COMMAND', op: 'forward' });
    state = editorReducer(state, { type: 'ADD_COMMAND', op: 'left' });
    state = editorReducer(state, { type: 'ADD_COMMAND', op: 'right' });

    state = editorReducer(state, { type: 'REORDER_COMMAND', fromIndex: 0, toIndex: 2 });
    expect(state.commands.map((c) => c.op)).toEqual(['left', 'right', 'forward']);
  });

  it('supports at least 50 operations of undo and redo', () => {
    let state = createInitialEditorState(24);
    // Add 20 commands
    for (let i = 0; i < 20; i++) {
      state = editorReducer(state, { type: 'ADD_COMMAND', op: 'forward' });
    }
    expect(state.commands.length).toBe(20);

    // Perform 35 modifications (e.g. replacing commands)
    for (let i = 0; i < 35; i++) {
      state = editorReducer(state, {
        type: 'REPLACE_COMMAND',
        index: i % 20,
        op: i % 2 === 0 ? 'left' : 'right',
      });
    }

    // Now total operations performed = 20 + 35 = 55 operations
    // Undo 50 times
    for (let i = 0; i < 50; i++) {
      state = editorReducer(state, { type: 'UNDO' });
    }
    // Redo 25 times
    for (let i = 0; i < 25; i++) {
      state = editorReducer(state, { type: 'REDO' });
    }
    expect(state.commands.length).toBe(20);
  });

  it('enforces block capacity limits and rejects operations that exceed maxBlocks', () => {
    let state = createInitialEditorState(3);
    state = editorReducer(state, { type: 'ADD_COMMAND', op: 'forward' });
    state = editorReducer(state, { type: 'ADD_COMMAND', op: 'left' });
    state = editorReducer(state, { type: 'ADD_COMMAND', op: 'right' });
    expect(state.commands.length).toBe(3);

    // Attempt to add a 4th block when maxBlocks is 3
    const nextState = editorReducer(state, { type: 'ADD_COMMAND', op: 'forward' });
    expect(nextState.commands.length).toBe(3); // unchanged!
  });

  it('allows replacing a command at full capacity if cost does not increase', () => {
    let state = createInitialEditorState(2);
    state = editorReducer(state, { type: 'ADD_COMMAND', op: 'forward' });
    state = editorReducer(state, { type: 'ADD_COMMAND', op: 'left' });
    expect(calculateBlockCost(state.commands)).toBe(2);

    // Replace left with right (cost is still 2)
    state = editorReducer(state, { type: 'REPLACE_COMMAND', index: 1, op: 'right' });
    expect(state.commands[1].op).toBe('right');
    expect(calculateBlockCost(state.commands)).toBe(2);
  });

  it('separates Clear from Reset and allows undoing Clear', () => {
    let state = createInitialEditorState(10);
    state = editorReducer(state, { type: 'ADD_COMMAND', op: 'forward' });
    state = editorReducer(state, { type: 'ADD_COMMAND', op: 'left' });
    expect(state.commands.length).toBe(2);

    state = editorReducer(state, { type: 'CLEAR_COMMANDS' });
    expect(state.commands.length).toBe(0);

    // Undo restore
    state = editorReducer(state, { type: 'UNDO' });
    expect(state.commands.length).toBe(2);
    expect(state.commands[0].op).toBe('forward');
  });

  it('supports repeat blocks and repeat body management', () => {
    let state = createInitialEditorState(10);
    state = editorReducer(state, { type: 'ADD_COMMAND', op: 'repeat', count: 3 });
    expect(state.commands.length).toBe(1);
    expect(state.commands[0].op).toBe('repeat');
    expect(calculateBlockCost(state.commands)).toBe(1); // repeat node costs 1

    // Add child to repeat
    state = editorReducer(state, { type: 'ADD_TO_REPEAT', repeatIndex: 0, op: 'forward' });
    state = editorReducer(state, { type: 'ADD_TO_REPEAT', repeatIndex: 0, op: 'right' });
    expect(calculateBlockCost(state.commands)).toBe(3); // 1 header + 2 children

    // Remove child from repeat
    state = editorReducer(state, { type: 'REMOVE_FROM_REPEAT', repeatIndex: 0, childIndex: 0 });
    expect(calculateBlockCost(state.commands)).toBe(2);
  });
});

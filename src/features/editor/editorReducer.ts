import { CommandOp, Node, Primitive, PrimitiveOp, Repeat } from '../../core/model';

export function calculateBlockCost(commands: readonly Node[]): number {
  let cost = 0;
  for (const cmd of commands) {
    cost++;
    if (cmd.op === 'repeat') {
      cost += cmd.body.length;
    }
  }
  return cost;
}

let nextIdCounter = 1;
export function generateNodeId(prefix = 'cmd'): string {
  return `${prefix}-${Date.now().toString(36)}-${(nextIdCounter++).toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export interface EditorState {
  readonly commands: readonly Node[];
  readonly maxBlocks: number;
  readonly undoStack: readonly (readonly Node[])[];
  readonly redoStack: readonly (readonly Node[])[];
  readonly selectedIndex: number | null;
}

export type EditorAction =
  | { type: 'ADD_COMMAND'; op: CommandOp; count?: 2 | 3 | 4 | 5 }
  | { type: 'INSERT_COMMAND'; index: number; op: CommandOp; count?: 2 | 3 | 4 | 5 }
  | { type: 'REORDER_COMMAND'; fromIndex: number; toIndex: number }
  | { type: 'REPLACE_COMMAND'; index: number; op: CommandOp; count?: 2 | 3 | 4 | 5 }
  | { type: 'DELETE_COMMAND'; index: number }
  | { type: 'CLEAR_COMMANDS' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_COMMANDS'; commands: readonly Node[]; resetHistory?: boolean }
  | { type: 'SELECT_INDEX'; index: number | null }
  | { type: 'ADD_TO_REPEAT'; repeatIndex: number; op: PrimitiveOp }
  | { type: 'REMOVE_FROM_REPEAT'; repeatIndex: number; childIndex: number }
  | { type: 'CHANGE_REPEAT_COUNT'; repeatIndex: number; count: 2 | 3 | 4 | 5 };

const MAX_UNDO_DEPTH = 50;

function pushUndo(state: EditorState): readonly (readonly Node[])[] {
  const stack = [state.commands, ...state.undoStack];
  return stack.slice(0, MAX_UNDO_DEPTH);
}

function createNode(op: CommandOp, count: 2 | 3 | 4 | 5 = 2): Node {
  const id = generateNodeId(op);
  if (op === 'repeat') {
    return {
      id,
      op: 'repeat',
      count,
      body: [],
    };
  }
  return {
    id,
    op,
  };
}

export function createInitialEditorState(maxBlocks = 24, initialCommands: readonly Node[] = []): EditorState {
  return {
    commands: initialCommands,
    maxBlocks,
    undoStack: [],
    redoStack: [],
    selectedIndex: null,
  };
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SELECT_INDEX':
      return {
        ...state,
        selectedIndex: action.index,
      };

    case 'SET_COMMANDS':
      return {
        ...state,
        commands: action.commands,
        undoStack: action.resetHistory ? [] : pushUndo(state),
        redoStack: [],
        selectedIndex: null,
      };

    case 'ADD_COMMAND': {
      const newNode = createNode(action.op, action.count);
      const additionalCost = newNode.op === 'repeat' ? 1 + newNode.body.length : 1;
      const currentCost = calculateBlockCost(state.commands);

      if (currentCost + additionalCost > state.maxBlocks || state.commands.length >= 24) {
        return state; // Capacity exceeded
      }

      return {
        ...state,
        commands: [...state.commands, newNode],
        undoStack: pushUndo(state),
        redoStack: [],
      };
    }

    case 'INSERT_COMMAND': {
      const { index, op, count } = action;
      if (index < 0 || index > state.commands.length) return state;

      const newNode = createNode(op, count);
      const additionalCost = newNode.op === 'repeat' ? 1 + newNode.body.length : 1;
      const currentCost = calculateBlockCost(state.commands);

      if (currentCost + additionalCost > state.maxBlocks || state.commands.length >= 24) {
        return state;
      }

      const next = [...state.commands];
      next.splice(index, 0, newNode);

      return {
        ...state,
        commands: next,
        undoStack: pushUndo(state),
        redoStack: [],
      };
    }

    case 'REPLACE_COMMAND': {
      const { index, op, count } = action;
      if (index < 0 || index >= state.commands.length) return state;

      const oldNode = state.commands[index];
      const oldCost = oldNode.op === 'repeat' ? 1 + oldNode.body.length : 1;
      const newNode = createNode(op, count);
      const newCost = newNode.op === 'repeat' ? 1 + newNode.body.length : 1;
      const currentCost = calculateBlockCost(state.commands);

      if (currentCost - oldCost + newCost > state.maxBlocks) {
        return state; // Capacity exceeded
      }

      const next = [...state.commands];
      next[index] = newNode;

      return {
        ...state,
        commands: next,
        undoStack: pushUndo(state),
        redoStack: [],
      };
    }

    case 'REORDER_COMMAND': {
      const { fromIndex, toIndex } = action;
      if (
        fromIndex < 0 ||
        fromIndex >= state.commands.length ||
        toIndex < 0 ||
        toIndex >= state.commands.length ||
        fromIndex === toIndex
      ) {
        return state;
      }

      const next = [...state.commands];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);

      return {
        ...state,
        commands: next,
        undoStack: pushUndo(state),
        redoStack: [],
        selectedIndex: toIndex,
      };
    }

    case 'DELETE_COMMAND': {
      const { index } = action;
      if (index < 0 || index >= state.commands.length) return state;

      const next = state.commands.filter((_, i) => i !== index);

      return {
        ...state,
        commands: next,
        undoStack: pushUndo(state),
        redoStack: [],
        selectedIndex: null,
      };
    }

    case 'CLEAR_COMMANDS': {
      if (state.commands.length === 0) return state;

      return {
        ...state,
        commands: [],
        undoStack: pushUndo(state),
        redoStack: [],
        selectedIndex: null,
      };
    }

    case 'ADD_TO_REPEAT': {
      const { repeatIndex, op } = action;
      if (repeatIndex < 0 || repeatIndex >= state.commands.length) return state;
      const target = state.commands[repeatIndex];
      if (target.op !== 'repeat') return state;

      if (target.body.length >= 6) return state; // repeat body limit 6
      if (calculateBlockCost(state.commands) + 1 > state.maxBlocks) return state;

      const newChild: Primitive = {
        id: generateNodeId(op),
        op,
      };

      const updatedRepeat: Repeat = {
        ...target,
        body: [...target.body, newChild],
      };

      const next = [...state.commands];
      next[repeatIndex] = updatedRepeat;

      return {
        ...state,
        commands: next,
        undoStack: pushUndo(state),
        redoStack: [],
      };
    }

    case 'REMOVE_FROM_REPEAT': {
      const { repeatIndex, childIndex } = action;
      if (repeatIndex < 0 || repeatIndex >= state.commands.length) return state;
      const target = state.commands[repeatIndex];
      if (target.op !== 'repeat') return state;
      if (childIndex < 0 || childIndex >= target.body.length) return state;

      const updatedRepeat: Repeat = {
        ...target,
        body: target.body.filter((_, i) => i !== childIndex),
      };

      const next = [...state.commands];
      next[repeatIndex] = updatedRepeat;

      return {
        ...state,
        commands: next,
        undoStack: pushUndo(state),
        redoStack: [],
      };
    }

    case 'CHANGE_REPEAT_COUNT': {
      const { repeatIndex, count } = action;
      if (repeatIndex < 0 || repeatIndex >= state.commands.length) return state;
      const target = state.commands[repeatIndex];
      if (target.op !== 'repeat') return state;

      const updatedRepeat: Repeat = {
        ...target,
        count,
      };

      const next = [...state.commands];
      next[repeatIndex] = updatedRepeat;

      return {
        ...state,
        commands: next,
        undoStack: pushUndo(state),
        redoStack: [],
      };
    }

    case 'UNDO': {
      if (state.undoStack.length === 0) return state;
      const [previous, ...restUndo] = state.undoStack;
      return {
        ...state,
        commands: previous,
        undoStack: restUndo,
        redoStack: [state.commands, ...state.redoStack],
        selectedIndex: null,
      };
    }

    case 'REDO': {
      if (state.redoStack.length === 0) return state;
      const [next, ...restRedo] = state.redoStack;
      return {
        ...state,
        commands: next,
        undoStack: [state.commands, ...state.undoStack],
        redoStack: restRedo,
        selectedIndex: null,
      };
    }

    default:
      return state;
  }
}

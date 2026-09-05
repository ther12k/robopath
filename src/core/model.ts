/** Core game rules v1 model definitions.
 * Pure TypeScript without DOM, React, Phaser, IndexedDB or wall-clock dependencies.
 */

export type Facing = 'N' | 'E' | 'S' | 'W';
export type PrimitiveOp = 'forward' | 'left' | 'right';
export type CommandOp = PrimitiveOp | 'repeat';

export interface Coordinate {
  readonly x: number;
  readonly y: number;
}

export interface Primitive {
  readonly id: string;
  readonly op: PrimitiveOp;
}

export interface Repeat {
  readonly id: string;
  readonly op: 'repeat';
  readonly count: 2 | 3 | 4 | 5;
  readonly body: readonly Primitive[];
}

export type Node = Primitive | Repeat;

export interface Program {
  readonly schemaVersion: 1;
  readonly engineRulesVersion: 1;
  readonly commands: readonly Node[];
}

export interface Draft {
  readonly schemaVersion: 1;
  readonly engineRulesVersion: 1;
  readonly commands: readonly (Node | { readonly id: string; readonly op: 'repeat'; readonly count: number; readonly body: readonly Primitive[] })[];
}

export interface Collectible extends Coordinate {
  readonly id: string;
  readonly kind: 'required' | 'bonus';
}

export interface Gate extends Coordinate {
  readonly id: string;
}

export interface Switch extends Coordinate {
  readonly id: string;
  readonly opens: readonly string[];
}

/** Cosmetic scenery. Decorations never affect simulation rules. */
export type DecorationKind = 'tree';

export interface BoardDecoration extends Coordinate {
  readonly kind: DecorationKind;
}

export interface Level {
  readonly schemaVersion: 1;
  readonly engineRulesVersion: 1;
  readonly id: string;
  readonly revision: number;
  readonly worldId: string;
  readonly ordinal: number;
  readonly titleKey: string;
  readonly board: {
    readonly width: number;
    readonly height: number;
    readonly tiles: readonly Coordinate[];
    readonly walls: readonly Coordinate[];
    /** Optional cosmetic scenery; must sit on wall (blocked) tiles. */
    readonly decorations?: readonly BoardDecoration[];
  };
  readonly start: Coordinate & { readonly facing: Facing };
  readonly goal: Coordinate;
  readonly collectibles: readonly Collectible[];
  readonly gates: readonly Gate[];
  readonly switches: readonly Switch[];
  readonly commands: readonly CommandOp[];
  readonly limits: {
    readonly maxBlocks: number;
    readonly maxActions: number;
  };
  readonly rating: {
    readonly parBlocks: number;
  };
  readonly teaching: {
    readonly concept: string;
    readonly archetype: string;
    readonly difficulty: number;
  };
  readonly hintKeys: readonly string[];
}

export interface State extends Coordinate {
  readonly facing: Facing;
  readonly collected: readonly string[];
  readonly openedGates: readonly string[];
  readonly actionsUsed: number;
}

export interface CompiledAction {
  readonly op: PrimitiveOp;
  readonly nodeId: string;
  readonly topLevelIndex: number;
  readonly iteration?: number;
}

export interface EventCollect {
  readonly kind: 'collect';
  readonly id: string;
}

export interface EventOpenGate {
  readonly kind: 'open_gate';
  readonly id: string;
}

export type StepEvent = EventCollect | EventOpenGate;

export interface BlockedReason {
  readonly target: Coordinate;
  readonly reason: 'void' | 'wall' | 'closed_gate';
}

export interface Step {
  readonly actionIndex: number;
  readonly source: CompiledAction;
  readonly before: State;
  readonly after: State;
  readonly events: readonly StepEvent[];
  readonly blocked?: BlockedReason;
}

export interface Awards {
  readonly completion: boolean;
  readonly bonus: boolean;
  readonly efficiency: boolean;
}

export type Outcome = 'success' | 'blocked' | 'incomplete' | 'out_of_actions';

export interface RunTrace {
  readonly initial: State;
  readonly steps: readonly Step[];
  readonly final: State;
  readonly outcome: Outcome;
  readonly usedBlocks: number;
  readonly awards: Awards;
}

export interface ValidationError {
  readonly code: string;
  readonly path: string;
  readonly nodeId?: string;
  readonly message: string;
}

export type Result<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly errors: readonly ValidationError[] };

export const DIRECTIONS: readonly Facing[] = ['N', 'E', 'S', 'W'] as const;

export const DELTAS: Record<Facing, { readonly dx: number; readonly dy: number }> = {
  N: { dx: 0, dy: -1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: 1 },
  W: { dx: -1, dy: 0 },
} as const;

export const PRIMITIVES: ReadonlySet<string> = new Set(['forward', 'left', 'right']);

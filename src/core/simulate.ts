import {
  DELTAS,
  DIRECTIONS,
  Facing,
  Level,
  Outcome,
  Program,
  RunTrace,
  State,
  Step,
  StepEvent,
} from './model';
import { compileProgram } from './compile';
import { scoreResult } from './score';

function coordKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function simulate(level: Level, program: Program): RunTrace {
  const { actions, cost } = compileProgram(program, level);

  const tiles = new Set<string>();
  for (const t of level.board.tiles) {
    tiles.add(coordKey(t.x, t.y));
  }

  const walls = new Set<string>();
  for (const w of level.board.walls) {
    walls.add(coordKey(w.x, w.y));
  }

  const gates = new Map<string, string>();
  for (const g of level.gates) {
    gates.set(coordKey(g.x, g.y), g.id);
  }

  const switches = new Map<string, readonly string[]>();
  for (const s of level.switches) {
    switches.set(coordKey(s.x, s.y), s.opens);
  }

  const pickups = new Map<string, { id: string; kind: 'required' | 'bonus' }>();
  const required = new Set<string>();
  for (const p of level.collectibles) {
    pickups.set(coordKey(p.x, p.y), { id: p.id, kind: p.kind });
    if (p.kind === 'required') {
      required.add(p.id);
    }
  }

  const collected = new Set<string>();
  const opened = new Set<string>();

  let state: State = {
    x: level.start.x,
    y: level.start.y,
    facing: level.start.facing,
    collected: [],
    openedGates: [],
    actionsUsed: 0,
  };

  const initial: State = { ...state, collected: [], openedGates: [] };
  const steps: Step[] = [];
  let outcome: Outcome = 'incomplete';

  for (let actionIndex = 0; actionIndex < actions.length; actionIndex++) {
    if (state.actionsUsed >= level.limits.maxActions) {
      outcome = 'out_of_actions';
      break;
    }

    const source = actions[actionIndex];
    const before: State = { ...state };
    const actionsUsed = state.actionsUsed + 1;
    const events: StepEvent[] = [];
    let blockedReason: Step['blocked'] | undefined = undefined;

    let nextFacing: Facing = state.facing;
    let nextX = state.x;
    let nextY = state.y;

    if (source.op === 'left' || source.op === 'right') {
      const dirIndex = DIRECTIONS.indexOf(state.facing);
      const delta = source.op === 'right' ? 1 : -1;
      nextFacing = DIRECTIONS[(dirIndex + delta + 4) % 4];
    } else if (source.op === 'forward') {
      const delta = DELTAS[state.facing];
      const targetX = state.x + delta.dx;
      const targetY = state.y + delta.dy;
      const targetKey = coordKey(targetX, targetY);

      let blockKind: 'void' | 'wall' | 'closed_gate' | null = null;
      if (!tiles.has(targetKey)) {
        blockKind = 'void';
      } else if (walls.has(targetKey)) {
        blockKind = 'wall';
      } else if (gates.has(targetKey) && !opened.has(gates.get(targetKey)!)) {
        blockKind = 'closed_gate';
      }

      if (blockKind) {
        blockedReason = {
          target: { x: targetX, y: targetY },
          reason: blockKind,
        };
        outcome = 'blocked';
      } else {
        nextX = targetX;
        nextY = targetY;

        const pickup = pickups.get(targetKey);
        if (pickup && !collected.has(pickup.id)) {
          collected.add(pickup.id);
          events.push({ kind: 'collect', id: pickup.id });
        }

        const switchOpens = switches.get(targetKey);
        if (switchOpens) {
          const sortedOpens = [...switchOpens].sort();
          for (const gateId of sortedOpens) {
            if (!opened.has(gateId)) {
              opened.add(gateId);
              events.push({ kind: 'open_gate', id: gateId });
            }
          }
        }
      }
    }

    state = {
      x: nextX,
      y: nextY,
      facing: nextFacing,
      collected: Array.from(collected).sort(),
      openedGates: Array.from(opened).sort(),
      actionsUsed,
    };

    const step: Step = {
      actionIndex,
      source,
      before,
      after: state,
      events,
      ...(blockedReason ? { blocked: blockedReason } : {}),
    };

    steps.push(step);

    if (blockedReason) {
      break;
    }

    const atGoal = state.x === level.goal.x && state.y === level.goal.y;
    const hasAllRequired = Array.from(required).every((id) => collected.has(id));
    if (atGoal && hasAllRequired) {
      outcome = 'success';
      break;
    }
  }

  const awards = scoreResult(level, outcome, cost, state.collected);

  return {
    initial,
    steps,
    final: state,
    outcome,
    usedBlocks: cost,
    awards,
  };
}

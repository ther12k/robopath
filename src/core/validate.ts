import {
  Level,
  Program,
  Result,
  ValidationError,
  DIRECTIONS,
  PRIMITIVES,
  Coordinate,
} from './model';

function coordKey(c: Coordinate): string {
  return `${c.x},${c.y}`;
}

export function validateLevel(level: unknown): Result<Level> {
  const errors: ValidationError[] = [];

  if (!level || typeof level !== 'object') {
    return { ok: false, errors: [{ code: 'INVALID_INPUT', path: '', message: 'Level must be an object' }] };
  }

  const l = level as Record<string, any>;

  if (l.schemaVersion !== 1 || l.engineRulesVersion !== 1) {
    errors.push({ code: 'LEVEL_VERSION', path: 'schemaVersion', message: 'Unsupported schema or rules version' });
  }

  if (typeof l.id !== 'string' || typeof l.worldId !== 'string' || typeof l.ordinal !== 'number') {
    errors.push({ code: 'INVALID_METADATA', path: 'id', message: 'Missing or invalid level identification' });
  } else {
    const expectedId = `${l.worldId}-${String(l.ordinal).padStart(2, '0')}`;
    if (l.id !== expectedId) {
      errors.push({ code: 'LEVEL_ID_ORDINAL_MISMATCH', path: 'id', message: `Level id must be ${expectedId}` });
    }
  }

  const board = l.board;
  if (!board || typeof board !== 'object') {
    errors.push({ code: 'INVALID_BOARD', path: 'board', message: 'Board definition missing' });
    return { ok: false, errors };
  }

  const width = board.width;
  const height = board.height;
  if (typeof width !== 'number' || typeof height !== 'number' || width < 1 || width > 8 || height < 1 || height > 8) {
    errors.push({ code: 'OUT_OF_BOUNDS', path: 'board', message: 'Board dimensions must be between 1 and 8' });
  }

  if (!Array.isArray(board.tiles) || !Array.isArray(board.walls)) {
    errors.push({ code: 'INVALID_TILES', path: 'board.tiles', message: 'Tiles and walls must be arrays' });
    return { ok: false, errors };
  }

  const tileSet = new Set<string>();
  for (let i = 0; i < board.tiles.length; i++) {
    const t = board.tiles[i];
    if (typeof t.x !== 'number' || typeof t.y !== 'number') {
      errors.push({ code: 'INVALID_COORDINATE', path: `board.tiles[${i}]`, message: 'Coordinate must have numeric x and y' });
      continue;
    }
    const key = coordKey(t);
    if (tileSet.has(key)) {
      errors.push({ code: 'DUPLICATE_COORDINATE', path: `board.tiles[${i}]`, message: `Duplicate tile at ${key}` });
    }
    tileSet.add(key);
    if (t.x < 0 || t.x >= width || t.y < 0 || t.y >= height) {
      errors.push({ code: 'OUT_OF_BOUNDS', path: `board.tiles[${i}]`, message: `Tile ${key} out of bounds` });
    }
  }

  const wallSet = new Set<string>();
  for (let i = 0; i < board.walls.length; i++) {
    const w = board.walls[i];
    const key = coordKey(w);
    if (wallSet.has(key)) {
      errors.push({ code: 'DUPLICATE_COORDINATE', path: `board.walls[${i}]`, message: `Duplicate wall at ${key}` });
    }
    wallSet.add(key);
    if (!tileSet.has(key)) {
      errors.push({ code: 'WALL_OUTSIDE_TILES', path: `board.walls[${i}]`, message: `Wall at ${key} is not in tiles` });
    }
  }

  // Decorations are cosmetic-only and must sit on blocked (wall) tiles so
  // they can never alter the simulation.
  const KNOWN_DECORATIONS: readonly string[] = ['tree'];
  const decorations = Array.isArray(board.decorations) ? board.decorations : [];
  const decorationSet = new Set<string>();
  for (let i = 0; i < decorations.length; i++) {
    const d = decorations[i];
    const key = coordKey(d);
    if (decorationSet.has(key)) {
      errors.push({ code: 'DUPLICATE_COORDINATE', path: `board.decorations[${i}]`, message: `Duplicate decoration at ${key}` });
    }
    decorationSet.add(key);
    if (!wallSet.has(key)) {
      errors.push({ code: 'DECORATION_NOT_BLOCKED', path: `board.decorations[${i}]`, message: `Decoration at ${key} must sit on a wall tile` });
    }
    if (!KNOWN_DECORATIONS.includes(d.kind)) {
      errors.push({ code: 'UNKNOWN_DECORATION', path: `board.decorations[${i}].kind`, message: `Unknown decoration kind: ${d.kind}` });
    }
  }

  const start = l.start;
  const goal = l.goal;
  if (!start || typeof start !== 'object' || !goal || typeof goal !== 'object') {
    errors.push({ code: 'INVALID_START_GOAL', path: 'start', message: 'Start and goal must be objects' });
    return { ok: false, errors };
  }

  const startKey = coordKey(start);
  const goalKey = coordKey(goal);

  if (!tileSet.has(startKey) || wallSet.has(startKey) || !tileSet.has(goalKey) || wallSet.has(goalKey) || startKey === goalKey) {
    errors.push({ code: 'INVALID_START_GOAL', path: 'start', message: 'Start and goal must be distinct non-wall tiles' });
  }

  if (!DIRECTIONS.includes(start.facing)) {
    errors.push({ code: 'INVALID_FACING', path: 'start.facing', message: `Start facing must be one of ${DIRECTIONS.join(', ')}` });
  }

  const gateIds = new Set<string>();
  const allIds = new Set<string>();
  const entityPositions: Record<'collectibles' | 'gates' | 'switches', Set<string>> = {
    collectibles: new Set(),
    gates: new Set(),
    switches: new Set(),
  };

  const collectibles = Array.isArray(l.collectibles) ? l.collectibles : [];
  const gates = Array.isArray(l.gates) ? l.gates : [];
  const switches = Array.isArray(l.switches) ? l.switches : [];

  for (const g of gates) {
    gateIds.add(g.id);
  }

  for (const [name, entities] of [
    ['collectibles', collectibles],
    ['gates', gates],
    ['switches', switches],
  ] as const) {
    for (let i = 0; i < entities.length; i++) {
      const e = entities[i];
      const pos = coordKey(e);
      if (allIds.has(e.id)) {
        errors.push({ code: 'DUPLICATE_ENTITY', path: `${name}[${i}].id`, message: `Duplicate entity ID: ${e.id}` });
      }
      allIds.add(e.id);
      if (entityPositions[name].has(pos)) {
        errors.push({ code: 'DUPLICATE_ENTITY', path: `${name}[${i}]`, message: `Duplicate entity position at ${pos}` });
      }
      entityPositions[name].add(pos);
      if (!tileSet.has(pos) || wallSet.has(pos)) {
        errors.push({ code: 'ENTITY_NOT_WALKABLE', path: `${name}[${i}]`, message: `Entity ${e.id} is not on a walkable tile` });
      }
    }
  }

  if (entityPositions.collectibles.has(startKey)) {
    errors.push({ code: 'PICKUP_ON_START', path: 'collectibles', message: 'Collectible cannot share start tile' });
  }

  for (const pos of entityPositions.gates) {
    if (entityPositions.switches.has(pos)) {
      errors.push({ code: 'SWITCH_GATE_OVERLAP', path: 'gates', message: `Gate and switch overlap at ${pos}` });
    }
  }

  for (const pos of [startKey, goalKey]) {
    if (entityPositions.gates.has(pos) || entityPositions.switches.has(pos)) {
      errors.push({ code: 'INTERACTIVE_START_GOAL', path: 'start', message: `Interactive entity cannot share start or goal at ${pos}` });
    }
  }

  const referencedGates = new Set<string>();
  for (let i = 0; i < switches.length; i++) {
    const s = switches[i];
    if (!Array.isArray(s.opens) || s.opens.length === 0) {
      errors.push({ code: 'INVALID_GATE_REFERENCE', path: `switches[${i}].opens`, message: `Switch ${s.id} does not open any gate` });
      continue;
    }
    for (const gid of s.opens) {
      if (!gateIds.has(gid)) {
        errors.push({ code: 'INVALID_GATE_REFERENCE', path: `switches[${i}].opens`, message: `Switch references nonexistent gate ${gid}` });
      }
      referencedGates.add(gid);
    }
  }

  if (referencedGates.size !== gateIds.size) {
    errors.push({ code: 'UNREFERENCED_GATE', path: 'gates', message: 'Not all gates are opened by a switch' });
  }

  if (l.limits && l.rating && typeof l.rating.parBlocks === 'number' && typeof l.limits.maxBlocks === 'number') {
    if (l.rating.parBlocks > l.limits.maxBlocks) {
      errors.push({ code: 'TARGET_EXCEEDS_CAP', path: 'rating.parBlocks', message: 'Par blocks exceeds maximum block limit' });
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: l as Level };
}

export function validateProgram(program: unknown, level: Level): Result<Program> {
  const errors: ValidationError[] = [];

  if (!program || typeof program !== 'object') {
    return { ok: false, errors: [{ code: 'PROGRAM_SCHEMA', path: '', message: 'Program must be an object' }] };
  }

  const p = program as Record<string, any>;

  if (p.schemaVersion !== 1 || p.engineRulesVersion !== 1) {
    errors.push({ code: 'PROGRAM_VERSION', path: 'schemaVersion', message: 'Invalid program version' });
  }

  if (!Array.isArray(p.commands) || p.commands.length === 0) {
    errors.push({ code: 'EMPTY_PROGRAM', path: 'commands', message: 'Program must contain at least one command' });
    return { ok: false, errors };
  }

  const ids = new Set<string>();
  let staticCost = 0;
  let expandedCount = 0;

  for (let i = 0; i < p.commands.length; i++) {
    const node = p.commands[i];
    if (!node || typeof node !== 'object') {
      errors.push({ code: 'PROGRAM_SCHEMA', path: `commands[${i}]`, message: 'Node must be an object' });
      continue;
    }
    if (typeof node.id !== 'string') {
      errors.push({ code: 'PROGRAM_SCHEMA', path: `commands[${i}].id`, message: 'Node ID missing or invalid' });
      continue;
    }
    if (ids.has(node.id)) {
      errors.push({ code: 'DUPLICATE_NODE_ID', path: `commands[${i}].id`, nodeId: node.id, message: `Duplicate node ID: ${node.id}` });
    }
    ids.add(node.id);
    staticCost++;

    if (!level.commands.includes(node.op)) {
      errors.push({ code: 'COMMAND_NOT_ALLOWED', path: `commands[${i}].op`, nodeId: node.id, message: `Command ${node.op} not allowed in this level` });
    }

    if (PRIMITIVES.has(node.op)) {
      expandedCount++;
    } else if (node.op === 'repeat') {
      if (typeof node.count !== 'number' || node.count < 2 || node.count > 5 || !Number.isInteger(node.count)) {
        errors.push({ code: 'REPEAT_COUNT', path: `commands[${i}].count`, nodeId: node.id, message: 'Repeat count must be integer between 2 and 5' });
      }
      if (!Array.isArray(node.body) || node.body.length === 0) {
        errors.push({ code: 'REPEAT_BODY_EMPTY', path: `commands[${i}].body`, nodeId: node.id, message: 'Repeat body cannot be empty' });
      } else if (node.body.length > 6) {
        errors.push({ code: 'REPEAT_BODY_LIMIT', path: `commands[${i}].body`, nodeId: node.id, message: 'Repeat body cannot exceed 6 primitives' });
      } else {
        for (let j = 0; j < node.body.length; j++) {
          const child = node.body[j];
          if (!child || typeof child !== 'object') {
            errors.push({ code: 'PROGRAM_SCHEMA', path: `commands[${i}].body[${j}]`, message: 'Child node must be an object' });
            continue;
          }
          if (child.op === 'repeat') {
            errors.push({ code: 'NESTED_REPEAT', path: `commands[${i}].body[${j}]`, nodeId: child.id, message: 'Nested repeats are forbidden' });
          } else if (!PRIMITIVES.has(child.op) || !level.commands.includes(child.op)) {
            errors.push({ code: 'COMMAND_NOT_ALLOWED', path: `commands[${i}].body[${j}].op`, nodeId: child.id, message: `Command ${child.op} not allowed in repeat body` });
          }
          if (ids.has(child.id)) {
            errors.push({ code: 'DUPLICATE_NODE_ID', path: `commands[${i}].body[${j}].id`, nodeId: child.id, message: `Duplicate child node ID: ${child.id}` });
          }
          ids.add(child.id);
          staticCost++;
        }
        if (typeof node.count === 'number' && node.count >= 2 && node.count <= 5) {
          expandedCount += node.count * node.body.length;
        }
      }
    } else {
      errors.push({ code: 'UNKNOWN_COMMAND', path: `commands[${i}].op`, nodeId: node.id, message: `Unknown command: ${node.op}` });
    }

    if (expandedCount > 256) {
      errors.push({ code: 'EXPANSION_LIMIT', path: 'commands', message: 'Program expansion exceeds 256 actions' });
      break;
    }
  }

  if (staticCost > 24 || staticCost > level.limits.maxBlocks) {
    errors.push({ code: 'BLOCK_LIMIT', path: 'commands', message: `Block count ${staticCost} exceeds limit ${level.limits.maxBlocks}` });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: p as Program };
}

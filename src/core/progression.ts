import { Awards } from './model';

export interface LevelProgress {
  readonly levelId: string;
  readonly completed: boolean;
  readonly awards: Awards;
  readonly bestBlocks?: number;
  readonly bestActions?: number;
}

export interface PlayerProgress {
  readonly schemaVersion: 1;
  readonly selectedRobotId: string;
  readonly completedLevels: readonly string[];
  readonly levels: Record<string, LevelProgress>;
  readonly settings: {
    readonly soundEnabled: boolean;
    readonly musicEnabled: boolean;
    readonly reducedMotion: boolean;
  };
  readonly unlockedAccents: readonly string[];
  readonly equippedAccent?: string;
  readonly tutorialSeen: readonly string[];
}

export function createInitialProgress(defaultRobotId = 'pip'): PlayerProgress {
  return {
    schemaVersion: 1,
    selectedRobotId: defaultRobotId,
    completedLevels: [],
    levels: {},
    settings: {
      soundEnabled: true,
      musicEnabled: false,
      reducedMotion: false,
    },
    unlockedAccents: [],
    tutorialSeen: [],
  };
}

export function mergeAwards(prev: Awards | undefined, next: Awards): Awards {
  if (!prev) return next;
  return {
    completion: prev.completion || next.completion,
    bonus: prev.bonus || next.bonus,
    efficiency: prev.efficiency || next.efficiency,
  };
}

export function recordLevelSuccess(
  progress: PlayerProgress,
  levelId: string,
  awards: Awards,
  usedBlocks: number,
  actionsUsed: number,
): PlayerProgress {
  const current = progress.levels[levelId];
  const mergedAwards = mergeAwards(current?.awards, awards);

  const bestBlocks = current?.bestBlocks !== undefined
    ? Math.min(current.bestBlocks, usedBlocks)
    : usedBlocks;

  const bestActions = current?.bestActions !== undefined
    ? Math.min(current.bestActions, actionsUsed)
    : actionsUsed;

  const levelRecord: LevelProgress = {
    levelId,
    completed: true,
    awards: mergedAwards,
    bestBlocks,
    bestActions,
  };

  const completedLevels = progress.completedLevels.includes(levelId)
    ? progress.completedLevels
    : [...progress.completedLevels, levelId];

  return {
    ...progress,
    completedLevels,
    levels: {
      ...progress.levels,
      [levelId]: levelRecord,
    },
  };
}

export function isLevelUnlocked(
  _levelId: string,
  worldId: string,
  ordinal: number,
  completedLevels: readonly string[],
): boolean {
  // Ordinal 1 is always unlocked in World 1
  if (worldId === 'w1' && ordinal === 1) {
    return true;
  }

  // Level N is unlocked if level N-1 in same world is completed
  if (ordinal > 1) {
    const prevId = `${worldId}-${String(ordinal - 1).padStart(2, '0')}`;
    return completedLevels.includes(prevId);
  }

  // Ordinal 1 of world W(k) unlocks if previous world has >= 10 completed levels
  if (worldId === 'w2') {
    const w1Completions = completedLevels.filter((id) => id.startsWith('w1-')).length;
    return w1Completions >= 10;
  }
  if (worldId === 'w3') {
    const w2Completions = completedLevels.filter((id) => id.startsWith('w2-')).length;
    return w2Completions >= 10;
  }
  if (worldId === 'w4') {
    const w3Completions = completedLevels.filter((id) => id.startsWith('w3-')).length;
    return w3Completions >= 10;
  }

  return false;
}

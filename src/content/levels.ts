import { Level } from '../core/model';
import { ALL_60_LEVELS } from './levelsData';

export const ALL_LEVELS: readonly Level[] = ALL_60_LEVELS;

export const M1_LEVELS: readonly Level[] = ALL_LEVELS.slice(0, 6);

export function getLevelById(id: string): Level | undefined {
  return ALL_LEVELS.find((l) => l.id === id);
}

export function getLevelsForWorld(worldId: string): readonly Level[] {
  return ALL_LEVELS.filter((l) => l.worldId === worldId);
}

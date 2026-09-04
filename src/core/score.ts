import { Awards, Level, Outcome } from './model';

export function scoreResult(
  level: Level,
  outcome: Outcome,
  usedBlocks: number,
  collected: readonly string[],
): Awards {
  const success = outcome === 'success';
  const bonusIds = level.collectibles
    .filter((c) => c.kind === 'bonus')
    .map((c) => c.id);

  const collectedSet = new Set(collected);
  const bonusMet = bonusIds.every((id) => collectedSet.has(id));
  const efficiencyMet = usedBlocks <= level.rating.parBlocks;

  return {
    completion: success,
    bonus: success && bonusMet,
    efficiency: success && efficiencyMet,
  };
}

export function totalStars(awards: Awards): number {
  return (awards.completion ? 1 : 0) + (awards.bonus ? 1 : 0) + (awards.efficiency ? 1 : 0);
}

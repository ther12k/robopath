import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_LEVELS } from '../../src/content/levels';
import { validateLevel, validateProgram } from '../../src/core/validate';
import { simulate } from '../../src/core/simulate';
import { totalStars } from '../../src/core/score';

describe('All 60 curriculum levels and 3-star witnesses (RP-028 to RP-032)', () => {
  const root = resolve(__dirname, '../fixtures');
  const witnesses: Record<string, any> = JSON.parse(
    readFileSync(resolve(root, 'full_witnesses.json'), 'utf-8'),
  );

  expect(ALL_LEVELS.length).toBe(60);

  for (const level of ALL_LEVELS) {
    it(`validates level ${level.id} (${level.worldId} #${level.ordinal}) and verifies 3-star witness`, () => {
      const valRes = validateLevel(level);
      expect(valRes.ok).toBe(true);

      const prog = witnesses[level.id];
      expect(prog).toBeDefined();

      const progRes = validateProgram(prog, level);
      expect(progRes.ok).toBe(true);
      if (!progRes.ok) return;

      const trace = simulate(level, progRes.value);
      expect(trace.outcome).toBe('success');
      expect(totalStars(trace.awards)).toBe(3);
      expect(trace.awards.completion).toBe(true);
      expect(trace.awards.bonus).toBe(true);
      expect(trace.awards.efficiency).toBe(true);
      expect(trace.usedBlocks).toBeLessThanOrEqual(level.limits.maxBlocks);
    });
  }
});

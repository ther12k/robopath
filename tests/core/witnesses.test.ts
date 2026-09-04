import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateLevel, validateProgram } from '../../src/core/validate';
import { simulate } from '../../src/core/simulate';
import { totalStars } from '../../src/core/score';

interface Fixture {
  level: string;
  program: string;
  expectedOutcome: string;
  expectedStars: number;
}

describe('Reference 12 witnesses ported to production TypeScript core', () => {
  const root = resolve(__dirname, '../../examples');
  const fixtures: Fixture[] = JSON.parse(
    readFileSync(resolve(root, 'fixtures.json'), 'utf-8'),
  );

  for (const f of fixtures) {
    it(`validates and simulates ${f.level} with ${f.program}`, () => {
      const levelData = JSON.parse(readFileSync(resolve(root, f.level), 'utf-8'));
      const progData = JSON.parse(readFileSync(resolve(root, f.program), 'utf-8'));

      const levelRes = validateLevel(levelData);
      expect(levelRes.ok).toBe(true);
      if (!levelRes.ok) return;

      const progRes = validateProgram(progData, levelRes.value);
      expect(progRes.ok).toBe(true);
      if (!progRes.ok) return;

      const trace = simulate(levelRes.value, progRes.value);
      expect(trace.outcome).toBe(f.expectedOutcome);
      expect(totalStars(trace.awards)).toBe(f.expectedStars);
      expect(trace.awards.completion).toBe(true);
      expect(trace.awards.bonus).toBe(true);
      expect(trace.awards.efficiency).toBe(true);
    });
  }
});

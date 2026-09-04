import { Level } from '../core/model';
import { validateLevel } from '../core/validate';

import w1_01_raw from '../../examples/levels/w1-01.json';
import w1_02_raw from '../../examples/levels/w1-02.json';
import w1_03_raw from '../../examples/levels/w1-03.json';
import w1_04_raw from '../../examples/levels/w1-04.json';
import w1_05_raw from '../../examples/levels/w1-05.json';
import w1_06_raw from '../../examples/levels/w1-06.json';

function parseAndValidate(raw: unknown): Level {
  const result = validateLevel(raw);
  if (!result.ok) {
    throw new Error(`Failed to validate level: ${JSON.stringify(result.errors)}`);
  }
  return result.value;
}

export const M1_LEVELS: readonly Level[] = [
  parseAndValidate(w1_01_raw),
  parseAndValidate(w1_02_raw),
  parseAndValidate(w1_03_raw),
  parseAndValidate(w1_04_raw),
  parseAndValidate(w1_05_raw),
  parseAndValidate(w1_06_raw),
];

export function getLevelById(id: string): Level | undefined {
  return M1_LEVELS.find((l) => l.id === id);
}

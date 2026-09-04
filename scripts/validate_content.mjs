import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateLevel, validateProgram } from '../src/core/validate.js';
import { simulate } from '../src/core/simulate.js';

const root = resolve('examples');
const fixtures = JSON.parse(readFileSync(resolve(root, 'fixtures.json'), 'utf-8'));

console.log(`Validating ${fixtures.length} content fixtures against TypeScript production core...`);

for (const f of fixtures) {
  const levelData = JSON.parse(readFileSync(resolve(root, f.level), 'utf-8'));
  const progData = JSON.parse(readFileSync(resolve(root, f.program), 'utf-8'));

  const levelRes = validateLevel(levelData);
  if (!levelRes.ok) {
    console.error(`Level ${f.level} failed validation:`, levelRes.errors);
    process.exit(1);
  }

  const progRes = validateProgram(progData, levelRes.value);
  if (!progRes.ok) {
    console.error(`Program ${f.program} failed validation:`, progRes.errors);
    process.exit(1);
  }

  const trace = simulate(levelRes.value, progRes.value);
  if (trace.outcome !== f.expectedOutcome) {
    console.error(`Mismatch on ${f.level}: expected ${f.expectedOutcome}, got ${trace.outcome}`);
    process.exit(1);
  }

  const stars = (trace.awards.completion ? 1 : 0) + (trace.awards.bonus ? 1 : 0) + (trace.awards.efficiency ? 1 : 0);
  if (stars !== f.expectedStars) {
    console.error(`Star mismatch on ${f.level}: expected ${f.expectedStars}, got ${stars}`);
    process.exit(1);
  }

  console.log(`  ✓ ${f.level}: outcome=${trace.outcome}, stars=${stars}, usedBlocks=${trace.usedBlocks}/${levelRes.value.limits.maxBlocks}`);
}

console.log('All 12 content witnesses validated successfully!');

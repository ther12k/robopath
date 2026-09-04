import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Architecture boundaries and dependency rules', () => {
  it('forbids React, Phaser, DOM, and storage imports inside src/core', () => {
    const coreDir = resolve(__dirname, '../src/core');
    const files = readdirSync(coreDir).filter((f) => f.endsWith('.ts'));

    const forbiddenPatterns = [
      /from\s+['"]react['"]/,
      /from\s+['"]react-dom['"]/,
      /from\s+['"]phaser['"]/,
      /from\s+['"]dexie['"]/,
      /\bwindow\b/,
      /\bdocument\b/,
      /\blocalStorage\b/,
      /\bindexedDB\b/,
    ];

    for (const file of files) {
      const content = readFileSync(resolve(coreDir, file), 'utf-8');
      for (const pattern of forbiddenPatterns) {
        expect(content).not.toMatch(pattern);
      }
    }
  });
});

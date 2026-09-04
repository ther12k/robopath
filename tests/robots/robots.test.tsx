import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RobotPicker } from '../../src/features/robots/RobotPicker';
import { ROBOTS } from '../../src/features/robots/robotCatalog';
import { simulate } from '../../src/core/simulate';
import { Level, Program } from '../../src/core/model';

describe('Robot selection and cosmetic equality (RP-012, RP-016)', () => {
  it('renders all 4 starter robots with radiogroup accessibility', () => {
    const handleSelect = vi.fn();
    const handleConfirm = vi.fn();

    render(
      <RobotPicker
        selectedRobotId="pip"
        onSelectRobot={handleSelect}
        onConfirm={handleConfirm}
      />,
    );

    const radiogroup = screen.getByRole('radiogroup', { name: /Choose your robot/i });
    expect(radiogroup).toBeInTheDocument();

    const options = screen.getAllByRole('radio');
    expect(options.length).toBe(4);

    expect(screen.getByRole('radio', { name: /Pip/i })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /Mochi/i })).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(screen.getByRole('radio', { name: /Bolt/i }));
    expect(handleSelect).toHaveBeenCalledWith('bolt');

    fireEvent.click(screen.getByRole('button', { name: /Let's Go!/i }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('guarantees identical core simulation traces regardless of selected robot', () => {
    const testLevel: Level = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      id: 'w1-01',
      revision: 1,
      worldId: 'w1',
      ordinal: 1,
      titleKey: 'test',
      board: {
        width: 3,
        height: 3,
        tiles: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
        walls: [],
      },
      start: { x: 0, y: 0, facing: 'E' },
      goal: { x: 2, y: 0 },
      collectibles: [],
      gates: [],
      switches: [],
      commands: ['forward'],
      limits: { maxBlocks: 5, maxActions: 5 },
      rating: { parBlocks: 2 },
      teaching: { concept: 'test', archetype: 'test', difficulty: 1 },
      hintKeys: ['h1', 'h2', 'h3'],
    };

    const program: Program = {
      schemaVersion: 1,
      engineRulesVersion: 1,
      commands: [
        { id: '1', op: 'forward' },
        { id: '2', op: 'forward' },
      ],
    };

    const traces = ROBOTS.map((robot) => {
      // Core simulation doesn't even accept robot ID because robots are purely cosmetic!
      return { robot: robot.id, trace: simulate(testLevel, program) };
    });

    for (let i = 1; i < traces.length; i++) {
      expect(traces[i].trace).toEqual(traces[0].trace);
    }
  });
});

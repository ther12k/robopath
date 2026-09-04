import { describe, it, expect, vi } from 'vitest';
import { RunController } from '../../src/features/gameplay/RunController';
import { M1_LEVELS } from '../../src/content/levels';
import { Program } from '../../src/core/model';

describe('RunController lifecycle and playback states (RP-013, RP-014)', () => {
  const level = M1_LEVELS[0]; // w1-01 (Forward, Forward)
  const validProgram: Program = {
    schemaVersion: 1,
    engineRulesVersion: 1,
    commands: [
      { id: '1', op: 'forward' },
      { id: '2', op: 'forward' },
    ],
  };

  it('manages run, acknowledge, step and success states correctly', () => {
    const controller = new RunController(level, 'pip');
    expect(controller.getState()).toBe('editing');

    const stateListener = vi.fn();
    const msgListener = vi.fn();

    controller.subscribe({
      onStateChange: stateListener,
      onStepChange: vi.fn(),
      onTraceComplete: vi.fn(),
      onSendMessage: msgListener,
    });

    const res = controller.run(validProgram);
    expect(res.ok).toBe(true);
    expect(controller.getState()).toBe('running');
    expect(controller.getCurrentStepIndex()).toBe(0);

    const runId = (res as any).value;

    // Acknowledge step 0
    controller.acknowledge({
      type: 'action_displayed',
      runId,
      levelRevision: level.revision,
      actionIndex: 0,
    });

    expect(controller.getCurrentStepIndex()).toBe(1);

    // Acknowledge step 1 (final success step)
    controller.acknowledge({
      type: 'action_displayed',
      runId,
      levelRevision: level.revision,
      actionIndex: 1,
    });

    expect(controller.getState()).toBe('success');
  });

  it('ignores stale acknowledgments from previous run IDs', () => {
    const controller = new RunController(level, 'pip');
    const res1 = controller.run(validProgram);
    const runId1 = (res1 as any).value;

    // Reset immediately
    controller.reset();
    expect(controller.getState()).toBe('editing');

    // Run again
    const res2 = controller.run(validProgram);
    const runId2 = (res2 as any).value;
    expect(runId2).not.toBe(runId1);

    // Inject stale ack from runId1
    controller.acknowledge({
      type: 'action_displayed',
      runId: runId1,
      levelRevision: level.revision,
      actionIndex: 0,
    });

    // Current step should still be 0 of runId2!
    expect(controller.getCurrentStepIndex()).toBe(0);
    expect(controller.getState()).toBe('running');
  });

  it('supports pause, resume, and single-step advancing exactly one primitive', () => {
    const controller = new RunController(level, 'pip');
    const res = controller.run(validProgram);
    const runId = (res as any).value;
    expect(controller.getCurrentStepIndex()).toBe(0);

    // Acknowledge step 0
    controller.acknowledge({
      type: 'action_displayed',
      runId,
      levelRevision: level.revision,
      actionIndex: 0,
    });
    // Step 1 is now active. Pause at boundary
    controller.pause();
    expect(controller.getState()).toBe('paused');

    // In paused mode, single step executes the pending step
    controller.step();
    expect(controller.getCurrentStepIndex()).toBe(1);

    // Acknowledging step 1 completes execution
    controller.acknowledge({
      type: 'action_displayed',
      runId,
      levelRevision: level.revision,
      actionIndex: 1,
    });

    expect(controller.getState()).toBe('success');
  });
});

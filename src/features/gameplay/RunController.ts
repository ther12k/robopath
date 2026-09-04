import {
  Level,
  Program,
  Result,
  RunTrace,
  State,
  Step,
} from '../../core/model';
import { AnimationAck, PlaybackState, SceneMessage } from '../../bridge/messages';
import { validateProgram } from '../../core/validate';
import { simulate } from '../../core/simulate';

export interface RunControllerListener {
  onStateChange: (state: PlaybackState) => void;
  onStepChange: (stepIndex: number, currentStep: Step | null, currentState: State) => void;
  onTraceComplete: (trace: RunTrace) => void;
  onSendMessage: (msg: SceneMessage) => void;
}

export class RunController {
  private level: Level;
  private robotId: string;
  private playbackState: PlaybackState = 'editing';
  private runIdCounter = 0;
  private currentRunId = '';
  private trace: RunTrace | null = null;
  private currentStepIndex = -1;
  private isStepping = false;
  private listeners: Set<RunControllerListener> = new Set();

  constructor(level: Level, robotId: string) {
    this.level = level;
    this.robotId = robotId;
  }

  public subscribe(listener: RunControllerListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getState(): PlaybackState {
    return this.playbackState;
  }

  public getTrace(): RunTrace | null {
    return this.trace;
  }

  public getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  public getCurrentState(): State {
    if (!this.trace || this.currentStepIndex < 0) {
      return {
        ...this.level.start,
        collected: [],
        openedGates: [],
        actionsUsed: 0,
      };
    }
    return this.trace.steps[this.currentStepIndex].after;
  }

  public setLevel(level: Level, robotId?: string): void {
    this.reset();
    this.level = level;
    if (robotId) this.robotId = robotId;
    this.broadcastMessage({
      type: 'load',
      runId: this.currentRunId,
      level: this.level,
      robotId: this.robotId,
      state: this.getCurrentState(),
    });
  }

  public setRobotId(robotId: string): void {
    if (this.playbackState === 'running' || this.playbackState === 'paused') {
      return; // Do not switch robot during active run
    }
    this.robotId = robotId;
    this.broadcastMessage({
      type: 'load',
      runId: this.currentRunId,
      level: this.level,
      robotId: this.robotId,
      state: this.getCurrentState(),
    });
  }

  public run(programRaw: unknown): Result<string> {
    if (this.playbackState === 'running') {
      return { ok: true, value: this.currentRunId };
    }

    const valResult = validateProgram(programRaw, this.level);
    if (!valResult.ok) {
      return { ok: false, errors: valResult.errors };
    }

    const program = valResult.value as Program;
    this.trace = simulate(this.level, program);
    this.runIdCounter++;
    this.currentRunId = `run-${this.runIdCounter}-${Date.now().toString(36)}`;
    this.currentStepIndex = -1;
    this.isStepping = false;

    this.setState('running');

    if (this.trace.steps.length === 0) {
      this.finishPlayback();
      return { ok: true, value: this.currentRunId };
    }

    this.advanceToNextStep();
    return { ok: true, value: this.currentRunId };
  }

  public pause(): void {
    if (this.playbackState !== 'running') return;
    this.setState('paused');
  }

  public resume(): void {
    if (this.playbackState !== 'paused') return;
    this.setState('running');
    this.advanceToNextStep();
  }

  public step(): void {
    if (this.playbackState !== 'paused') return;
    this.isStepping = true;
    this.advanceToNextStep();
  }

  public reset(): void {
    this.runIdCounter++;
    this.currentRunId = `run-${this.runIdCounter}`;
    this.currentStepIndex = -1;
    this.trace = null;
    this.isStepping = false;

    this.setState('editing');
    this.broadcastMessage({
      type: 'snap',
      runId: this.currentRunId,
      state: this.getCurrentState(),
    });
  }

  public acknowledge(ack: AnimationAck): void {
    if (ack.runId !== this.currentRunId || ack.levelRevision !== this.level.revision) {
      // Stale or duplicate acknowledgment from previous run
      return;
    }

    if (ack.actionIndex !== this.currentStepIndex) {
      // Out of sequence acknowledgment
      return;
    }

    if (this.playbackState !== 'running' && !this.isStepping) {
      return;
    }

    if (this.isStepping) {
      this.isStepping = false;
      if (this.trace && this.currentStepIndex >= this.trace.steps.length - 1) {
        this.finishPlayback();
      } else {
        this.setState('paused');
      }
      return;
    }

    if (this.trace && this.currentStepIndex >= this.trace.steps.length - 1) {
      this.finishPlayback();
    } else {
      this.advanceToNextStep();
    }
  }

  private advanceToNextStep(): void {
    if (!this.trace) return;

    const nextIndex = this.currentStepIndex + 1;
    if (nextIndex >= this.trace.steps.length) {
      this.finishPlayback();
      return;
    }

    this.currentStepIndex = nextIndex;
    const step = this.trace.steps[this.currentStepIndex];

    this.broadcastStepChange(this.currentStepIndex, step, step.after);

    this.broadcastMessage({
      type: 'animate',
      runId: this.currentRunId,
      levelRevision: this.level.revision,
      step,
      durationMs: 380,
    });
  }

  private finishPlayback(): void {
    if (!this.trace) return;

    if (this.trace.outcome === 'success') {
      this.setState('success');
    } else {
      this.setState('retry');
    }

    for (const listener of this.listeners) {
      listener.onTraceComplete(this.trace);
    }
  }

  private setState(state: PlaybackState): void {
    this.playbackState = state;
    for (const listener of this.listeners) {
      listener.onStateChange(this.playbackState);
    }
  }

  private broadcastStepChange(stepIndex: number, step: Step | null, state: State): void {
    for (const listener of this.listeners) {
      listener.onStepChange(stepIndex, step, state);
    }
  }

  private broadcastMessage(msg: SceneMessage): void {
    for (const listener of this.listeners) {
      listener.onSendMessage(msg);
    }
  }

  public destroy(): void {
    this.listeners.clear();
    this.broadcastMessage({
      type: 'dispose',
      runId: this.currentRunId,
    });
  }
}

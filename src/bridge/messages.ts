import { Level, State, Step } from '../core/model';

export type PlaybackState =
  | 'loading'
  | 'load_error'
  | 'editing'
  | 'running'
  | 'paused'
  | 'success'
  | 'retry';

export type SceneMessage =
  | { type: 'load'; runId: string; level: Level; robotId: string; state: State }
  | { type: 'animate'; runId: string; levelRevision: number; step: Step; durationMs: number }
  | { type: 'snap'; runId: string; state: State }
  | { type: 'dispose'; runId: string };

export interface AnimationAck {
  readonly type: 'action_displayed';
  readonly runId: string;
  readonly levelRevision: number;
  readonly actionIndex: number;
}

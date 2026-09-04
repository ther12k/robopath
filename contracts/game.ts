/** Proposed rules-v1 boundary. Interfaces are not a production implementation. */
export type Facing = 'N' | 'E' | 'S' | 'W';
export type PrimitiveOp = 'forward' | 'left' | 'right';
export type CommandOp = PrimitiveOp | 'repeat';
export interface Coordinate { readonly x: number; readonly y: number }
export interface Primitive { readonly id: string; readonly op: PrimitiveOp }
export interface Repeat { readonly id: string; readonly op: 'repeat'; readonly count: 2|3|4|5; readonly body: readonly Primitive[] }
export type Node = Primitive | Repeat;
export interface Program { readonly schemaVersion: 1; readonly engineRulesVersion: 1; readonly commands: readonly Node[] }
/** Empty arrays may be editor drafts; runtime validation distinguishes runnable programs. */
export type Draft = Program;
export interface Level {
  readonly schemaVersion: 1; readonly engineRulesVersion: 1;
  readonly id: string; readonly revision: number; readonly worldId: string; readonly ordinal: number; readonly titleKey: string;
  readonly board: {readonly width:number; readonly height:number; readonly tiles:readonly Coordinate[]; readonly walls:readonly Coordinate[]};
  readonly start: Coordinate & {readonly facing:Facing}; readonly goal:Coordinate;
  readonly collectibles:readonly (Coordinate & {readonly id:string;readonly kind:'required'|'bonus'})[];
  readonly gates:readonly (Coordinate & {readonly id:string})[];
  readonly switches:readonly (Coordinate & {readonly id:string;readonly opens:readonly string[]})[];
  readonly commands:readonly CommandOp[];
  readonly limits:{readonly maxBlocks:number;readonly maxActions:number};
  readonly rating:{readonly parBlocks:number};
  readonly teaching:{readonly concept:string;readonly archetype:string;readonly difficulty:number};
  readonly hintKeys:readonly string[];
}
export interface State extends Coordinate {
  readonly facing:Facing; readonly collected:readonly string[];
  readonly openedGates:readonly string[]; readonly actionsUsed:number;
}
export interface CompiledAction { readonly op:PrimitiveOp; readonly nodeId:string; readonly topLevelIndex:number; readonly iteration?:number }
export interface Step {
  readonly actionIndex:number; readonly source:CompiledAction;
  readonly before:State; readonly after:State;
  readonly events:readonly ({readonly kind:'collect';readonly id:string}|{readonly kind:'open_gate';readonly id:string})[];
  readonly blocked?:{readonly target:Coordinate;readonly reason:'void'|'wall'|'closed_gate'};
}
export interface Awards { readonly completion:boolean;readonly bonus:boolean;readonly efficiency:boolean }
export type Outcome = 'success'|'blocked'|'incomplete'|'out_of_actions';
export interface RunTrace { readonly initial:State;readonly steps:readonly Step[];readonly final:State;readonly outcome:Outcome;readonly usedBlocks:number;readonly awards:Awards }
export interface ValidationError { readonly code:string;readonly path:string;readonly nodeId?:string;readonly message:string }
export type Result<T> = {readonly ok:true;readonly value:T}|{readonly ok:false;readonly errors:readonly ValidationError[]};
export interface Core {
  validateLevel(input:unknown):Result<Level>;
  validateProgram(input:unknown,level:Level):Result<Program>;
  simulate(level:Level,program:Program):RunTrace;
}
export type PlaybackState = 'loading'|'load_error'|'editing'|'running'|'paused'|'success'|'retry';
export type SceneMessage =
  | {type:'load';runId:string;level:Level;robotId:string;state:State}
  | {type:'animate';runId:string;levelRevision:number;step:Step;durationMs:number}
  | {type:'snap';runId:string;state:State}
  | {type:'dispose';runId:string};
export interface AnimationAck { readonly type:'action_displayed';readonly runId:string;readonly levelRevision:number;readonly actionIndex:number }
export interface RunController {
  readonly state:PlaybackState;
  run(draft:Draft):Result<string>; pause():void; resume():void; step():void;
  reset():void; destroy():void; acknowledge(event:AnimationAck):void;
}

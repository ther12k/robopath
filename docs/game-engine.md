# Deterministic game and execution contract

This document is normative for engine rules version **1**. Example code is a reference oracle for the specification, not a production game implementation. Any disagreement among mockup art, incidental labels and these rules resolves in favor of these rules and the PRD. Document and test intentional changes.

## 1. Coordinates and board state

A board is at most 8×8 cells. Coordinates start at `(0,0)` in the logical upper-left; +x is east, +y is south. Facing is `N`, `E`, `S`, or `W`. The board’s `tiles` array enumerates walkable coordinates; a missing tile is a void. Optional `walls` make listed tiles impassable. Optional `board.decorations` place cosmetic scenery (e.g. trees) on wall tiles only; decorations are rendered with painter’s-order depth so the robot passes behind and in front of them, but have no rule effect. There is no physics, continuous collision, diagonal movement, pushing, jump, height traversal or moving obstacle.

Start and goal each occupy a valid, non-wall tile and must be distinct. Neither can contain a gate or switch. Collectibles have unique IDs and positions; their kind is `required` (battery) or `bonus` (star). A collectible may share a traversable switch/gate tile; it may not share the start. Each switch has a unique position, unique ID and one or more existing gate IDs in `opens`. Every gate must be referenced by a switch; switches and gates cannot share a tile. Gate tiles must not be walls. All board coordinates and entity IDs must be unique where applicable and within bounds.

Initial state contains start position/facing, an empty collected-ID set, empty opened-gate set and zero actions used. There are no initial auto-triggers because start cannot share an interactive entity. Cosmetic robot ID, time of day, frame rate, music and canvas size are excluded from state.

## 2. Program grammar

```text
Program := sequence of 1–24 Nodes
Node := Forward | Left | Right | Repeat
Repeat := count in [2,5], body of 1–6 primitive nodes
Primitive := Forward | Left | Right
```

Nested repeats are rejected in v1. Every node has a unique stable ID within a program. UI node IDs are maintained when reordered; pasted/duplicated nodes get new IDs. A node is not a JavaScript snippet and may not contain executable source.

Allowed commands are a per-level subset of `forward`, `left`, `right`, `repeat`. A repeat body must also use allowed primitives. Empty editor slots are UI affordances, not serialized instructions. Incomplete repeats can exist in editor draft state but cannot be serialized as a runnable validated program. Preserve such drafts separately; do not pretend they satisfy the strict program schema.

The static block cost is the count of every node, including each repeat header and each body child once. The complete AST is counted before execution, including commands after an early success. Expanded primitive actions are compiled with source `nodeId`, top-level index and optional repeat iteration. Expansion is bounded at 256 actions even before applying the level’s tighter action cap.

## 3. Validation order and errors

First limit raw file bytes, then JSON parsing, then schema validation, then semantic validation. A level file is ≤128 KiB; program/import limits are in the security and persistence docs. Reject unknown schema/rules versions, unknown fields, excessive depth and oversized arrays before simulation. The public app never “repairs” malformed remote data silently.

A run requires a valid level and a valid program. Invalid level content is a loading/content error, not a child’s failed puzzle. Invalid programs produce structured errors with node IDs and stable codes: `EMPTY_PROGRAM`, `UNKNOWN_COMMAND`, `COMMAND_NOT_ALLOWED`, `BLOCK_LIMIT`, `REPEAT_BODY_EMPTY`, `REPEAT_COUNT`, `NESTED_REPEAT`, `DUPLICATE_NODE_ID` or `EXPANSION_LIMIT`. Serialization/schema failures are surfaced before these semantic codes as `PROGRAM_SCHEMA`.

A program that is structurally valid but walks into a wall is not invalid input: it is an understandable gameplay result. A valid Run increments the session’s attempt counter once when playback begins. Attempts are not used for ratings, unlocks or rewards.

## 4. One action: exact sequence

Before each compiled primitive action, if `actionsUsed >= maxActions`, stop with `out_of_actions` without consuming another action. Otherwise increment `actionsUsed` by one and capture the before-state.

For Left or Right, rotate facing by -1 or +1 modulo four and remain on the tile. For Forward, compute the next coordinate. A missing tile, wall or unopened gate causes `blocked`; the robot stays on its current tile, facing does not change and the attempted action remains counted. The blocked trace records target coordinate and reason (`void`, `wall`, `closed_gate`) but does not run entry effects.

On successful Forward: move to the destination; collect its collectible once; apply its switch by adding all named gates to the open set; then test success. Switches latch open for the attempt; stepping off or revisiting does not close them. Required collectibles and opened gates are sets, not counters vulnerable to repeated visits.

After every successful primitive action, success is true when the robot is at the goal and every required collectible is present. Success wins over action exhaustion at that same step. Stop immediately on success. Entering the goal without required collectibles does not stop; the child may leave and return. If the program ends without success, result is `incomplete`. If more commands exist but the next would exceed the cap, result is `out_of_actions`.

Consequently, a program ending exactly at the action cap but away from the goal is `incomplete`; a program that needs another action after that cap is `out_of_actions`. Preserve this distinction in fixtures. A failed final movement attempt returns `blocked`, not action exhaustion.

## 5. Outcomes and ratings

A trace contains initial state, zero or more action steps and a terminal result. Each step includes action index, primitive, source node ID, repeat iteration when relevant, before/after state and entry events. Do not store mutable Set references in a trace; use immutable sorted arrays or copied sets. Serialization sorts ID sets lexically for deterministic fixtures.

`success` permits scoring. Base-completion award is always true. All-bonus award is true when every `kind=bonus` item was collected; an empty bonus set satisfies this condition. Efficiency award is true when the full static block cost is at most `parBlocks`. Earned star count is the sum of the three booleans.

Persist the **union of award bits**, not only the maximum integer count: collecting the bonus on one successful attempt and meeting efficiency on another may complete the level’s display. Display best blocks/actions from successful attempts separately; do not combine minima into a fictitious single run. For three-star validation, however, content must still include at least one single witness satisfying all three awards simultaneously. If multiple three-star programs exist, accept all of them.

Unsuccessful runs do not alter completion awards. Replaying a completed level does not repeatedly grant a milestone badge. Level completion and newly unlocked cosmetics commit atomically and idempotently by completion receipt/run ID.

## 6. Playback state machine

```text
loading → editing → running ↔ paused
   ↓          ↑         ↓        ↓
load_error    └──── reset ────────┘
                        ↓
                  success | retry
                        ↓
                    editing
```

Run snapshots the draft and content revision, validates them, computes the trace and increments `runId`. An in-progress run cannot be mutated by editor actions. An animation acknowledgment commits the next trace step only when its run ID and expected action index match. Core results are computed in advance but completion/progress is only committed when playback reaches the terminal success action. Canceling before that point grants nothing.

Pause freezes at the last committed action boundary. If a tween is partway through the next action, cancel it and snap to the last committed state; resume replays that uncommitted action. This explicit boundary behavior is preferable to ambiguous half-tile state. Single Step is enabled in paused mode and displays exactly one primitive (including an iteration inside a repeat), then remains paused unless terminal. Speed changes affect animation time only, never the trace or score.

Reset immediately cancels the old run ID, stops effects/audio associated with it, restores initial board state and enters editing with the draft intact. Clear Program is a different editor action with undo; never overload Reset to delete a child’s work. Retry similarly restores the board and keeps the draft. Next Level changes content only after a confirmed completion transaction or explicit visible storage-failure handling.

On page hidden, orientation change requiring scene recreation or graphics loss, pause at the last committed boundary. Returning to visibility does not auto-run. Full page reload restores the latest draft and progress, but not an in-flight animation; show the initial board. Destroy/mount must not retain old acknowledgments or duplicate event listeners.

## 7. Determinism and test invariants

Every replay of the same normalized inputs has identical actions, results and award bits. The board never moves diagonally, enters a missing/walled/closed-gate tile or collects one ID twice. Turning four times restores facing. Reset restores all switches and collectibles. A robot skin change produces an identical trace. Success at the final allowed action is accepted. Closed-gate entry is blocked before any collectible on that tile is collected. A repeat header costs a block but no action; its source mapping survives editing/reordering.

Use golden traces for at least one loop, one gate, one optional-detour solution and every outcome type. Property-based tests can explore primitive round trips, bounded termination, rotations and serialization. Test the production TypeScript core against supplied reference witnesses, then maintain production-core fixtures rather than treating the Python oracle as the runtime authority.

## 8. Solver evidence boundaries

A shortest-path solver for primitive actions can validate reachability under position/facing/collected/opened-gate state. It does not by itself prove the smallest block program when repeats exist. A bounded AST search can establish a minimum block count only within its stated grammar, limits and exhausted search space. Reports must say `witness_verified`, `minimum_proven_within_bounds`, `counterexample_found` or `search_inconclusive`.

Never label an unproven threshold “optimal.” The UI says “Block target,” not “world record.” The reference fixtures validate witnesses, not educational quality or a global optimum. See `content-authoring.md` for the content gate.

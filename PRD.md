# Robo Paths — Product Requirements Document

**Version:** 1.0 planning baseline · **Date:** 2026-09-05  
**Status:** Ready for implementation planning; not a released or implemented product.  
**Working title:** Robo Paths; product owner must clear the final name and artwork before public release.

## 1. Product promise

A child chooses a friendly robot, arranges tactile command blocks and watches a small floating world respond. Each attempt teaches through visible consequences rather than a lecture. The child can repair an idea, find a different route or use fewer blocks without losing access to play.

The desired feeling is **a toy that teaches programming**, not a programming course with a game layered on top. Minimal text, readable spatial puzzles and satisfying robot behavior are the core product. Robot selection is part of the experience, not a cosmetic menu added after gameplay.

## 2. Inputs, assumptions and decisions

The user explicitly requested mobile-first responsive play, isometric worlds, symbolic drag-and-drop programming, gradual instruction, limits and efficiency, meaningful level diversity, scalability and selectable robots. This document adds concrete rules so an agent can implement rather than invent missing behavior.

Proposed audience: children approximately **6–10**, with optional adult co-play; pre-readers need the visual tutorial and optional spoken/audio cues. This age range is a design hypothesis, not a validated educational claim. Proposed sessions are 5–15 minutes with unrestricted stopping. English is the first language, but text must be externalized.

Bright Meadow is the working art direction from the supplied boards. All alternatives remain in `design/mockups/`; no final art-direction approval is implied. The written mechanics override contradictory placeholder labels in the images, especially “Moves,” coins, XP, gems, hearts, directional arrows and robot ability names.

## 3. Goals and non-goals

The product should make sequence, facing, debugging, repetition and state changes understandable through experimentation. It should make a second attempt easier to reason about than the first. It should accept every rule-valid solution rather than compare the player with a single hardcoded answer. It should stay readable on a phone, usable without dragging, and playable after a downloaded world loses connectivity.

V1 deliberately excludes multiplayer, accounts, social features, generative AI, external content creation, coding text, nested loops, conditionals, functions, a full 3D camera, physics simulation, classroom dashboards, payments, advertisements, energy/life systems and production telemetry. Native stores and a visual authoring GUI are later options, not launch dependencies. Do not add a backend or a WASM runtime to this browser game without a new decision record.

## 4. Players and primary journeys

**First-time explorer:** opens the site, taps Play, chooses one of four robots, sees a three-second movement demonstration, places a command and runs it. The board and command slot remain visible during instruction. No registration or installation is required to try the game.

**Experimenting player:** opens an available level, studies its shape, builds a program, watches the highlighted block and robot move together, pauses or steps, and edits the retained program after a retry. A missed turn should be understandable from the final tile, facing arrow and highlighted command.

**Returning player:** opens Continue, sees the chosen robot and saved world state, resumes a saved draft from its initial board state and optionally pursues a bonus or smaller program. A lower-scoring replay never removes a previous reward.

**Adult supporter:** reads the local-data explanation, changes sound/motion settings, exports progress or explicitly erases it. Any future networked feature requires a separate privacy and product review; a simple parent gate does not establish identity or legal consent.

## 5. Core loop and interaction model

Choose robot → choose puzzle → observe objective → assemble program → run and observe → celebrate or revise → choose next puzzle.

The main screen contains a compact level header, required-objective indicators, a large isometric board, the program strip, the available command palette and a persistent primary action. Advanced panels must not obscure the robot or block order. On larger screens, the editor moves beside the board rather than stretching the phone interface.

Move Forward advances one logical tile in the robot’s current direction. Turn Left and Turn Right rotate 90 degrees without changing its tile. They are curved-arrow icons, never unlabeled horizontal arrows that imply sideways movement. Required batteries and optional bonus stars are collected automatically upon entry. A flag is the goal. The first valid arrival at the flag with all required batteries completes the run immediately, even when unused commands remain.

Repeat wraps a primitive-only body and runs it 2–5 times. A floor switch opens specified gates until reset. There is no separate pickup, interact or jump command in v1. Decoration has no collision unless represented explicitly in the level data.

## 6. Limits, ratings and experimentation

**Blocks** measure the whole written program: each primitive is one block and a repeat costs one block plus its body’s blocks. A repeat containing Move, Right, Move, Left therefore costs five blocks, not one. **Actions** measure executed primitive operations, including turns and blocked attempted moves. A repeat header itself is not an action. The UI never merges these concepts into one ambiguous “moves” counter.

Each level supplies a hard maximum block count and action count. Run rejects invalid structure or a block-cap violation before starting. During execution, an action cap stops further actions; running out of program before meeting the objective is a different outcome. Invalid input is not charged as a failed level attempt. There are no finite retries or real-time countdowns.

Ratings are independent award bits: one star for completion; one for completing while collecting every optional bonus star (automatically met when none exist); one for completing with `usedBlocks <= parBlocks`. Best earned bits are retained across successful runs. Three-star attainability must be witnessed in content validation. A short route that ignores a bonus can still be a successful two-star run. Efficiency never blocks access to the next ordinary puzzle.

Hints are authored, not generated live. The child chooses successive tiers: show the destination/needed object; emphasize a useful region or facing cue; suggest a command pattern. No hint reduces stars. A later full solution demonstration is outside v1; tutorial demonstrations teach mechanics on their own miniature board.

## 7. Progression and release content

Four worlds each contain 15 levels:

| World | Working theme | New idea | Content intent |
|---|---|---|---|
| W1 Sunny Meadow | Grass, water, flowers | Sequence, facing, debugging | Early turns, varied starts, optional detours, multiple pickups and constrained routes. |
| W2 Pebble Workshop | Stones and playful machinery | Bounded repetition | Repeated strides, stairs, mixed bodies, prefix/suffix programs and compression choices. |
| W3 Crystal Grove | Crystals and garden gates | Switch-controlled state | Opening paths, ordering switches, backtracking and route planning with loops. |
| W4 Sky Isles | Floating islands and clouds | Transfer and synthesis | New combinations and topology; no unannounced command type. |

Within a world, level 1 starts available. Completing level N opens N+1. The next world becomes available after **10 completed levels** in the previous world, so its last five puzzles can act as optional mastery challenges. Stars are not an unlock currency. The manifest must not place a prerequisite teaching level after that world’s tenth level when it is needed in the next world. A locked level explains the completion requirement visually. A downloaded-state icon is separate from progression locks.

The **first playable milestone contains six Meadow levels**. These must already differ in topology or decision, rather than being the same straight path with a new skin. The package includes 12 executable example/witness pairs and a 60-level curriculum brief. The remaining release levels still require authoring, rule validation and human playtesting. Their existence is not claimed by the planning target.

Four starter robots are free: **Pip** (white/blue explorer), **Mochi** (pink rounded bot), **Bolt** (yellow utility bot), and **Sprout** (white/green garden bot). All have the same movement, timing, collision footprint, budgets and visibility. No gender, intelligence or difficulty stereotype is attached to a robot. Additional accents or badges are earned through completion; changing characters never alters a puzzle solution.

## 8. Functional requirements

### FR-001 — Immediate play

A new player can enter robot choice and the first puzzle without account, age entry, purchase, download wall or compulsory text tutorial.

### FR-002 — Choose a robot

Four visibly robotic starter characters are freely selectable, cosmetic-only and interchangeable without resetting progress.

### FR-003 — World and level discovery

World cards and numbered level nodes show completed, available, upcoming and offline-unavailable states distinctly.

### FR-004 — Visual program editor

Add, insert, reorder, replace, remove, clear and undo command blocks with deterministic program order and visible capacity.

### FR-005 — Equivalent input methods

Every programming action works with touch drag, tap-to-place and keyboard; no hover-only or drag-only essential action.

### FR-006 — Run control

Run, pause, resume, single-step and reset show exactly the authoritative execution trace; editing is disabled while playing.

### FR-007 — Helpful outcomes

Success, collision, unfinished route, action limit and invalid-program states have different, non-shaming feedback and preserve the draft.

### FR-008 — Explicit constraints

Program blocks and executed actions are separate limits. The full AST counts for blocks; each primitive action costs one action.

### FR-009 — Bounded repeat

World 2 introduces repeat 2–5 times with a nonempty primitive-only body. No nested, conditional or infinite loops in v1.

### FR-010 — Switches and gates

World 3 introduces auto-triggered floor switches that permanently open named gates for the current attempt; reset closes them.

### FR-011 — Progressive discovery

Short skippable visual demonstrations introduce only the next needed command and can be replayed on demand.

### FR-012 — Gentle hints

Authored hints progress from goal cue to spatial cue to command-pattern cue; no timers, payment or reward penalties.

### FR-013 — Transparent ratings

Each level earns up to three persistent stars for completion, collecting all bonus stars and meeting the block target; best awards never decrease.

### FR-014 — Lightweight rewards

Earn badges and cosmetic accents from completion milestones; no currency, loot boxes, streak pressure, character power or paid hints.

### FR-015 — Local progress

Save the robot, settings, drafts and best results locally; export, validated import and erase are available in the grown-up area.

### FR-016 — Honest offline play

Shell and confirmed-downloaded worlds work offline. Missing packs are unavailable, not incorrectly labeled locked or ready.

### FR-017 — Responsive interface

Play at 360 CSS pixels wide and above, with portrait, landscape, tablet and desktop arrangements and safe-area support.

### FR-018 — Accessible play

Provide semantic controls, visible focus, motion reduction, non-color signals, accessible program order and an equivalent textual board explorer.

### FR-019 — Audio and motion

Animation and sound reinforce outcomes but are never required; sound starts only after interaction and settings persist.

### FR-020 — Data-driven content

Versioned JSON defines worlds, robots, levels and programs; no special case based on a level ID in the simulator.

### FR-021 — Substantial level library

Public v1 contains 60 authored levels in four 15-level worlds, with a six-level first playable slice and documented diversity review.

### FR-022 — Content validation

Every released level has schema checks, semantic checks, replayable witnesses and tested three-star attainability; proof claims are bounded.

### FR-023 — Child-focused privacy

No child accounts, personal profiles, advertising, chat, trackers or remote gameplay analytics in v1; hosting data practices require human review.

### FR-024 — Settings and grown-up area

Expose sound, reduced motion, replay tutorial and storage controls; protect destructive actions with explicit confirmation, not a false consent claim.

### FR-025 — Recovery

Interrupted runs, corrupt saves, asset errors, storage denial, multiple tabs and graphics loss recover without silently awarding or erasing progress.

### FR-026 — Localization readiness

English is the v1 content language; all user text uses locale keys, supports expansion and avoids language baked into game assets.

### FR-027 — Safe parsing and delivery

Reject malformed, oversized or incompatible content and imports; never eval program data or accept arbitrary asset/script URLs.

### FR-028 — Evidence-led quality

Use headless rule tests, component interaction tests, browser journeys, manual accessibility review and recorded physical-device measurements.

### FR-029 — Controlled release

Deploy immutable static builds with tested base paths, cache lifecycle, compatible saves and rollback; public release requires human sign-off.

### FR-030 — Learning validation

Conduct guardian-consented formative playtests and examine independent command use, retry behavior and puzzle diversity without claiming proven learning gains.

## 9. Non-functional requirements and proposed budgets

These are implementation targets, not measurements already achieved.

| ID | Requirement and gate |
|---|---|
| NFR-01 | Pure deterministic rules: identical validated level/program/rules versions produce identical traces and outcomes, independent of robot, frame rate or animation speed. |
| NFR-02 | Initial route transfer budget ≤2.5 MiB compressed including initial robot previews and boot assets; first playable world pack ≤8 MiB compressed. Report bytes by resource and justify exceptions. |
| NFR-03 | On the recorded baseline Android device, first usable puzzle ≤5 seconds under a documented 10 Mbps/100 ms RTT cold-cache profile; warmed same-world level changes ≤750 ms. |
| NFR-04 | On baseline hardware, target 60 fps; at least 95% of movement frames ≤33.3 ms during a 60-second measured scene. A low-effects mode must retain all game information. |
| NFR-05 | Tap feedback starts within 100 ms at p95 in a 100-interaction local test; no input depends on animation completion except authoritative playback sequencing. |
| NFR-06 | Primary interactive targets ≥48×48 CSS pixels with ≥8 px recommended separation; body copy ≥16 px where feasible; no essential command becomes smaller to fit more slots. |
| NFR-07 | A bounded level/program must terminate; hard import size, AST depth, board size, expanded-action and asset limits are enforced before expensive processing. |
| NFR-08 | Zero unresolved P0 or P1 defects at public release. Unsupported environment states provide actionable UI, not a blank canvas. |
| NFR-09 | Production makes no third-party runtime requests by default. Hosting access logs, build telemetry and dependencies must be reviewed separately. |
| NFR-10 | A downloaded pack is immutable/versioned and only labeled ready when every required asset and content file is verified and committed. |
| NFR-11 | Accessibility, browser compatibility, legal readiness and educational efficacy are never claimed solely from automated tests or this document. |

A baseline hardware inventory is established in RP-040 before performance acceptance: one modest Android phone, one iPhone, one tablet and one desktop. Record exact hardware, OS, browser, power mode, network settings and build SHA. Use browser versions available at test time; do not invent version support from emulator settings.

## 10. Product validation

Run a formative study with roughly 6–8 guardian-consented participants across the proposed age range; this is a directional usability sample, not statistically representative educational research. Proposed signals: at least 80% place and run a first command after the demonstration without verbal rescue; most participants can explain which block caused a visible turn; observed retries involve deliberate editing rather than random repeated tapping. Record actual results, uncertainty and accessibility barriers, not a fabricated pass rate.

No session-time target or engagement streak is a success metric. Track local debugging counters only in research/developer builds, export manually by an adult, and remove identifiers. Public v1 does not transmit gameplay events. A stalled child session can reveal a UI or puzzle-design problem even when the code is correct.

## 11. Public v1 acceptance

The 60-level manifest loads, all levels have replayable valid witnesses and an attainable three-star result, all four robots work everywhere, and unlock rules never require optional efficiency. Every editor operation is possible without dragging. Playback, pause, step, reset and visibility changes agree with the rule trace. Local save failures are visible and non-destructive. Offline-world and update behavior passes browser and physical-device tests. The app passes the release matrix, art/license review and adult privacy review, and has no unresolved critical/high-severity defects.

The product owner signs off on the chosen visual direction, child playtest findings, public name, final assets, supported environments and release decision. Agents may implement and prepare evidence but must not fabricate these approvals.

## 12. Open choices and change control

The default stack and mechanics are specified. Public brand name, exact dependency patches, final robot art, baseline devices, hosting provider, target launch jurisdictions and any monetization remain owner decisions. Use `docs/decisions-and-risks.md` to record them. Do not block the six-level internal slice on final art or store credentials; use clearly labeled local placeholders.

Any change to commands, rating semantics, world prerequisites, save shape or level rules requires an explicit version/migration decision plus updates to fixtures, tests, UI and this PRD. Changes to taste can be proposed without changing simulation rules. Refer to `docs/game-engine.md` for exact execution ordering, `docs/ui-ux.md` for screen behavior, and `backlog/README.md` for implementable work.

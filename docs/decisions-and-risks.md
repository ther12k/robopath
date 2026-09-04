# Decisions, assumptions and risks

## Decision records

| ID | Decision | Status and consequence |
|---|---|---|
| ADR-001 | Web-first React/TypeScript/Phaser/Vite | Working baseline accepted from prior stack direction; exact dependency matrix is RP-002. |
| ADR-002 | Pure deterministic TypeScript core | Required architecture; rendering must not own game rules. |
| ADR-003 | Sprite-based isometric 2D | Default; no 3D runtime or camera rotation in v1. |
| ADR-004 | Robots are cosmetic-only | Required for shared validated content; four free starters. |
| ADR-005 | Local-first, no accounts/backend | V1 scope; hosting privacy still requires review. |
| ADR-006 | Bounded primitive-only repeat bodies | V1 limit; nested loops/conditionals are explicitly deferred. |
| ADR-007 | Switches latch gates open per attempt | V1 rule; do not implement toggle or hold-to-open behavior. |
| ADR-008 | 60 levels, four worlds, six-level slice | Proposed release scope; only 12 examples are supplied. |
| ADR-009 | Completion-based unlocks | Ten prior-world completions unlock the next; stars remain optional mastery. |
| ADR-010 | Bright Meadow working direction | Proposed, not final approval; retain alternatives in design gallery. |
| ADR-011 | English first, locale-ready | Additional languages need content review; no live machine translation for children. |
| ADR-012 | Capacitor later | Optional M5; does not block web release or remove signing/testing work. |

## Owner decisions still required

Public product name and rights clearance; art-direction approval; final source/production assets; exact baseline test devices; hosting/provider/logging policy; launch jurisdictions/privacy review; participant recruitment/consent; public deployment authorization; any later commercial model. Agents can proceed on the documented defaults for internal prototypes while marking these unresolved.

## Main risks and mitigations

**Phone program editor becomes cramped.** Prototype tap/drag/keyboard behavior at 360 px before adding long repeat programs. Use folding/reflow, not smaller targets. Owner: UX + frontend; gate: M1 and RP-039.

**Mockup beauty masks unavailable production art.** Separate source-board references from sprite deliverables. Approve one art slice, then produce repeatable atlases. Owner: art; gate: RP-033.

**Repetitive/poorly scaffolded puzzles.** Track topology and decisions, enforce diversity review and observe real children. Do not equate a solver witness with enjoyable learning. Owner: content; gates: RP-028–032 and RP-044/047.

**Engine major/API drift.** Spike current candidate on actual target environments, pin, remove telemetry and record migration rationale. Owner: platform; gate: RP-002.

**Storage loss or mixed-version offline content.** Use honest wording, export, transactional progress, staged pack installs and coordinated updates. Owner: storage/platform; gates: RP-035–038.

**Unjustified accessibility/privacy claims.** Supply equivalent DOM board inspection, manual assistive-tech tests and human jurisdiction review. Owner: product + reviewers; gates: RP-039/041/044/049.

**Scope explosion.** No accounts, monetization, AI, 3D, functions or public level creator in v1. M5 issues are opt-in and excluded from default GitHub import.

**AI agent marks a planning target complete.** Require test evidence, explicit not-run statuses and small pull requests. No completion based solely on checking boxes or copying generated files.

## Change process

Create a short ADR with problem, options, selected behavior, affected requirement IDs and migration/tests. Update the PRD, schemas, reference fixtures, production core and relevant issues together. A factual upstream change does not automatically justify a product change. Record unresolved conflicts instead of silently rewriting approved behavior.

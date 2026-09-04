# Delivery plan and agent execution order

## Work in gates, not one giant code generation

Start M0 with RP-001 → RP-002 → RP-003, then RP-004 and RP-005. Choose and pin a working stack before building dozens of screens. The agent should use repository inventory to adjust proposed paths, not overwrite existing code.

For M1, parallelize only after shared contracts stabilize: core (RP-006–008), editor (RP-009–010), rendering/bridge (RP-011–014), shell/robot/tutorial/results (RP-015–018), storage (RP-019) and initial content (RP-020). Some dependencies are numerically later: RP-016 needs RP-019. The task manifest—not number order—is authoritative. RP-021 is the first integrated playable gate.

M2 adds repeat, gates and full content tools before completing the four worlds. RP-032 must precede final content approvals. Content and art work can proceed alongside implementation, but every shipped level must replay through the actual core. M3 hardens art, offline, saves, accessibility, devices and research. M4 verifies the exact release candidate and requires a human decision. M5 is opt-in and never part of the default web-v1 completion claim.

## Roles

A platform lead owns repository/toolchain/deployment. A gameplay engineer owns deterministic rules/controller. A frontend engineer owns semantic input and responsive UI. An artist owns robot/tile production and provenance. A level designer owns curriculum/witnesses. QA/accessibility reviewers own real environment evidence. A product owner owns final art, research permission, public claims and release authorization. One person or agent may cover several roles, but cannot self-invent unavailable human approvals.

## Parallel-work rules

Each change owns a bounded file area and contracts are agreed before parallel edits. Core/schema changes need fixture updates and editor/renderer consumers reviewed. Do not run two agents on the same working tree without branch/worktree coordination. Avoid whole-repository formatting or dependency upgrades in feature tasks. Use one pull request per coherent task; large tasks can be split while preserving the parent acceptance criteria.

## Progress reports

At every stop, report issue IDs completed, actual commands/results, screenshots or trace evidence, changed files, blockers, next eligible issues and unresolved owner decisions. Update a status table with `not_started`, `in_progress`, `blocked`, `in_review` or `done`; do not treat the immutable planning manifest as proof of completion. Public claims follow evidence, not the calendar.

## Estimates

No reliable calendar estimate is supplied because team capacity, final art, device availability and child-study recruitment are unknown. S/M/L are relative sizes. Re-estimate after M1 using actual implementation and art throughput. A six-level slice is not a substitute for the full 60-level v1 gate, and waiting for native app stores is not required to validate the web experience.

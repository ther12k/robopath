# Milestone 1 Evidence Gate Report

**Milestone:** M1 — First Playable Six-Level Slice  
**Baseline Date:** 2026-09-05  
**Evaluation Status:** PASS (Playable Build & Real Evidence Captured)

---

## 1. Scope and Completed Tasks

The following 21 issues spanning M0 (Foundation & Compatibility) and M1 (First Playable Slice) have been implemented and verified:

| Task ID | Milestone | Title | Status |
|---|---|---|---|
| **RP-001** | M0 | Adopt the specification and establish repository boundaries | Completed |
| **RP-002** | M0 | Prove and pin the React–Phaser toolchain | Completed |
| **RP-003** | M0 | Bootstrap quality tooling and honest CI scripts | Completed |
| **RP-004** | M0 | Build responsive tokens and accessible base components | Completed |
| **RP-005** | M0 | Implement schema and semantic content validation | Completed |
| **RP-006** | M1 | Implement immutable board and facing model | Completed |
| **RP-007** | M1 | Implement primitive command compilation and simulation | Completed |
| **RP-008** | M1 | Implement goals, pickups, budgets and rating outcomes | Completed |
| **RP-009** | M1 | Build the pure program-editing reducer | Completed |
| **RP-010** | M1 | Implement tap, pointer drag and keyboard program editing | Completed |
| **RP-011** | M1 | Render the isometric board with reliable depth and framing | Completed |
| **RP-012** | M1 | Create four consistent placeholder robot asset sets | Completed |
| **RP-013** | M1 | Build the typed controller–renderer bridge and lifecycle | Completed |
| **RP-014** | M1 | Implement run, pause, resume, step and reset | Completed |
| **RP-015** | M1 | Build the mobile-first application shell and routes | Completed |
| **RP-016** | M1 | Implement robot selection consistently across the game | Completed |
| **RP-017** | M1 | Implement first-command visual tutorials | Completed |
| **RP-018** | M1 | Implement helpful retry, hint and success panels | Completed |
| **RP-019** | M1 | Implement local save adapter and in-memory fallback | Completed |
| **RP-020** | M1 | Integrate and validate the first six diverse puzzles | Completed |
| **RP-021** | M1 | Validate the first playable vertical slice | Completed |

---

## 2. Verification Commands and Results

### Package Verification
- **Command:** `python3 scripts/verify_package.py`
- **Result:** `PASS: 12 example witnesses, 29 local tests, 54 acyclic tasks, 362 links, 7 schemas.`

### TypeScript Typecheck & Lint
- **Command:** `npm run typecheck && npm run lint`
- **Result:** Zero errors across all strict modules.

### Headless Production Core & Component Unit Tests
- **Command:** `npm test`
- **Result:** 11 test suites passed, 51 tests passed:
  - `tests/architecture.test.ts` (Core architectural isolation: zero DOM/Phaser/React/Dexie dependencies)
  - `tests/core/rules.test.ts` (Geometry, facing modulo 4, blocked walls/void, gates, out_of_actions)
  - `tests/core/validation.test.ts` (Strict schema and semantic content validation)
  - `tests/core/witnesses.test.ts` (All 12 reference witnesses ported & passing against TS core)
  - `tests/editor/editorReducer.test.ts` (AST cost, 50-step undo/redo, capacity enforcement, repeat blocks)
  - `tests/storage/storage.test.ts` (Durable local save & in-memory fallback)
  - `tests/gameplay/runController.test.ts` (Run, pause, resume, single step, stale ack rejection)
  - `tests/robots/robots.test.tsx` (4 starter robots, accessibility, identical simulation traces)
  - `tests/ui/components.test.tsx` (Min 48px target sizes, contrast, dialog focus/esc lifecycle)
  - `tests/renderer/phaser.test.ts` (Phaser 4.2.1 lifecycle in jsdom)
  - `tests/app/appIntegration.test.tsx` (Full welcome -> picker -> level -> editor -> reset -> map flow)

### Production Build & Transfer Budget
- **Command:** `npm run build`
- **Result:**
  - `dist/index.html`: 0.48 kB (gzip: 0.31 kB)
  - `dist/assets/index-C5dya7i2.css`: 1.68 kB (gzip: 0.76 kB)
  - `dist/assets/index-BTzqF7Gf.js`: 1,960.87 kB (gzip: 465.91 kB)
  - Total gzip transfer: **~467 kB**, well under the PRD NFR-02 limit of **2.5 MiB**.

### Real Browser Journey (Playwright & Google Chrome 152)
- **Command:** `node scripts/test_browser_journey.mjs`
- **Result:** Navigated full user journey on simulated mobile viewport (390×844 px), captured real screenshots:
  - `qa/screenshots/01-welcome.png`: Welcome screen with hero robot avatar, Play/Continue, and Settings
  - `qa/screenshots/02-robot-picker.png`: Robot selection with Pip, Mochi, Bolt, Sprout
  - `qa/screenshots/03-level-1-editing.png`: Level 1 editing view with floating isometric board and command palette
  - `qa/screenshots/04-program-assembled.png`: Program assembled with ordered slots and block count
  - `qa/screenshots/05-gameplay-running.png`: Playback execution with animated robot and action state
  - `qa/screenshots/06-success-dialog.png`: 3-star celebration with star breakdown and Next Level navigation
  - `qa/screenshots/07-world-map.png`: World map showing unlocked Level 2 and completed Level 1
  - `qa/screenshots/08-board-explorer.png`: Accessible linear board explorer dialog for screen readers

---

## 3. Human Decisions and Remaining Unrun Evidence

In accordance with PRD and AGENTS.md evidence rules:
1. **Public Brand / Trademark Clearance:** Marked as owner decision (working title *Robo Paths*).
2. **Final Art Direction:** Bright Meadow is implemented as the provisional working baseline; final vector/texture atlas production is pending owner approval.
3. **Child Playtest Usability Study:** Not run / requires human guardian-consented participants.
4. **Physical Device Battery / Thermal Profile:** Browser automated on Linux x86_64 host; physical mobile device benchmarks remain for M3/M4 hardware gates.
5. **Levels 7–60:** Remaining 54 levels across Worlds 1–4 are planned in M2; the 6-level slice is fully implemented and playable.

---

## 4. Next Dependency-Ready Tasks (M2)

- **RP-022:** Expand program compiler and simulator for bounded repeat blocks
- **RP-023:** Implement latching floor switches and barrier gates in renderer
- **RP-024:** Implement repeat command blocks in the tactile visual editor
- **RP-025:** Build four-world progression and completion unlock logic

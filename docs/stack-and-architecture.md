# Stack and architecture

## 1. Technology decision

Use **React + TypeScript + Phaser + Vite**, custom CSS/design tokens, Dexie for local IndexedDB and Vitest/Playwright for tests. Start as a single application repository with separable modules, not a microservice system or an unnecessary monorepo. Optional Capacitor packaging is M5 and is not required for web v1.

The official React template currently demonstrates Phaser 4, but includes its own tool versions and an optional build-time `log.js` network call [S01]. The official 4.2.1 release is a concrete compatibility-spike candidate [S02]. Do **not** blindly paste Phaser 3 examples into a Phaser 4 project. RP-002 must pin an exact proven set of React, React DOM, Phaser, TypeScript, Vite, Node and test-tool versions in `docs/implementation/toolchain.md` and the lockfile. Start with Node 24 LTS as the proposed runtime for development/CI [S05]; verify the chosen Vite requirements [S03]. No dependency matrix has been installed/tested in this planning package.

Remove template telemetry calls and unused demo content before continuing. If the candidate fails on baseline browsers, document the issue and explicitly choose a tested supported alternative rather than silently changing engine major. React/Phaser is the chosen product direction; Ionic, React Native, Flutter, Kotlin, server rendering and WASM are not simultaneous requirements.

## 2. Proposed repository layout

```text
src/
  app/              # routes, app shell, settings, startup recovery
  ui/               # semantic buttons, dialogs, badges, layout tokens
  features/
    robots/         # robot picker and cosmetic preview
    worlds/         # progression/map/level cards
    editor/         # pure edit reducer + DOM program editor
    gameplay/       # run controller, HUD, outcomes, hint UI
    settings/       # adult area, storage controls
  core/             # no DOM, React, Phaser, IndexedDB or wall-clock imports
    model.ts
    validate.ts
    compile.ts
    simulate.ts
    score.ts
    progression.ts
  renderer/         # Phaser scene, projection, sprites, effects
  bridge/           # typed controller→scene messages and animation acknowledgments
  storage/          # Dexie adapter, save migration, export/import
  offline/          # pack manager and service-worker protocol
  content/          # validated runtime manifests / locale strings
public/assets/      # built, versioned runtime art/audio only
content/            # authored level/world/robot source JSON
scripts/content/    # authoring validation, bounded solver, diversity report
schemas/            # shipped contract schemas
 tests/              # core, integration, browser and fixtures
```

Normalize indentation in the real repository; this is a folder ownership proposal, not an existing code inventory. Do not ship this entire design kit or solution witnesses in the production bundle by accident. Known solutions are build/test data; tutorial/hint content is intentionally shipped. This is not an anti-cheat claim for a client-side game.

## 3. Ownership and data flow

The core validates a level/program and returns an immutable deterministic trace. The run controller owns `runId`, current logical step, playback state and cancellation. Phaser displays a projection of that trace and acknowledges completed animation steps. React renders the current committed state, program and controls. Persistence consumes completion transactions from the controller, never callbacks from a sparkle or sound effect.

```text
Validated content → core rules ← immutable program snapshot
                           ↓
                    execution trace
                           ↓
                    run controller
                 ↙        ↓         ↘
          DOM controls  renderer   save transaction
```

The core knows nothing about the chosen robot. The renderer never calculates score, collects objects independently, selects the next command, or mutates save data. React does not receive per-frame sprite positions. Pass immutable state at action boundaries. Put frequent tween/frame work entirely inside the renderer.

## 4. Module contracts

`validateLevel` returns typed semantic errors after schema validation. `validateProgram` checks allowed commands, node IDs, caps and repeat structure. `simulate` accepts only normalized validated inputs and produces `RunTrace`. `scoreResult` derives award bits from a successful result plus the full static block cost. `mergeProgress` unions award bits and completed levels, and chooses valid best metrics without adding replay rewards twice.

`RunController` supports load, run, pause, resume, step, reset and destroy. Scene messages include `runId`, `levelRevision`, action index and immutable state. Acknowledgments with obsolete IDs are ignored. Destroy always removes subscriptions, textures owned by the scene, listeners, timers and canvas resources. Account for React development setup/cleanup behavior [S06].

The reference `contracts/game.ts` describes the proposed boundary; the implementation must test it, not assume interface declarations alone prove behavior. Runtime validation remains mandatory because TypeScript types do not validate parsed JSON.

## 5. Rendering choice

Use sprite-based 2D isometric rendering, not physical 3D. Logical coordinates are integers. Project tile centers with `screenX=(x-y)*tileWidth/2`, `screenY=(x+y)*tileHeight/2`; use a consistent sprite-foot anchor. Decorative elevation is visual only. No walkable multi-height tiles in v1.

Sort objects by ground-foot depth with deterministic tie-breaking, not texture top edges. Test a robot passing both sides of tall scenery. Scale the board camera to the available board rectangle; do not scale DOM controls with the canvas. Probe the pinned scale APIs [S07]. Constrain device-pixel-ratio/render resolution after actual device measurements. Texture atlases should be loaded per pack, with shared robot assets kept separately.

## 6. Service boundaries

There is no application backend, database server, authentication provider or HTTP gameplay API. Static HTTPS hosting serves the build and versioned packs [S04]. Development tooling may use Node; this does not mean the deployed game needs a Node server. Hosting bandwidth, storage, domains and operational review are not claimed to cost zero.

Dexie is only the local IndexedDB adapter [S08]. Keep a storage interface to enable an in-memory fallback and a future native adapter. Future cloud synchronization requires a new identity/privacy/conflict design; it must not be simulated by silently uploading local files.

## 7. Build and development contract

RP-003 creates real implementations for `dev`, `build`, `preview`, `typecheck`, `lint`, `test`, `test:e2e`, `content:validate`, `content:verify-solutions`, and `assets:check`. Do not install a placeholder script that prints success. Lock dependencies and use reproducible clean installs in CI. Build development diagnostics out of public production output. Use stable data-test IDs on meaningful DOM controls, not art filenames.

Proposed CI order: install → typecheck/lint → schema/core tests → content and asset checks → production build → browser tests against the build. Physical-device, child playtest, legal and final-art gates are separately recorded human evidence.

## References

[S01–S08 and S14–S18](sources.md). Facts about upstream projects are as reviewed on 2026-09-05; recheck exact APIs and requirements when pinning.

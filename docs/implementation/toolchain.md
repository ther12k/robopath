# Pinned Toolchain and Verification

Reviewed & pinned on: **2026-09-05**

## Pinned Core Dependencies

| Package | Version | Purpose |
|---|---|---|
| Node.js | v22.23.2 (system runtime) / Node 24 target | Execution runtime |
| React | 19.0.0 | User interface & semantic DOM controls |
| React DOM | 19.0.0 | DOM rendering for React |
| Phaser | 4.2.1 | 2D isometric rendering presentation engine |
| Vite | 6.2.0 | Bundler and development server |
| TypeScript | 5.7.3 | Static typecheck & contracts enforcement |
| Vitest | 3.0.7 | Headless unit & integration test runner |
| Dexie | 4.0.11 | Local IndexedDB persistence adapter |
| jsdom | 26.0.0 | Headless DOM environment for React tests |

## Telemetry Audit

- Phaser 4.2.1 package audited: No `log.js` telemetry or network calls present.
- Vite build audited: Static local bundle without external HTTP calls or CDN dependencies.
- No analytics or remote telemetry added.

## Strict Mode & Lifecycle Contract

Phaser requires strict container management to prevent duplicate canvases when React StrictMode mounts, unmounts, and remounts components. The bridge controller handles cleanup via `game.destroy(true)` on unmount.

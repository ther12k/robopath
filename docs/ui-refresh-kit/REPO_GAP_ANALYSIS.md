# Repo gap analysis for `ther12k/robopath`

## What the public repo already gets right

Based on the public repository structure and manifest, the project is already pointed in the correct technical direction:

- **Stack**: React + TypeScript + Phaser + Vite + Dexie.
- **Code structure**: `src/app`, `src/core`, `src/renderer`, `src/storage`, `src/ui`, `src/features`, `src/content`, `src/offline`, `src/bridge`.
- **Intent**: a mobile-first coding puzzle game, not a generic app shell.

That means the main problem is **not** “wrong framework.” The problem is that the visual language is still not close enough to the design boards.

## The likely UI gap

From the repo shape and your feedback, the most common causes are:

1. **System-looking HTML controls** instead of custom toy-like components.
2. **Weak art assets** or placeholder art.
3. **Flat spacing hierarchy** — screens do not breathe the way the mockups do.
4. **Gameplay canvas and surrounding UI feel disconnected**.
5. **Robot choice exists logically but not emotionally** — the design wants the robot picker to feel like a reward moment.
6. **Command blocks are functional but not collectible-looking**.
7. **World/level cards lack a strong card system**.
8. **Typography and color contrast are inconsistent across screens**.

## What to keep

Keep these parts unless you discover a severe implementation problem:

- **Phaser** for the board.
- **React** for shell, overlays, dialogs, onboarding, robot picker, level cards, progress.
- **Dexie** for local progress.
- **Vite** for development/build.
- The existing domain split between core logic and renderer.

## What to change first

### Priority 1 — visual foundation
- Introduce a locked design token set.
- Replace generic buttons/cards with the provided custom asset-backed components.
- Standardize the command block system.
- Standardize world, level, and result panels.

### Priority 2 — robot identity
- Add a strong robot-selection screen.
- Ensure the selected robot appears in:
  - splash/home,
  - world/level header,
  - gameplay board,
  - success panel,
  - profile/progress.

### Priority 3 — Phaser/React visual bridge
- Match background colors, shadows, and card radii between DOM UI and canvas scene.
- Use Phaser only for the board and board-adjacent animation.
- Do not draw the whole app shell inside Phaser.

## Anti-patterns to avoid

- Do not bring in **Material UI**, **Bootstrap**, or **Ionic components** for the player-facing shell. They will push the product away from the desired toy-like look.
- Do not rebuild the whole project in Flutter just to solve a polish problem.
- Do not let the Phaser canvas become a dumping ground for all UI.
- Do not rely on color alone for meaning.

## Success criteria for the refresh

A refreshed screen should be recognizable as part of the mockup family even before final animation or production art arrives.

If a screenshot from the repo can sit beside the reference boards without feeling like a different product, the bridge is working.

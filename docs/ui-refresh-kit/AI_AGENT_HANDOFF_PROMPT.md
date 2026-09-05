# AI agent handoff prompt

```text
You are working on the public repo `ther12k/robopath`.

Goal: refresh the UI and asset system so the implementation looks much
closer to the provided Robo Paths design boards.

Important constraint: do not rewrite the app into another framework.
Keep the current React + TypeScript + Phaser + Vite + Dexie baseline.
The main issue is design execution and asset polish, not stack choice.

Use the provided `robopath-ui-refresh-kit` package as the source of truth
for the visual refresh.

Read first:
- README.md
- docs/REPO_GAP_ANALYSIS.md
- docs/LIBRARY_DECISIONS.md
- docs/ASSET_USAGE_GUIDE.md
- docs/DESIGN_TOKENS.md
- docs/IMPLEMENTATION_SEQUENCE.md

Then inspect the target repo and report:
- current branch,
- commit SHA,
- working tree state,
- existing UI components,
- existing Phaser preload pipeline,
- existing robot/content models.

Implementation direction:
1. Keep Phaser for the puzzle board.
2. Keep React for the app shell and programming tray.
3. Add dnd-kit for accessible drag and reorder interactions.
4. Add Framer Motion for shell micro-interactions.
5. Add Howler for lightweight sound cues.
6. Use the supplied SVG assets under public/assets.
7. Use the snippets as starter code, but adapt them to the repo.

Design rules:
- The chosen robot must appear consistently across the full flow.
- Command blocks must be colorful, toy-like, and immediately legible.
- The app shell must feel playful, not enterprise-like.
- Do not introduce Material UI, Bootstrap, or Ionic components.
- Do not move all UI into Phaser.
- Preserve keyboard and tap alternatives for drag interactions.

Ship the refresh in this order:
- buttons + card system,
- robot picker,
- command tray,
- level/world cards,
- success panel,
- Phaser board art bridge,
- motion and sound polish.

At each checkpoint provide:
- files changed,
- screenshots,
- commands run,
- what still differs from the design,
- the next best improvement.
```

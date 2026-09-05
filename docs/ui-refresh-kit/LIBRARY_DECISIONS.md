# Library decisions

## Keep

### 1. Phaser
Keep Phaser for the board renderer and movement animation.

Use it for:
- isometric tile rendering,
- robot movement,
- pickups,
- goal celebration,
- board highlights,
- scene transitions inside gameplay.

Do **not** use it for the whole app shell.

### 2. React
Keep React for:
- home/splash,
- robot selection,
- world map shell,
- level selection,
- command tray,
- dialogs,
- tutorial coach marks,
- rewards and profile.

### 3. Dexie
Keep Dexie for:
- selected robot,
- unlocked levels,
- star history,
- saved command drafts,
- settings.

## Add

### 4. `@dnd-kit/core` + `@dnd-kit/sortable`
Add this for the command-programming tray.

Why:
- better accessibility than hand-rolled drag/drop,
- works well with React,
- easy to support both drag and tap-to-place flows.

Use it for:
- dragging command blocks into slots,
- reordering blocks,
- removing blocks,
- keyboard drag interactions.

### 5. `framer-motion`
Add this for DOM-side micro-interactions.

Use it for:
- card entrance,
- button press scale,
- tutorial sheets,
- success/reward panel transitions,
- robot selection emphasis.

Do not use it for core board movement; keep that inside Phaser.

### 6. `howler`
Add this for lightweight audio.

Use it for:
- tap/click,
- block placement,
- run start,
- pickup,
- soft fail,
- success.

### 7. `clsx`
Add this for clean component variants and stateful class composition.

## Optional

### 8. `class-variance-authority`
Useful if you want a formal variant system for buttons/chips/cards.

### 9. `lucide-react`
Optional for engineering-only or admin icons. For player-facing command icons, prefer the custom SVG assets in this package.

## Not recommended for this repo

- **Material UI** — too app-like and enterprise-looking.
- **Bootstrap** — wrong visual language.
- **Ionic UI kit** — unnecessary if the app is already React web + Phaser.
- **Huge global state frameworks** — likely overkill unless the app grows much further.

## Suggested install set

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/accessibility framer-motion howler clsx
```

## Architecture rule of thumb

- **React** owns layout and controls.
- **Phaser** owns the board.
- **Core engine** owns puzzle truth.
- **Dexie** owns persistence.

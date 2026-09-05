# Asset usage guide

## Goal

The assets in this package are not meant to be the final art bible. They are a **starter asset layer** so the current repo can move closer to the target design fast.

## Recommended repo placement

Inside your existing repo, place them under:

```text
public/assets/
  icons/
  command-blocks/
  robots/
  robots/avatars/
  world/
  ui/
```

## What each asset group is for

### `assets/icons/`
Small reusable icons.

Use in:
- icon buttons,
- HUD buttons,
- objective chips,
- badges,
- tabs.

### `assets/command-blocks/`
Large colorful block tiles for the visual programming tray.

Use in:
- the command palette,
- the current program queue,
- tutorial steps.

### `assets/robots/`
Robot front-view illustrations for selection cards, empty states, and rewards.

### `assets/robots/avatars/`
Smaller circular versions for:
- top bars,
- profile cards,
- progress modules,
- success screens.

### `assets/world/`
Starter environment pieces.

Use in:
- Phaser preload,
- board rendering,
- lightweight mock scenes,
- level thumbnails.

### `assets/ui/`
Panel and button backgrounds that help unify the shell.

Use in:
- cards,
- modal backgrounds,
- bottom sheets,
- primary button wrappers,
- level cards.

## Practical usage pattern

### React DOM
Use SVGs directly in `<img>` tags or as CSS background images.

Example:

```tsx
<img src="/assets/robots/avatars/pip-avatar.svg" alt="Pip" />
```

### Phaser
Preload them by asset key:

```ts
this.load.svg('tile-grass', '/assets/world/grass-tile.svg');
this.load.svg('robot-pip', '/assets/robots/pip-front.svg');
```

For Phaser, use SVG for prototyping and switch high-frequency animated runtime sprites to packed PNG atlases later if performance or consistency requires it.

## Naming convention

Keep semantic names. Good examples:
- `robot-pip`
- `block-turn-left`
- `tile-grass`
- `ui-level-card`

Avoid random one-off names like:
- `icon3-final`
- `newbutton_v2`
- `robotcool`

## Immediate minimum implementation

If you want the fastest visible improvement, wire these first:

1. `robots/avatars/*`
2. `command-blocks/*`
3. `ui/button-primary.svg`
4. `ui/level-card-bg.svg`
5. `icons/star.svg`
6. `world/grass-tile.svg`, `flag.svg`, `star-goal.svg`

That alone will make the repo look much more aligned with the mockups.

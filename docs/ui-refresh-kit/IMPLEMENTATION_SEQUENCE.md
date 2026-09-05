# Implementation sequence

## Phase 1 — visible wins in 1 to 2 days

1. Add the libraries from `LIBRARY_DECISIONS.md`.
2. Copy the starter SVG assets into `public/assets/`.
3. Replace generic button styles.
4. Replace command block visuals.
5. Add robot avatar + selection card styling.
6. Update home screen, world list, and success panel to use the new assets.

This phase alone should make the product look much closer to the reference direction.

## Phase 2 — bridge React and Phaser

1. Preload the new world assets in Phaser.
2. Make sure the board background palette matches the React shell.
3. Use the selected robot asset on the board.
4. Create lightweight level thumbnail scenes or static preview cards.

## Phase 3 — interaction polish

1. Add dnd-kit command placement.
2. Add tap-to-place alternative interactions.
3. Add Framer Motion transitions.
4. Add sound effects through Howler.

## Phase 4 — production-quality asset pipeline

1. Convert prototype SVG runtime art to packed PNG atlases only where needed.
2. Define world themes and asset manifests.
3. Expand robot animation states.
4. Replace any placeholder art from the starter kit.

## Recommended ownership split

### Product/design
- sign off on the chosen mockup direction,
- approve robot personality and naming,
- approve block visual language,
- approve final component states.

### Frontend/UI engineer
- implement shell components,
- integrate dnd-kit,
- wire Framer Motion,
- apply tokens consistently.

### Phaser/gameplay engineer
- preload and place art,
- align board rendering with shell tokens,
- animate robot and pickups,
- keep core rules untouched.

## Definition of done for the refresh

A refreshed playable slice is done when:
- home, robot picker, world/level, gameplay, and success all share the same design language,
- the selected robot carries through the entire flow,
- the command tray looks like collectible toy blocks,
- the board no longer feels visually disconnected from the shell,
- and screenshots feel like they belong to the reference family.

# Integration file map

Use this mapping as a practical bridge into the current repo.

## Suggested destination paths in `ther12k/robopath`

### Assets
- `assets/icons/*` → `public/assets/icons/*`
- `assets/command-blocks/*` → `public/assets/command-blocks/*`
- `assets/robots/*` → `public/assets/robots/*`
- `assets/robots/avatars/*` → `public/assets/robots/avatars/*`
- `assets/world/*` → `public/assets/world/*`
- `assets/ui/*` → `public/assets/ui/*`

### UI layer
- `snippets/design-tokens.css` → merge into `src/ui/tokens.css`
- `snippets/primary-button.css` → merge into `src/ui/polish.css` or a new component stylesheet
- `snippets/PrimaryButton.tsx` → adapt into `src/ui/Button.tsx`
- `snippets/LevelCard.tsx` → adapt into a level-card component under `src/features/levels/` or `src/ui/`
- `snippets/RobotPicker.tsx` → implement under `src/features/robots/`
- `snippets/CommandTray.tsx` → adapt under `src/features/programming/` or the existing command UI module

### Game renderer
- `snippets/phaserPreload.ts` → merge into the Phaser preload/scene setup under `src/renderer/`
- `snippets/robotCatalog.ts` → merge into `src/content/` or `src/features/robots/`

### Audio
- `snippets/useGameAudio.ts` → adapt under `src/ui/` or `src/features/audio/`

## Implementation tip

Do not paste snippets blindly. Treat them as **shape references**. The repo already has a structure; fit the ideas into that structure cleanly.

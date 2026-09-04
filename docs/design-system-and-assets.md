# Design system, robot art and asset delivery

## 1. Tokens and component language

Use a bright meadow palette: ink `#17324D`, pale sky `#EFF9FD`, white surfaces, primary blue `#246FE5`, action green `#207A46`, sunny accent `#F5BD35`, soft coral `#E77A70` and repeat purple `#7056C8`. These are **proposed tokens**, not a contrast-certified combination. Test each actual foreground/background/disabled/focus pairing; prefer dark ink on yellow and white on sufficiently dark blue/green. Error meaning never depends only on red.

Spacing scale: 4, 8, 12, 16, 24, 32 px. Panel radii: 20–24 px; command tiles: 12–16 px; primary buttons: 16 px. Prefer a restrained shadow and 2 px focus ring with offset. Body type 16–18 px; titles 24–32 px; captions should not carry essential instructions. Start with system sans-serif fonts so the prototype has no font-file dependency. A future rounded display font needs a documented license and fallback.

Components: `IconButton`, `PrimaryButton`, `RobotCard`, `WorldCard`, `LevelNode`, `ObjectiveChip`, `BlockCounter`, `ActionCounter`, `CommandTile`, `InsertionSlot`, `RepeatGroup`, `PlaybackControls`, `HintSheet`, `ResultPanel`, `StorageNotice`, `ConfirmDialog` and `BoardExplorer`. All have loading, disabled and focus states; game state cannot be inferred from disabled styling alone.

Command conventions: forward = upward/forward chevron with directional stem; left/right = unmistakably curved turning arrows; repeat = loop outline plus repeat count. Required pickup = battery; optional pickup = star; goal = flag; switch/gate pairs share a shape and pattern as well as color. Accessible names are not part of the texture.

## 2. Source-board inventory and intended use

`design/README.md` maps the five supplied mockup boards. The Bright Meadow board is the default mood reference; Bold Blue, Neon Space and Cozy Workshop are alternatives. The original 10-screen board records earlier flow ideas. Different themes do not imply different mechanics or separate releases.

Each full-board image is retained as supplied. Optional screen crops are derived reference excerpts with their source recorded in `design/asset-provenance.json`. Crops are not new production assets. No independent sprite sheets, rigged 3D models, UI vector kit, sound pack or final font files are included in this kit.

## 3. Robot asset brief

Pip: compact white shell, blue accents, screen face and small antenna. Mochi: pink panels, rounded mechanical ears/side units and a warm screen expression. Bolt: yellow utility panels and sturdy machine silhouette. Sprout: green accents and a leaf-shaped decorative antenna on an unmistakably robotic body. All are bipedal in the default brief, all fit the same tile and all have a visible front/facing cue.

Deliver four directional poses (N/E/S/W in logical coordinates) at consistent camera angle and lighting. Use the same ground-foot pivot and collision footprint for each character. Never mirror an asymmetrical character incorrectly without art approval. Expressions may vary, but facing must remain readable in every pose.

Required animations: idle, move, turn-left, turn-right, collect reaction, soft blocked reaction and celebrate. Motion reduction uses still/short transition variants. Source art should support clean 2× export for the chosen runtime sprite size, then be packed according to measured texture budgets. Prototype assets may be simple local vector/shape robots; mark them temporary.

Robot definitions reference semantic `assetSet` IDs, not arbitrary URLs. Resolve those IDs through a trusted build manifest. Portrait and sprite must show the same selected variant. No robot may gain extra commands, faster logical speed, a smaller budget cost or different collision.

## 4. Environment and UI asset brief

Author a reusable isometric tile kit: grass tops, stone paths, edge/void sides, water decoration, small trees, rocks, crystal decorations, flags, batteries, stars, switches and open/closed gates. Tile geometry uses a consistent 2:1 projection. Make collision-relevant art distinct from background decoration. Tall decorations may not hide essential adjacent tiles; fade or reposition noninteractive occluders.

Split runtime files into shared UI/robots and world-specific packs. Use atlas naming and animation conventions consistent across worlds. Asset manifest entries include logical ID, relative path, MIME type, byte size, SHA-256, dimensions, pivot, license/provenance and pack assignment. Build checks reject missing assets, oversized atlases, illegal remote URLs and references to concept-board screenshots.

Suggested motion timings are tunable defaults: pressed feedback 80–120 ms, panel transition 160–220 ms, move/turn 350–450 ms and success celebration ≤1.5 seconds before the action is ready. There is no need for camera shake or flashing effects. Audio should consist of short local cues for placement, motion, pickup, soft stop and completion; music is optional and independently muted.

## 5. Handoff and review

Approve one representative board, all four robot silhouettes, command icons and one movement cycle before mass-producing 60 levels of decoration. Record dimensions, pivots, source provenance and production export settings. Track asset completeness separately from code completeness. A prototype can use placeholders; public v1 cannot claim final-art parity while still using cropped screenshot fragments.

The supplied generated concepts establish visual intent, not legal clearance or exclusive ownership. The owner must review the public name, final art, any third-party licenses and distribution rights. Do not include unrelated font binaries or proprietary assets obtained from a development machine.

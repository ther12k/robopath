# UI/UX specification and screen-to-build guide

## 1. Visual direction and precedence

Use the supplied **Bright Meadow** board as the provisional visual reference: airy sky, pale surfaces, saturated command tiles, an obvious friendly robot and a floating isometric playfield. Keep play areas quieter than promotional screens. The other boards show useful alternatives, not additional themes that must all ship.

The reference images contain decorative text and inconsistent counters. Implement the written command rules, labels and ratings, not every image artifact. Do not crop a phone screenshot into the production UI. Recreate responsive semantic controls and commission/export independent robot/tile assets.

## 2. Screen inventory

| ID | Screen | Main content and action | Required secondary states |
|---|---|---|---|
| UX-01 | Welcome | Chosen robot hero; Play/Continue; Robots; Settings | First visit, saved game, storage unavailable, reduced motion. |
| UX-02 | Robot picker | Four cards, large selected preview, name, “Let’s go” | Selected ring+check, loading art, fallback portrait, return without resetting progress. |
| UX-03 | World map | Four world cards/path groups, completion counts, offline status | Available, upcoming, pack not downloaded, downloading, failed, ready offline. |
| UX-04 | Level picker | Fifteen numbered nodes/cards, award bits and next available puzzle | Completed, available, upcoming; accessible linear list equivalent. |
| UX-05 | First-mechanic coach | 3–5 second looping silent demo, one sentence, Try it/Skip/Replay | Reduced-motion keyframes, focus containment, demonstration pause. |
| UX-06 | Puzzle—editing | Goal indicators, board, blocks used/cap, palette, program, Run | Empty, partial, full, insertion point, invalid repeat, draft restored. |
| UX-07 | Puzzle—running | Active block, robot action, remaining actions, Pause/Reset | Repeat iteration, gate opening, collectible animation, stale event ignored. |
| UX-08 | Puzzle—paused | Stable board, Resume, Single Step, Reset | Visibility pause, graphics recovery pause, terminal transition. |
| UX-09 | Retry and hints | Robot’s last valid tile, cause, highlighted block, Edit program | Void, wall, closed gate, incomplete route, action limit; three hint tiers. |
| UX-10 | Success | Robot celebration, earned award bits, used blocks and block target | Improved result, repeated clear, save pending/failure, Next/Replay/Map. |
| UX-11 | Robot workshop | Free starter bots, earned accents, equipped preview | Locked accent with clear completion requirement; no purchase button. |
| UX-12 | Settings/grown-up area | Sound, motion, tutorial replay, local-data explanation, export/import/erase | Import validation errors, backup warning, destructive confirmation. |
| UX-13 | Offline/storage | Pack size, explicit download, readiness and retry | Quota denied, missing pack offline, interrupted download, storage failure. |
| UX-14 | Update/recovery | New version ready; finish then update; retry loading | Active run, another open tab, incompatible content, graphics loss. |
| UX-15 | Board explorer | Semantic tile list/grid, robot facing, objects/gates, command order | Keyboard navigation, screen-reader announcements, same puzzles and rules. |

The supplied boards visualize UX-01 through UX-10 and parts of UX-11/12. UX-13–15 are specified here and still require implementation screenshots. Missing mockups must not be presented as already designed pixel-perfect screens.

## 3. Layout contract

At **360–599 CSS px**, use portrait stacking: compact header, flexible board region, program/editor dock, safe-area inset. Preserve a minimum 220 px board viewport where height allows; on unusually short screens permit page scroll or switch to compact landscape layout, not overlapping controls. Keep primary buttons ≥48 px high. Program slots are 48–56 px and never shrink below target size.

At **600–959 px**, use a wider board with a bottom panel or two columns when landscape height is short. At **960 px+**, place the board at left and a 340–400 px editor panel at right with a centered maximum overall width. Breakpoints are product defaults; content and safe-area constraints take precedence over device names.

Use `100dvh` with a sensible fallback, CSS safe-area padding, and a `ResizeObserver` to recalculate board bounds. Browser zoom must not be globally disabled. The palette/editor can scroll independently when necessary; the entire page must not trap touch movement. At 200% zoom, support reflow and reachable controls even when the layout changes.

The board fits the full puzzle by default. No camera rotation or pinch-only essential task. If magnification is added, provide accessible zoom/reset buttons and do not change game state. Program order remains left-to-right and top-to-bottom with numbered slots; wide programs wrap or scroll with visible order rather than becoming tiny icons.

## 4. Command editor behavior

Palette items have an icon, accessible name and optional short visible label. Selecting a palette command followed by an insertion slot adds it; tapping a selected command again cancels selection. An empty program shows a strong first insertion target. Tapping an existing block opens a small action menu: insert before/after, replace, move, delete. Keyboard users get the same actions through buttons, not hidden key combinations alone.

For dragging, pointer-down becomes a drag only after a small movement threshold; show a lifted block and insertion marker. Use pointer capture where supported, restrict `touch-action` only to the draggable handle/active gesture and preserve native scrolling elsewhere. A drop outside a valid target cancels without mutation. A full program rejects additional nodes with a gentle capacity cue. Moving a repeat moves the header and body atomically. Nested repeat drop targets do not exist in v1.

Keyboard flow: Tab reaches palette and editor controls; Enter/Space selects a command; arrow keys navigate insertion positions or tile explorer cells; Enter places; Escape cancels. An explicit action menu supports move/delete for users who do not know shortcuts. Focus follows a moved block and moves predictably after deletion. Use a polite live region for edits, not per-frame announcements.

Maintain an undo stack for at least the last 50 edit operations in the current level. A Clear action is undoable and distinct from Reset. Replacing a filled block does not briefly exceed capacity. Run is disabled for an empty or incomplete AST with a visible reason that is also announced accessibly. Do not disable hint/tutorial access because a draft is invalid.

## 5. Running and feedback

Highlight the source block before movement begins and retain the highlight through its action. A robot-foot arrow shows facing independently of sprite face orientation. Active repeat displays “2 of 3” alongside the highlighted child block; do not highlight the entire repeat in a way that hides the current primitive.

Start with about 350–450 ms per move/turn as a tunable design default. Reduced-motion mode removes hops, shakes, particles and camera transitions; it still shows discrete tile state changes and the active command. Pause follows the engine’s action-boundary contract. Screen changes and backgrounding do not quietly run a child’s program out of view.

Collision is a small stop/soft wobble at the last legal tile, never a distressing fall or robot destruction. Example microcopy: “That tile is blocked. Try another turn.” For incomplete programs: “More blocks might help reach the flag.” For action cap: “This route needs more actions. Try a shorter path.” For gates: “This gate needs its matching switch.” These are locale strings, with visual equivalents and optional audio cues.

Hints are explicit requests. Highlight one useful tile/region at a time; never flash the entire answer automatically. On success, show a brief skippable celebration and an obvious Next Level. Keep missing optional awards framed as extra discoveries, not failure. Confetti may never cover the only actionable button.

## 6. Robot choice

Four robots are available at first launch. Display them as recognizable machines with screen faces, mechanical arms/feet and distinct silhouettes; do not replace them with human/animal avatars. Card selection changes the large preview immediately, with a checkmark and text announcement. Confirmed selection affects welcome, map avatar, puzzle, hints and result panel consistently. Changing robot from settings during a run is blocked or deferred until reset, with no mid-animation asset swap.

Accent unlocks use completion milestones, not stars spent from a balance. Locked accent previews explain the requirement and do not resemble paid offers. Equal ability text belongs in the grown-up area or an optional short tip, not a stat comparison table that suggests power differences.

## 7. Accessibility and focus

DOM controls carry names such as “Turn left,” “Run program,” and “Slot 4, Move forward.” Shapes distinguish commands even in grayscale. Ensure measured contrast; do not assume pastel gradients are compliant. Success and errors have icons and text as well as color. Every modal restores focus to its opener and provides an obvious close action except during a short confirmed destructive operation.

UX-15 is a real alternate board inspection mode: expose coordinates, passability, robot position/facing, goal, uncollected items, switches and gate status in a navigable DOM grid/list. It must not offer a different puzzle or an automatic solution. The child can inspect cells, build the same program, run/step and hear action-boundary status. Canvas can be hidden from assistive technology when this equivalent view is active to prevent duplicate announcements.

The product’s ≥48 px target exceeds the cited WCAG minimum; it is our usability requirement, not a claim about the standard. Tap alternatives follow the dragging guidance. Formal conformance requires review [S11–S12 in `sources.md`].

## 8. Design acceptance evidence

Capture each key state at 390×844, 360×740, 844×390, 768×1024 and 1440×900 CSS px. Measure actual controls, overflow and focus order. Screenshot comparisons are against implemented approved components/layouts, not pixel equality with illustrative artwork. RP-021 records the first slice; RP-039 and RP-043 cover full accessibility and browser states.

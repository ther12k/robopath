# Privacy, security and accessible-play gates

## 1. Public v1 data policy

No child accounts, free-text names, photos, microphone, camera, location, contacts, chat, public uploads, advertisements, analytics SDKs, fingerprinting, social embeds or remote gameplay events. Serve assets locally from the deployment origin; avoid third-party fonts/CDNs at runtime. Do not add a crash reporter without a new privacy design and owner approval.

Static hosting may still process request metadata, IP addresses or provider logs. The owner must inventory the host, retention, region, access controls and any third-party processors, and publish an accurate notice. “No accounts” does not imply “no data processing.” The included plan is not a legal compliance certification. Review the intended launch jurisdictions and current child-privacy requirements with qualified support; official FTC materials are one starting point [S19–S20].

Grown-up-area friction is an accidental-action safeguard, not verified parental consent. A future feature collecting personal information cannot inherit consent from a long-press button or an arithmetic puzzle. Do not ask the child’s exact age just to avoid making this product decision.

## 2. Threat model

Untrusted inputs include progress imports, downloaded content, asset metadata, URL parameters and stale cached files. Threats include malicious JSON causing memory/CPU exhaustion, prototype pollution, script injection, remote URL tracking, mixed-version caches, accidental deletion and dependency/build compromise. Player solution data is not code.

Use strict schema validation and semantic allowlists. Level JSON ≤128 KiB, save import ≤1 MiB, board ≤8×8, program ≤24 total AST nodes, repeat depth one, repeat count≤5, body≤6, compiled actions≤256, level action cap≤128. Cap collectible/gate/switch arrays in schema. Parsing preflight must reject overlarge raw inputs; schema validation alone is not a byte limit.

Do not use eval, Function, dynamic script injection, untrusted HTML or arbitrary remote asset paths. Render localized text as text, not HTML. Restrict asset resolution to known local manifest entries. Use a production content security policy validated against the pinned renderer, worker and asset needs, with no `unsafe-eval`; do not paste a policy that breaks WebGL or service workers and then silently disable it. Set HTTPS and appropriate security/referrer/permissions headers at the host.

Lock and audit dependencies, record licenses, remove template telemetry scripts, keep CI tokens scoped and never put signing secrets or API keys into Vite client environment variables. Public maps/solutions are not secrets; no client-side obfuscation scheme is needed. Restrict any future public editor/importer separately.

## 3. Accessibility acceptance

Essential controls are DOM elements with correct roles/names/states and visible focus. The complete program editor is operable by keyboard and tap alternatives, with no dependence on dragging, hover or color. Target ≥48 CSS pixels for the child-facing actions. Check measured text/control contrast and focus visibility in real states, not just a palette sheet [S11–S12].

Provide reduced motion, persistent sound settings, non-audio feedback, no rapid flashing and no forced countdown. A tutorial can be paused, skipped and replayed. Dialogs manage focus and return it predictably. Touch-scroll and screen-reader gestures remain usable.

Canvas visuals need an equivalent board explorer, not just one “Game board” aria-label. The explorer exposes each tile and changing robot/collectible/gate state, and uses the same program controls and rules. Live announcements occur at user edits and action boundaries, avoiding a constant per-frame stream. Manually test at least one desktop screen reader and one mobile screen reader before claiming accessible gameplay.

## 4. Human testing and media handling

Recruit playtest participants through adults, obtain guardian permission and child assent appropriate to the study, and allow stopping without penalty. Collect the minimum observations needed. Do not record children’s faces, names or voices by default. Any approved recording requires documented consent, restricted access, retention and deletion. Store anonymized observation IDs outside production gameplay data.

A parent/teacher research report summarizes observed usability and uncertainty; it does not diagnose children or assign cognitive ability scores. Findings can block release even when automated tests are green.

## 5. Release checklist

Confirm all network destinations through an actual production network trace. Review host logs, dependencies, build-time calls, local import/export and erase behavior. Test content bounds and malicious imports. Inspect all asset provenance and license obligations. Verify keyboard/tap parity and the board explorer. Record legal/privacy owner and accessibility reviewer sign-offs, unresolved limitations and explicit public claims.

If a qualified review or physical test has not happened, mark it **not run**. An agent cannot create evidence by repeating this checklist in past tense.

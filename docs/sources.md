# Sources and evidence boundaries

Reviewed on **2026-09-05**. These primary sources support technology or platform facts, not the proposed learning outcomes, scope, budgets, or usability targets. The latter are product decisions to validate.

## S01 — Phaser official React + TypeScript template

https://github.com/phaserjs/template-react-ts

The current README describes a React–Phaser bridge, Phaser 4, and optional build-time log.js telemetry. Its listed React/Vite versions are template versions, not proof of the latest releases.

## S02 — Phaser 4.2.1 release

https://phaser.io/download/release/v4.2.1

Official release page dates 4.2.1 to July 9, 2026. Use this as the compatibility-spike candidate, not as a perpetual latest-version claim.

## S03 — Vite getting started

https://vite.dev/guide/

Check Node requirements for the exact Vite release chosen during bootstrap.

## S04 — Vite static deployment

https://vite.dev/guide/static-deploy

Production output can be hosted as static files. Host headers, HTTPS, retention and access logging still need configuration.

## S05 — Node.js release schedule

https://nodejs.org/en/about/previous-releases

Node 24 is listed as LTS as of this review. Select and record an exact supported patch during implementation.

## S06 — React useEffect

https://react.dev/reference/react/useEffect

External systems require setup/cleanup symmetry; account for development Strict Mode when mounting the game.

## S07 — Phaser scale manager

https://docs.phaser.io/phaser/concepts/scale-manager

Phaser exposes canvas scale modes. Confirm API details against the pinned major before implementation.

## S08 — Dexie React tutorial

https://dexie.org/docs/Tutorial/React

Dexie offers IndexedDB integration for React applications. Dexie Cloud is not part of this design.

## S09 — MDN browser storage quotas and eviction

https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria

Browser storage is not a guaranteed backup; handle quota errors, eviction and persistence-request denial.

## S10 — MDN using service workers

https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

Service workers provide offline request handling and have an install/activate/update lifecycle. HTTPS is required outside local development.

## S11 — W3C WCAG 2.2 dragging movements

https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html

Dragging should have a single-pointer non-drag alternative; our tap interaction is a product requirement.

## S12 — W3C WCAG 2.2 target size minimum

https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

The WCAG minimum and its exceptions are not the same as this project’s larger 48 CSS pixel target.

## S13 — MDN autoplay guide

https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay

Audible playback may be blocked until user interaction; the game must remain usable without sound.

## S14 — Playwright projects

https://playwright.dev/docs/test-projects

Browser projects can exercise Chromium, Firefox and WebKit configurations; these are not substitutes for physical-device testing.

## S15 — Vitest guide

https://vitest.dev/guide/

Proposed unit-test runner; verify exact toolchain compatibility before pinning.

## S16 — GitHub CLI issue creation

https://cli.github.com/manual/gh_issue_create

Issue creation accepts a repository, body file, labels and milestone. The included importer is explicitly opt-in for remote writes.

## S17 — Capacitor documentation

https://capacitorjs.com/docs/

Optional later native packaging; platform builds and signing remain separate release work.

## S18 — Ionic WebView concepts

https://ionicframework.com/docs/core-concepts/webview

Capacitor-hosted web content remains WebView-rendered; it is not converted into native game rendering.

## S19 — FTC children’s privacy guidance

https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy

Official starting point for human review of applicable child-privacy obligations. No compliance certification is asserted in this package.

## S20 — FTC COPPA FAQ

https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions

Child-directed services and information collected by third parties require careful review. A parent-area interaction is not verified parental consent.

## Conversation-derived inputs

The requested product is a mobile-first, responsive, isometric robot coding puzzle for children, with icon-based programming, progressive discovery, resource constraints, diverse validated levels and selectable robot characters. The previous stack recommendation was React + TypeScript + Phaser + Vite, with Capacitor later. Five supplied concept boards are included without pretending they are runnable application screenshots.

The user has not selected one of the four robot-selection art directions. Bright Meadow is the **proposed working default**, not an approved final design. Ages, level counts, four starter robot names, release milestones and detailed mechanics below are newly proposed implementation decisions. The unrelated Bundar attachment is not a source for this game and is intentionally excluded.

No repository was provided or inspected for this task. No game, browser build, native app, security audit, child study or GitHub issue publication has been completed by producing this kit. See the generated QA report for the limited package-level checks that were actually run.

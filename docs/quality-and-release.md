# Quality strategy, evidence matrix and release runbook

## 1. Test layers

**Core unit/property tests:** geometry/facing, cost accounting, validation, entry effects, gates, termination, trace source mapping, rating bit union and progression. Use no browser dependencies. Pin golden traces and test immutable inputs.

**Editor/component tests:** add/insert/reorder/remove/replace/clear/undo; full capacity; empty repeat; keyboard and tap alternatives; focus recovery; repeated run clicks; disabled reasons and aria announcements. A drag test alone is insufficient.

**Integration tests:** controller run IDs, canceled/stale acknowledgments, scene mount/destroy cycles, sound/motion settings, storage transactions, revision migration and out-of-order async responses.

**Production browser journeys:** new visitor through six levels; change robot and preserve progress; complete loop/gate levels; inspect board semantically; retry without losing program; reload draft; full offline pack lifecycle; save denial; import failure; safe update; multiple tabs. Use Playwright browser projects [S14]; do not present WebKit automation as physical iPhone testing.

**Manual gates:** physical device rendering/audio/gesture/power tests, screen-reader usability, guardian-consented child observation, art readability, content diversity, legal/privacy and asset-license review.

## 2. Required environment evidence

For browser CI, run Chromium, Firefox and WebKit on pinned runner/browser versions recorded in the report. Test portrait/landscape viewports from the UX spec. For manual evidence, choose a modest Android phone, an iPhone, a tablet and a desktop. Record exact device model, OS, browser, device pixel ratio, network, power mode and build/content SHA.

Compatibility remains a **target** until evidenced. Maintain a release support table with `tested`, `not tested`, `known limitation` and `unsupported` statuses. The app must surface unavailable WebGL/asset support with a readable recovery screen, not silently claim a Canvas fallback unless that renderer path was tested for the selected Phaser major.

## 3. Critical regression matrix

| ID | Scenario | Expected proof |
|---|---|---|
| QA-01 | Run empty/incomplete/over-cap program | No execution; correct reason; draft retained. |
| QA-02 | Right/left at each facing | Four-turn round trip and expected coordinate deltas. |
| QA-03 | Goal on last allowed action | Success, not out-of-actions. |
| QA-04 | Goal with missing required pickup | No early win; may leave and return. |
| QA-05 | Closed gate with collectible behind/on it | Block first; no collection or movement. |
| QA-06 | Repeat and trailing unused commands | Full AST charged; only executed primitives charged; source IDs correct. |
| QA-07 | Pause/reset while tween active | Snap to committed boundary; stale ack ignored; no phantom completion. |
| QA-08 | Change robot | Identical core trace and preserved local progress. |
| QA-09 | Duplicate success event or two tabs | No duplicated unlocks; award bits merge monotonically. |
| QA-10 | Import malicious/large/future-version save | Rejected with existing data unchanged. |
| QA-11 | Pack fails halfway | Not ready; previous pack preserved; retry possible. |
| QA-12 | Update with active run and another tab | Wait safely; no mixed rules/assets or lost draft. |
| QA-13 | Touch drag canceled/off-target | No ghost block or stuck scroll; tap path still works. |
| QA-14 | 200% zoom and keyboard-only | Reflow, visible focus and all operations remain reachable. |
| QA-15 | Audio blocked/reduced motion | Equivalent playable feedback, no uncaught rejection. |
| QA-16 | Origin storage erased | First-run recovery, no claim that data was backed up. |
| QA-17 | Content revision changes | Old metric/draft not silently applied to new puzzle. |
| QA-18 | Every release level | Valid level and single three-star witness against actual core. |

## 4. Measurement protocol

Treat PRD budgets as hypotheses until measured. Collect resource bytes from the production build, excluding this documentation/image bundle. Run the cold-cache 10 Mbps/100 ms RTT load test three times and report each result plus median; record hardware and browser. Run a 60-second representative movement scene and record frame duration distribution. Collect at least 100 deliberate local taps for input latency. Show failures, not only averages.

Memory/cleanup test: repeat level load/run/reset/unload 100 times and inspect event listeners, canvases, textures and memory trends where tooling permits. Absolute memory is browser-dependent, so report method and trend rather than claiming a universal heap number. Repeated cleanup leaks are a release blocker even if short smoke tests pass.

## 5. Defect severity and evidence

P0: data/security harm, unsafe content or systemic inability to load/play. P1: core solution incorrect, unwinnable published level, destructive save bug, inaccessible essential flow or widespread device crash. P2: nonblocking presentation defect with a clear workaround. P3: polish. Zero unresolved P0/P1 is required; no agent may downgrade a blocker to make a gate green.

Each issue completion report includes commit SHA, commands, environment, result, test artifact path and limitations. Screenshots/video demonstrate UI only for the states actually captured. A test marked skipped, mocked or unavailable remains so. The planning kit’s own Python checks do not count as production browser tests.

## 6. Deployment and rollback

Use immutable build IDs and versioned content packs. Build once, test that artifact, then deploy that exact artifact. Configure HTTPS, base path, cache headers, navigation fallback and security headers. Keep old hashed assets long enough for existing clients; do not instantly remove chunks a waiting worker still needs. Disable directory/source/test-artifact exposure as appropriate.

Before promotion: clean install/build; core+content suites; browser matrix; required human gates; inspect network calls and asset licenses; verify a downloaded world offline; rehearse update and rollback. Prepare a rollback to the prior build and compatible content, but do not roll back a database schema destructively. Prefer forward-compatible/additive migrations; an irreversible migration needs a documented recovery plan and export opportunity.

Public-release sign-off identifies the product owner, exact build/content hashes, environment support table, known limitations and rollback action. Publishing to a public host or app store is an external action requiring explicit owner authorization. Credentials/signing certificates must never be invented or placed in the repository.

## 7. Post-release

Use adult-reported support and privacy-respecting host operational signals rather than silently adding gameplay tracking. Triage blockers, reproduce on the reported environment, fix with a regression test and re-run impacted content/compatibility checks. Publish clear release notes about changed puzzles and save impact. Optional native builds repeat their own platform-specific verification.

## References

[S13–S18](sources.md) cover audio, test-tool and platform facts. All numeric budgets and release gates are proposed project policy.

# Robo Paths — build-ready planning kit

**Mobile-first, responsive isometric robot coding puzzle**  
**Planning baseline:** 1.0 · **Prepared:** 2026-09-05

## Start here

Read [the PRD](PRD.md), open [the design gallery](design/index.html), then give [the handoff prompt](HANDOFF_PROMPT.md) to your implementation agent together with the target repository. The [agent contract](AGENTS.md) and [delivery plan](docs/delivery-plan.md) explain how to proceed without treating a plan as implemented code.

This kit specifies React + TypeScript + Phaser + Vite, a deterministic core, semantic program controls, local saves, offline worlds and optional later Capacitor packaging. Bright Meadow is a **proposed** visual default among the supplied alternatives, not final approval.

## Contents

| Folder/file | What it provides |
|---|---|
| `PRD.md` | Product goals, exact scope, 30 functional requirements, proposed budgets and acceptance gates. |
| `docs/` | Architecture, engine semantics, responsive UX, assets, curriculum, content pipeline, storage/offline, privacy/accessibility, quality, delivery and traceability. |
| `backlog/issues/` | 54 detailed task files: 49 web-v1 tasks and five optional post-v1 tasks. |
| `backlog/tasks.json` | Machine-readable dependencies, milestones, requirements and scope. |
| `design/` | Five supplied design boards, eight reference screen excerpts, provenance and an offline HTML gallery. |
| `schemas/`, `contracts/` | Seven JSON schemas and proposed TypeScript interfaces; not the implemented game. |
| `examples/` | 12 sample puzzle/witness pairs, four robot declarations, save example and 60-level curriculum briefs. |
| `scripts/` | Package validation/reference tests and a dry-run-first GitHub issue importer. |
| `qa/` | Actual package-level check report and optional future GitHub ID map. |
| `HANDOFF_PROMPT.md`, `prompts/` | Implementation, continuation and independent-review prompts. |
| `.github/` | Bug and PR templates; production CI is a planned implementation task. |

## First playable versus full release

M1 is six genuinely different Meadow puzzles with four selectable robots, tutorials, tap/drag/keyboard editing, run/pause/step/reset, retry/success and local progress. Public web v1 is **60 authored and validated levels across four worlds** plus final-art, offline, accessibility, device and human-review gates. A curriculum brief is not a shipped level. Native stores, an internal visual editor and cloud saves are explicitly optional later work.

## Local package checks

```bash
python3 -m pip install -r scripts/requirements.txt
python3 scripts/verify_package.py
```

The checks validate schemas/examples, witness results, dependency graph, requirements, documentation links and reference-tool tests. They do not install/build the React game, exercise a browser, prove optimal solutions or certify child usability. See [the QA report](qa/REPORT.md) for exactly what ran.

## GitHub task import

Start with the [backlog guide](backlog/README.md). Commit the kit to the intended repository path before applying so generated issue documentation links resolve.

```bash
# Preview only. No network calls or writes.
python3 scripts/import_github_issues.py --repo OWNER/REPO
```

Only explicit `--apply` creates missing issues/labels/milestones using the authenticated GitHub CLI. Default selection excludes M5. It does not create a repository, overwrite human issue bodies, push code or publish an application. No live issue import has been performed for this delivery.

## Evidence boundaries

No game repository was supplied for inspection. All tasks begin not started. The included concept PNGs are not application screenshots or production sprite sheets. Some example hint strings and asset IDs are labeled placeholders. Final assets, dependency compatibility, production tests, human playtests, legal review and public release authorization remain implementation work.

Primary technical references and current-version caveats are in [sources](docs/sources.md). The unrelated Bundar attachment is not included. [SHA-256 inventory](MANIFEST.sha256) describes the delivered files; it excludes itself. Re-running QA may update local report files.

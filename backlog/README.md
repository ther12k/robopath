# Implementation backlog

**54 individually scoped issue files:** 49 for web v1 (M0–M4) and five optional M5 items. All begin `not_started`; this package does not create remote issues or claim completed implementation. Stable IDs are RP-001…RP-054, not GitHub issue numbers.

Read `tasks.json` for machine-readable dependencies, requirement coverage, labels and scope. Numeric IDs are stable references, **not a strictly executable order**: for example the content-authoring tasks depend on RP-032. Use a topological order and honor milestone gates.

## Import into GitHub

Copy/commit the kit at a stable path in the target repository first. The importer converts issue-body relative documentation links to blob links for the selected repository, branch and documentation prefix. It uses dependency markers for idempotency, reads all existing issues with pagination and does not overwrite human-edited issue bodies. Remote operations occur only with `--apply`.

```bash
# From this kit's root; no gh authentication or network access needed for this preview.
python3 scripts/import_github_issues.py --repo OWNER/REPO

# Example when the kit is committed at planning/robo-paths, on main:
python3 scripts/import_github_issues.py --repo OWNER/REPO \
  --docs-prefix planning/robo-paths --ref main --milestone M0 --apply

# Preview all including opt-in future work:
python3 scripts/import_github_issues.py --repo OWNER/REPO --include-optional
```

Replace OWNER/REPO and confirm the actual committed document path. `--apply` requires the GitHub CLI, authenticated issue/metadata permissions and an existing repository. It creates missing labels/milestones and new selected issues; it never creates a repository, pushes code, deletes/updates existing issues, publishes a site or modifies branch settings. Rerunning skips issues with a matching stable marker. A partial failure stops; re-run after reviewing the result. Concurrent imports are not supported.

Optional `--milestone M1` imports only that stage; dependencies outside the selection remain stable IDs unless they already exist remotely. `qa/github-issue-map.json` is written after confirmed creations and includes returned URLs. Commit that map only after reviewing it for repository-specific information.

## Milestones

### M0 — Foundation and compatibility

Repository scope, pinned compatible stack, real CI, accessible primitives and strict schema boundary.

### M1 — First playable six-level slice

Four free robots, six diverse puzzles, tap/drag/keyboard editor, primitive execution, tutorials, retries, ratings and local saves with actual smoke evidence.

### M2 — Complete mechanics and authored content

Repeat, latched gates, world progression, bounded content tooling and four fully authored 15-level worlds.

### M3 — Polish, offline and inclusive validation

Final-art review, storage/update hardening, equivalent board explorer, real-device evidence and consented formative playtests.

### M4 — Public web v1 readiness

Exact release candidate with 60 valid levels, privacy/support/asset review, deployment/rollback rehearsal and human GO/NO-GO.

### M5 — Optional post-v1 expansion

Opt-in native packaging, internal authoring tool or separate cloud-save proposal. Excluded from default issue import.

## Definition of done

An issue is done when its code/content exists, specific acceptance criteria pass, tests and documentation agree, and the evidence is attached. A plan, mockup, stub command, generated screenshot or unchecked agent assertion does not complete implementation. Human gates remain blocked until actual approval. Effort S/M/L is relative sizing only; the team should estimate after the repository and art pipeline are known.

## Issue index

| ID | Milestone | Area | Task | Depends on |
|---|---|---|---|---|
| [RP-001](issues/RP-001.md) | M0 | platform | Adopt the specification and establish repository boundaries | — |
| [RP-002](issues/RP-002.md) | M0 | platform | Prove and pin the React–Phaser toolchain | RP-001 |
| [RP-003](issues/RP-003.md) | M0 | platform | Bootstrap quality tooling and honest CI scripts | RP-002 |
| [RP-004](issues/RP-004.md) | M0 | frontend | Build responsive tokens and accessible base components | RP-003 |
| [RP-005](issues/RP-005.md) | M0 | core | Implement schema and semantic content validation | RP-003 |
| [RP-006](issues/RP-006.md) | M1 | core | Implement immutable board and facing model | RP-005 |
| [RP-007](issues/RP-007.md) | M1 | core | Implement primitive command compilation and simulation | RP-006 |
| [RP-008](issues/RP-008.md) | M1 | core | Implement goals, pickups, budgets and rating outcomes | RP-007 |
| [RP-009](issues/RP-009.md) | M1 | frontend | Build the pure program-editing reducer | RP-005 |
| [RP-010](issues/RP-010.md) | M1 | frontend | Implement tap, pointer drag and keyboard program editing | RP-004, RP-009 |
| [RP-011](issues/RP-011.md) | M1 | renderer | Render the isometric board with reliable depth and framing | RP-002, RP-006 |
| [RP-012](issues/RP-012.md) | M1 | art | Create four consistent placeholder robot asset sets | RP-004, RP-011 |
| [RP-013](issues/RP-013.md) | M1 | renderer | Build the typed controller–renderer bridge and lifecycle | RP-007, RP-011 |
| [RP-014](issues/RP-014.md) | M1 | gameplay | Implement run, pause, resume, step and reset | RP-008, RP-010, RP-013 |
| [RP-015](issues/RP-015.md) | M1 | frontend | Build the mobile-first application shell and routes | RP-004, RP-011 |
| [RP-016](issues/RP-016.md) | M1 | frontend | Implement robot selection consistently across the game | RP-012, RP-015, RP-019 |
| [RP-017](issues/RP-017.md) | M1 | gameplay | Implement first-command visual tutorials | RP-010, RP-012, RP-015 |
| [RP-018](issues/RP-018.md) | M1 | gameplay | Implement helpful retry, hint and success panels | RP-008, RP-014, RP-015 |
| [RP-019](issues/RP-019.md) | M1 | storage | Implement local save adapter and in-memory fallback | RP-003, RP-005 |
| [RP-020](issues/RP-020.md) | M1 | content | Integrate and validate the first six diverse puzzles | RP-005, RP-008, RP-017 |
| [RP-021](issues/RP-021.md) | M1 | qa | Validate the first playable vertical slice | RP-004, RP-014, RP-016, RP-017, RP-018, RP-019, RP-020 |
| [RP-022](issues/RP-022.md) | M2 | core | Implement bounded repeat compilation and core rules | RP-008, RP-021 |
| [RP-023](issues/RP-023.md) | M2 | frontend | Build the responsive repeat-block editor | RP-010, RP-022 |
| [RP-024](issues/RP-024.md) | M2 | gameplay | Add repeat tutorials and execution visualization | RP-017, RP-022, RP-023 |
| [RP-025](issues/RP-025.md) | M2 | gameplay | Implement latched switches and gates end to end | RP-008, RP-011, RP-014, RP-022 |
| [RP-026](issues/RP-026.md) | M2 | frontend | Implement world map, level picker and unlock rules | RP-015, RP-018, RP-019 |
| [RP-027](issues/RP-027.md) | M2 | storage | Implement idempotent progression and cosmetic rewards | RP-008, RP-019, RP-026 |
| [RP-028](issues/RP-028.md) | M2 | content | Author and approve all 15 Sunny Meadow levels | RP-020, RP-032 |
| [RP-029](issues/RP-029.md) | M2 | content | Author and approve all 15 Pebble Workshop levels | RP-023, RP-024, RP-032 |
| [RP-030](issues/RP-030.md) | M2 | content | Author and approve all 15 Crystal Grove levels | RP-025, RP-032 |
| [RP-031](issues/RP-031.md) | M2 | content | Author and approve all 15 Sky Isles synthesis levels | RP-030, RP-032 |
| [RP-032](issues/RP-032.md) | M2 | tooling | Build content CLI, witness runner and bounded search reports | RP-005, RP-022, RP-025 |
| [RP-033](issues/RP-033.md) | M3 | art | Produce and integrate the approved final art slice and asset pipeline | RP-004, RP-012 |
| [RP-034](issues/RP-034.md) | M3 | renderer | Polish motion, local audio and reduced-motion behavior | RP-014, RP-033 |
| [RP-035](issues/RP-035.md) | M3 | storage | Harden save migrations, import/export and erase | RP-019, RP-027 |
| [RP-036](issues/RP-036.md) | M3 | offline | Implement transactional offline world-pack installation | RP-005, RP-019, RP-033 |
| [RP-037](issues/RP-037.md) | M3 | offline | Implement safe service-worker updates and multi-tab coordination | RP-035, RP-036 |
| [RP-038](issues/RP-038.md) | M3 | gameplay | Implement graphics, content and network recovery surfaces | RP-013, RP-037 |
| [RP-039](issues/RP-039.md) | M3 | accessibility | Deliver the board explorer and full accessibility review | RP-010, RP-015, RP-023, RP-038 |
| [RP-040](issues/RP-040.md) | M3 | performance | Measure and optimize real-device performance and cleanup | RP-033, RP-034, RP-036, RP-039 |
| [RP-041](issues/RP-041.md) | M3 | security | Perform privacy, parsing, dependency and asset security review | RP-003, RP-035, RP-036 |
| [RP-042](issues/RP-042.md) | M3 | frontend | Externalize and review all English UI and level copy | RP-018, RP-026, RP-027, RP-035 |
| [RP-043](issues/RP-043.md) | M3 | qa | Complete production cross-browser regression coverage | RP-024, RP-025, RP-031, RP-038, RP-039, RP-040, RP-041, RP-042 |
| [RP-044](issues/RP-044.md) | M3 | research | Conduct guardian-consented formative child playtests | RP-033, RP-043, RP-045 |
| [RP-045](issues/RP-045.md) | M3 | research | Add opt-in local research diagnostics without production tracking | RP-019, RP-041 |
| [RP-046](issues/RP-046.md) | M4 | platform | Implement reproducible static deployment and rollback rehearsal | RP-003, RP-037, RP-041 |
| [RP-047](issues/RP-047.md) | M4 | content | Audit the full 60-level library and progression after playtesting | RP-028, RP-029, RP-030, RP-031, RP-032, RP-044 |
| [RP-048](issues/RP-048.md) | M4 | docs | Finish grown-up guidance, credits and support documentation | RP-035, RP-041, RP-042, RP-047 |
| [RP-049](issues/RP-049.md) | M4 | release | Run the public-v1 release-candidate GO/NO-GO gate | RP-033, RP-040, RP-043, RP-044, RP-045, RP-046, RP-047, RP-048 |
| [RP-050](issues/RP-050.md) | M5 | native | Optional: prototype Android packaging with Capacitor | RP-049 |
| [RP-051](issues/RP-051.md) | M5 | native | Optional: prototype iOS packaging with Capacitor | RP-049 |
| [RP-052](issues/RP-052.md) | M5 | release | Optional: complete native store readiness and human submission gates | RP-050, RP-051 |
| [RP-053](issues/RP-053.md) | M5 | tooling | Optional: design and build an internal visual level authoring tool | RP-032, RP-049 |
| [RP-054](issues/RP-054.md) | M5 | product | Optional: prepare a separate cloud-save product/privacy proposal | RP-049 |

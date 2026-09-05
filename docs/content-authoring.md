# Content model, curriculum and validation pipeline

## 1. Source of truth

The simulator consumes normalized level data. Authors edit JSON under `content/`; a build step validates and assembles versioned world packs. The included `schemas/` define the draft v1 contracts. The `examples/` folder contains **12 sample levels with witnesses**, not all 60 release levels. `examples/curriculum.json` and `docs/curriculum.md` describe the full proposed sequence but do not make those unbuilt levels valid.

IDs are stable (`w1-01`, `w2-01`, etc.); revisions increase when a map, budget, command set, objective or rules-relevant entity changes. Do not reassign an existing ID to a different puzzle. Cosmetic text/art changes may use a pack revision without changing a level revision. An engine-rule change must increase `engineRulesVersion` and trigger revalidation and save-compatibility review.

## 2. Level fields

`schemaVersion` and `engineRulesVersion` define compatibility. `id`, `revision`, `worldId` and `ordinal` identify the level. `titleKey` is a locale reference. `board` contains width, height, explicit tiles and walls. `board.decorations` is an optional cosmetic-scenery list (`{ x, y, kind }`, currently `kind: "tree"`); every decoration must sit on a wall (blocked) tile and never affects the simulation. `start` includes facing; `goal` is a coordinate. `collectibles`, `switches` and `gates` are always arrays, including when empty.

`commands` is an allowlist; `limits.maxBlocks` bounds the written AST and `limits.maxActions` bounds executed primitives. `rating.parBlocks` is a target, not a proven optimum unless separately evidenced. `teaching` identifies concept, structural archetype and proposed difficulty. `hintKeys` contains three progressive authored hints. Human-facing content belongs in locale JSON, not hardcoded engine code.

World manifests enumerate ordered level IDs and prerequisite completion counts. Robot data declares cosmetic-only starter characters and semantic asset sets. Asset data is separately versioned; none of the example asset-set strings claims the art is already available.

## 3. Authoring workflow

1. Write one learning/decision objective and a sketch of the route choices before placing decoration.
2. Draw the logical walkable graph, start facing, objectives and gate/switch relations. Write at least one intended program and run it through the real core.
3. Choose generous action limits initially. Establish a block target with a verified all-bonus witness, then tighten only when the child-facing constraint has a clear purpose.
4. Add a plausible alternative or tempting mistake. Check that an intended choice is not accidentally erased by another route.
5. Author three hints that explain the decision without relying on text alone. Verify their tile references after every map edit.
6. Run schema, semantic and witness tests; run bounded solver checks; review structural similarity and teaching prerequisites.
7. Playtest for clarity and frustration, revise, and attach exact content/core versions to the approval report.

Use a CLI and JSON in v1. An internal visual editor is optional M5; it must emit this same schema and call this same validator, not create a second rule system.

## 4. Required automated checks

Schema checks enforce ranges, enums and unknown-field rejection. Semantic checks verify coordinate uniqueness/bounds, entity placement, start/goal validity, collectible uniqueness, gate reachability references, allowlists, rating≤block cap and finite program shape. World checks enforce unique ordinals, level membership, acyclic unlock requirements and mechanic availability by the tenth level of each prerequisite world.

For every released level, verify a successful program and a single three-star program. Record static block cost, executed action cost, awards and a deterministic trace hash. A single witness may satisfy both requirements. Any change to content/rules must re-run the witnesses. Reject a witness that relies on a renderer bug or a chosen robot variant.

A reachability solver should track `(x,y,facing,collectedMask,openedGateMask)` plus resource bounds. Do not mark a state visited without accounting for remaining budget. For repeat-program optimization, use bounded AST enumeration or a documented equivalent search; shortest primitive paths alone do not establish minimal static blocks. Timeouts are `search_inconclusive`, never `unsolvable` or `optimal`.

For launch, require 100% valid witnesses, zero invalid goal/switch references and no knowingly unattainable rewards. Global optimality is not a release requirement. A content report distinguishes evidence from design intent.

## 5. Diversity rubric

Difficulty may change through start facing, route graph, dead ends, turn order, required-item order, optional detours, backtracking, repeated subsequences, shared switches and gate dependencies. Decoration, rotation or a renamed robot is not sufficient diversity.

Before releasing W1, require at least eight distinct structural/decision archetypes across its 15 levels. Across all 60 levels, aim for at least 20 archetypes. Review the first six separately: they must include forward movement, right turn, left turn, required pickup, optional detour and a blocked-route correction. No more than two consecutive levels may share the same objective and topology family without an explicit teaching rationale.

At least five early-world levels should have two materially different successful routes/program strategies within their caps; all rule-valid alternatives must still be accepted elsewhere. This is an authoring target, not a requirement to force multiple solutions into a single-command tutorial.

Automate duplicate-topology warnings using a normalized walkable graph and entity roles, considering rotation/reflection where useful. A warning triggers human review; it does not substitute for understanding pedagogy. Require one teaching note explaining what changed from the preceding level.

## 6. Example content and claims

The package’s witnesses are tested by `scripts/reference_core.py` and `scripts/verify_package.py`. This proves only the supplied examples satisfy the documented reference rules. It does not prove the planned production core, a Phaser animation, accessibility, level enjoyment, shortest programs or the remaining curriculum. The first six fixtures form the intended M1 slice. Additional examples exercise facing, multiple collectibles, repeat bodies and switch/gate state.

Complete the TypeScript implementation and replay these fixtures there. If the reference and implementation disagree, inspect the written execution order; do not edit a witness just to conceal a production bug.

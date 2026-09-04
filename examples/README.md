# Example contracts and puzzle witnesses

Included: 12 level JSON files, 12 runnable witness programs, four cosmetic robot declarations, a sample empty save, seven schemas and a 60-level curriculum plan. The four `worlds.planned.json` manifests intentionally refer to the complete future 60-level library; they are **not a loadable release pack** because only 12 maps are supplied.

The locale file contains titles plus explicitly labeled hint placeholders. It is not final child-facing copy. Writing/reviewing hints is part of the backlog. `assetSet` values are semantic placeholders, not paths to included sprite sheets.

Run `python3 scripts/verify_package.py` from the kit root after installing the small QA dependency in `scripts/requirements.txt`. It checks example schemas, semantic validity, success/three-star witnesses, requirement coverage, dependency cycles and internal file links. It does not start a game or a browser.

`reference_core.py` is a small headless specification oracle used by package QA. Port/test the contract in the production TypeScript core; do not ship Python in the browser or treat this oracle as proof of final UI correctness. No optimality claim is made for the witness programs.

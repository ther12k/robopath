# Package validation — actual results

Status: **PASS** for the delivered specification kit, not a production game.

Python 3.12.3; jsonschema 4.26.0. Prepared baseline: 2026-09-05.

| Check | Result |
|---|---|
| JSON schemas | 7 valid Draft 2020-12 schemas |
| Validated sample instances | 34 |
| Runnable sample witnesses | 12 success / three-star witnesses |
| Reference-core and importer local tests | 29 passed |
| Task dependencies | 54 tasks, acyclic; 49 v1 + 5 optional |
| Requirement traceability | 30 covered by v1 tasks |
| Internal Markdown file links | 362 resolved |
| Curriculum plan | 60 unique briefs; 12 executable examples only |
| Design assets | Five supplied boards hash-checked; eight reference crops present |

## Verified witness outcomes

| Level | Outcome | Static blocks | Executed actions | Stars |
|---|---|---|---|---|
| w1-01 | success | 2 | 2 | 3 |
| w1-02 | success | 5 | 5 | 3 |
| w1-03 | success | 6 | 6 | 3 |
| w1-04 | success | 3 | 3 | 3 |
| w1-05 | success | 7 | 7 | 3 |
| w1-06 | success | 7 | 7 | 3 |
| w1-07 | success | 4 | 4 | 3 |
| w1-08 | success | 7 | 7 | 3 |
| w2-01 | success | 2 | 5 | 3 |
| w2-02 | success | 5 | 11 | 3 |
| w3-01 | success | 8 | 8 | 3 |
| w3-02 | success | 11 | 11 | 3 |

Witnesses establish the listed example outcomes under the Python reference rules; no minimum-block proof is asserted. Machine-readable trace hashes are in `results.json`.

## Not run / not claimed

- Production React/Phaser implementation or build
- Production TypeScript core tests
- Browser or real-device game tests
- Performance/accessibility/privacy certification
- Child playtests
- Global program optimality proof
- Full 60-level executable content validation
- Live GitHub issue import
- Public deployment or app-store submission

The GitHub importer was tested only in local dry-run/helper tests. Remote permissions, issue creation and store/deployment behavior were not exercised. Final production sprites and hint copy are not supplied. The four planned world manifests intentionally refer to future content and are not a ready release pack.

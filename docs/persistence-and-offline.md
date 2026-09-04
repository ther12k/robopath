# Local saves, offline packs and update safety

## 1. Data boundaries

Public v1 has one local profile (`local`), not a child identity or login. Store selected robot, settings, tutorial acknowledgments, completed level award bits, successful-run metrics, bounded drafts and equipped cosmetics. Do not store real names, birthdays, location, device identifiers, recordings or cross-site IDs. Timestamps are optional operational data, not a gameplay requirement.

Use a Dexie-backed adapter; keep an in-memory fallback. IndexedDB and caches are best-effort storage unless persistence is granted, and browser/user actions can remove them [S08–S09]. Never promise permanent backup. A banner in fallback mode says “Progress may not stay on this device” and allows play to continue.

Suggested stores: `profile`, `levelProgress`, `drafts`, `settings`, `completionReceipts`, `packInstalls`, and `meta`. Version database schema independently of level and engine versions. Keep completion receipts bounded (for example the latest 200) and ensure reward merges remain intrinsically idempotent even after pruning.

## 2. Writes and transactions

Debounce editor draft writes around 300–500 ms; flush on navigation when possible, but do not rely on unload handlers for correctness. Persist stable edits incrementally. Drafts may contain an empty program or an incomplete repeat body according to `draft.schema.json`; only a validated nonempty `program.schema.json` can run.

On terminal success acknowledgment, transactionally merge award bits, completion state, best successful metrics and milestone cosmetic ownership. Write the receipt in the same transaction. Grant each completion milestone by a set membership condition, not by incrementing currency. A duplicate event must be harmless.

If saving fails, show a visible warning and keep the in-memory progress. Do not rerun the success celebration every time storage is retried. Next Level remains available in memory; communicate that progress is not yet durable. Do not claim “Saved” before the transaction resolves.

## 3. Revision compatibility and migration

Load saves through explicit version migrations. Preserve original data until the migration commits. An unknown future save version is read-only/rejected for import with a clear message, never destructively downgraded. A failed migration allows exporting the original file and starting an ephemeral session.

A changed level revision invalidates its old draft unless an explicit migration is defined. Preserve the old earned completion in an archive/display record, but mark its metrics as belonging to the earlier revision; do not represent them as evidence for the changed puzzle. New revision ratings should be earned under the new content. A rules-version change requires a documented policy for progress carryover and revalidation.

Multiple tabs subscribe to change signals. Completion awards merge monotonically through transactions. Draft conflicts use a revision number and an active-editor notice; a stale tab cannot overwrite a newer draft silently. For a version-changing update, require other active tabs to finish/reload or leave the new worker waiting. Reset/erase sends a generation marker to all tabs so stale writers cannot resurrect erased progress.

## 4. Export/import/erase

Export a JSON envelope with app ID, save version, rules version and the local profile data. Do not include cached asset bytes or run-by-run behavioral history. Import limit is **1 MiB**, with bounded map/array sizes, prototype-safe parsing and strict schema validation. Display a summary before applying. Offer “Replace local progress” only with explicit confirmation and a pre-import backup opportunity; v1 does not need an ambiguous cross-device merge UI.

Reject unknown robots, excessive drafts, unknown level IDs, incompatible revisions and invalid nested program data. Do not fetch URLs contained in a save file. A failed import leaves the current database unchanged. A parent-area hold/confirm step prevents accidents but does not count as identity verification or verified parental consent.

Erase clears game-owned IndexedDB, game-owned caches, in-memory state and relevant storage flags, then resets the profile. Explain that this removes local data, not hosting access logs. Reload into first-run state and test that another tab cannot restore old data.

## 5. Pack lifecycle

Pack manifests follow `schemas/pack.schema.json` and include pack ID/revision, exact rules version, asset paths, bytes and integrity hashes. `byteLength` and SHA-256 refer to the decoded file bytes; `estimatedDownloadBytes` is a user-facing transfer estimate, not an integrity value. Semantic validation rejects duplicate paths, mismatched world membership and missing required shared assets. Runtime content URLs are same-origin relative paths resolved through the trusted manifest. A pack is `not_installed`, `downloading`, `verifying`, `ready`, `failed` or `unavailable_offline`.

Download into a staging cache. Validate the content schema, verify expected file sizes/hashes and check all required assets. Only after all pass, write the ready manifest/installation record as the commit pointer. Cache API writes and IndexedDB are not a shared transaction, so use a two-phase protocol: stage files → verify completeness → commit DB pointer. On startup reconcile orphan staging caches and missing committed assets. A ready label requires both a valid committed record and actual files.

Do not erase the previous ready revision until the replacement commits and no running client still references it. A canceled/failed download leaves the previous revision usable. Missing/offline content must say “Download this world when online,” not “Complete more levels.” Confirm packs explicitly before large downloads; show expected size. Request persistent storage as an optional adult-facing action after useful progress, not a mandatory launch prompt.

## 6. Service worker and shell policy

Precache a minimal shell and initial shared assets; download larger world packs separately. Use content-hashed immutable assets and versioned packs. Navigation should use a documented network-first-with-cached-shell fallback or equivalent safe strategy. Do not combine a new shell with incompatible old content or old module chunks. Test deployment under a non-root base path.

Keep new workers waiting during active runs and unsaved edits. Show “Update ready” at a safe boundary; after all participating tabs are safe, activate and reload. Do not call immediate skip-waiting/reload in the middle of a robot action. On a cold offline visit without a previous shell, the app cannot promise to load; public copy must distinguish this case. Service-worker lifecycle and secure-context requirements are described in S10.

## 7. Recovery cases and tests

Test full origin eviction, IndexedDB denied, quota exhausted mid-pack, asset missing after “ready,” tab closed mid-download, stale service worker, partial deployment, incompatible content revision, multiple open tabs, erased data generation, offline navigation, reload during playback and corrupted export data. Use production builds for these tests, not only a development server.

Optional Capacitor builds should initially disable browser service-worker registration and use packaged immutable assets; evaluate native storage and update behavior separately. Browser offline evidence does not establish native correctness [S17–S18].

## References

[S08–S10 and S17–S18](sources.md). The transaction/pack protocol above is the proposed product architecture, not a feature automatically supplied by Dexie or Capacitor.

# Cloud-Save Product & Privacy Proposal

**Status:** Architecture & Privacy Impact Assessment (M5 Scope)  
**Task:** RP-054

---

## 1. Zero-PII Anonymous Sync Architecture

To allow cross-device play (e.g., home tablet to school desktop) without collecting personal data from children:

### Proposed Token Model
1. **No User Accounts:** No child username, email, password, or social login.
2. **Deterministic 12-Word Recovery Phrase / Secret Code:**
   - A random cryptographic secret token (e.g. 12 friendly child-readable words like `apple-river-blue-robot...`) is generated locally upon user request in the Grown-Up area.
   - The token maps on the server to a key-value blob of `PlayerProgress`.
   - The server stores zero IP addresses, zero device fingerprints, and zero email linkages.
   - An adult can type the 12-word code into another device to sync or transfer progress.

---

## 2. Privacy & Regulatory Compliance (COPPA / GDPR-K)

1. **COPPA Safe Harbor:** Because no Personal Identifiable Information (PII) is ever requested, collected, stored, or transmitted, parental consent verification requirements for PII collection are not triggered.
2. **Encrypted at Rest:** Progress payloads stored on the sync server are client-side encrypted using the token before transmission. The server cannot inspect level progress, robot choices, or draft history.
3. **Automatic Expiration & Purge:** Inactive sync blobs are automatically deleted after 90 days of inactivity.

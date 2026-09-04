# Capacitor Native Packaging & Store Readiness Proposal

**Status:** Proposed Architecture (M5 Scope)  
**Covers Tasks:** RP-050 (Android), RP-051 (iOS), RP-052 (Native Store Readiness)

---

## 1. Overview & Separation of Concerns

Robo Paths is architected as a web-first application using React, Phaser, and standard web technologies. Capacitor provides a native runtime wrapper to distribute on Google Play and Apple App Store while preserving the web codebase as the single source of truth.

### Key Architectural Invariants
1. **Isolated Build Lane:** Capacitor configuration (`capacitor.config.ts`, `android/`, `ios/`) operates in a separate packaging lane. The core web app remains 100% buildable and deployable as a static site without Capacitor installed.
2. **Offline-First Packaged Assets:** The production `dist/` bundle is packaged into the native app's local asset directory (`file:///android_asset/` or local bundle URL). Service worker registration is disabled inside native WebViews to prevent double-caching and conflicting lifecycles.
3. **Hardware Back Button:** Android hardware back button events map to the same in-game back navigation (Game -> World Map -> Welcome).

---

## 2. Minimal Permissions

In accordance with child privacy standards (COPPA / GDPR-K):
- **Android Manifest:** Zero dangerous permissions requested.
  - `INTERNET`: Optional (only if remote pack updates are enabled).
  - No `ACCESS_FINE_LOCATION`, `CAMERA`, `RECORD_AUDIO`, or `READ_CONTACTS`.
- **iOS Info.plist:** Zero hardware capability keys. No ATT (App Tracking Transparency) required since zero ad networks or analytics SDKs exist.

---

## 3. Store Submission Checklist

- [ ] Google Play Families Policy review and certification.
- [ ] Apple Kids Category guidelines (Guideline 1.3): No external links without a parental gate; no third-party analytics; no behavioral advertising.
- [ ] Explicit parental gate implemented on all external documentation or data export actions.

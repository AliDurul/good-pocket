# EOD — 2026-08-05

**Status:** 0 commits ahead of `origin/main` — everything below is **uncommitted** in the working tree (74 files, +3809 / −904). Nothing is pushed.

## Done today

### Tabs & navigation
- Replaced the 3-tab bar (Home / **Second** dummy / Products) with **Home · Orders · [QR] · Points · Profile**; deleted `src/app/(tabs)/second/` entirely.
- Raised gold QR FAB (`features/navigation/components/ScanFab.tsx`) rendered as an absolute sibling of `<Tabs>`, not a `tabBarButton` — on Android a child outside its parent's bounds gets no touches. Middle tab slot is an inert spacer.
- Products / categories / users stay reachable but hidden (`href: null`); fixed the old `tabBarIcon` bug that destructured `size` and never applied it.

### QR scan flow (Screens 14–15)
- **Screen 14** `src/app/scanner.tsx` — full-screen `CameraView`, gold corner frame + sweep line, order ref appears once a payload parses, Cancel top-right. Registered as `fullScreenModal` in the authenticated guard.
- Scan lock is a **ref paired with state**: `onBarcodeScanned` fires many times/sec, so the ref blocks a duplicate mutation and the state detaches the handler. Rejected codes are remembered so one left in frame can't loop; recoverable errors re-arm after 2s.
- **Screen 15** `src/app/scan-confirmed.tsx` — 26 Reanimated falling gold coins, points counting 0→earned, balance, tier reveal with shine sweep, collapsible receipt read straight off the QR payload. ~3.2s staged; swipe-back disabled.
- Error taxonomy typed as `Record<ScanErrorCode, ScanErrorCopy>` so a new code without copy is a **compile error** — nothing can fall through to "Something went wrong".
- Confirmation is stubbed (`features/scan/stubs.ts`) with a real redeemed-set, ~900ms latency, and `-DUP` / `-NET` / `-TIER` order-ref triggers. Result handed to Screen 15 via a transient Zustand store, mirroring `locationPickerStore`.

### Points, Orders & Profile
- Points tab reuses `LoyaltyHeroCard` + `TierLadder`; Orders and Profile built on focus-refreshing stubs so a scan visibly moves both.
- Extracted the tier table to `features/loyalty/tiers.ts` (gradients, thresholds, multipliers, benefits) — was previously trapped inside `TierLadder`.
- Sign-out moved off the Home avatar onto Profile; the avatar now navigates there.
- Added `variant="points"` to `LoyaltyHeroCard` so the Points screen doesn't render points as `K180.00`. **Home renders byte-identically.**

### Auth & onboarding (staged before today, still unpushed)
- `forgot-password` screen, `AuthField` / `AuthButton` / `BrandMark` components, `mask` + `resend` + `useResendTimer` helpers.
- Login, register, step-1, onboarding and splash retheme; `loyalty-tier` query and `useMyCardInfo` added.

### Config & housekeeping
- `expo-camera` installed + config plugin in `app.json` (camera permission for iOS and Android). **Expo Go is fine; a dev client needs a native rebuild.**
- Fixed `features/home/stubs.ts` using `points` where the type says `walletBalance`.
- Nuked and regenerated `.expo/types/router.d.ts` — Metro's watcher had written source modules in as routes and kept deleted `/second` routes.

**Verification:** `npx jest` → 83 tests / 9 suites passing (37 new). `npx tsc --noEmit` → 30 errors, all pre-existing in generated gluestack primitives + `Themed.tsx`; **zero** in app/feature code, matching the baseline.

**Not verified:** nothing has run on a device. Screens 14 and 15 are unexercised at runtime.

## Open flags
- `walletBalance` is rendered as **Kwacha** on Home but the goal beside it reads **pts** — the domain conflates money and points. Pre-existing; needs a decision, not a patch.
- Debug `console.log`s currently in `scanner.tsx` (`'scanned'`) and `payload.ts` (`'decoded'`) — strip before committing.

## Next
- (nothing captured)

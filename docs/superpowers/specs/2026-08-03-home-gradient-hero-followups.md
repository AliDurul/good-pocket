# Home gradient hero — deferred follow-ups

Triaged by the final whole-branch review of `feat/home-gradient-hero` (2026-08-03).
Everything here was found, judged, and consciously deferred — none of it blocks that
branch. Recorded so the decisions aren't lost with the scratch workspace.

## Worth doing soon

**Retint the auth flow.** The palette retheme only reached the screens that consume
semantic tokens. These five call sites hardcode the old forest green and gold, so the
shipped sequence is dark-green splash → dark-green login → ivory-and-brown app:

- `src/app/login.tsx:69` — `bg-[#022e1f]`
- `src/app/login.tsx:144` — `bg-[#917400]`
- `src/app/register.tsx:142` — `bg-[#022e1f]`
- `src/app/location-picker.tsx:109,131,144` — `#022e1f`
- `src/components/SplashScreen.tsx:42` — `bg-[#022e1f]`

Design frames 1f–1i cover these screens properly; this is really a prompt to do that work.

**Pre-existing contrast failures.** Not introduced by the retheme, but the new lighter
gold makes them worse: `register.tsx:373,378` and `location-picker.tsx:190,197` put
`text-secondary-foreground` (ivory) on `bg-primary` → 2.53:1. `onboarding/index.tsx:86`
already does it correctly with `text-primary-foreground` — copy that.

**Currency mismatch.** Home renders `from K185` (`src/features/home/variant.ts`); the
Products tab it links to renders `From $185.00` (`products/index.tsx:116`, and
`products/[productId].tsx:86`). One tap apart. Pick one.

**`progressPercent` needs a tier floor.** `src/features/home/loyalty.ts` measures progress
from zero rather than from the current tier's floor, so a SILVER customer at 700 points
with 300 to GOLD reads 70% full. Invisible today because the stub only emits BRONZE.
Fixing it needs per-tier thresholds that no API or type currently provides — do it when the
real loyalty endpoint lands. The limitation is documented on the function.

## Small, safe, whenever

- **Wire the dead affordances.** `FlashSaleStrip`, `OrderAgainCard`'s "Reorder", and
  `ProductCard`'s "+" all carry `accessibilityRole="button"` but have no handler passed, so
  a screen-reader user is told there's a button and gets nothing. Either wire them or drop
  the role until there's a destination. Same for the notification bell, currently inert with
  `hasUnread={false}` because `/modal` is still the Expo scaffold.
- **`stubs.ts` `FLASH_SALE.endsAt`** is computed once at module load, so the strip
  disappears after ~2h14m of uptime. Not dev-only — a production JS context lives for days.
  Evaporates when a real endpoint replaces the stub.
- **Unused tokens.** `--brand-brown-deep` and `--brand-brown-rust` are declared in both
  token blocks and consumed nowhere: the hero gradient hardcodes `#4A1C0A`/`#7A3416`
  because a CSS gradient string can't read a CSS variable through NativeWind. That also
  means the hero card can never respond to theme. Delete them or comment that they're
  documentation-only.
- **Stale comment in `global.css`.** The header comment describes `:root.dark` / `:root.light`
  selectors that don't exist in the file and never did. Harmless on native (the provider
  pins the scheme) but wrong on web, where an OS-dark visitor gets dark tokens against light
  chrome. The project does ship web.
- **Token bypasses.** `HomeHeader` hardcodes the bell as `"rgb(74 28 10)"` (duplicating
  `--secondary`), and `(tabs)/_layout.tsx` hardcodes four hexes for the tab bar.
- **Scale drift.** Card radii across the six components are `rounded-3xl`, `rounded-[18px]`,
  and `rounded-2xl` for the same conceptual object; type sizes mix `10.5px`/`12.5px` with the
  integer scale. Faithful to the mockup, but there's no shared source of truth for a seventh
  component to follow.
- **No barrel for `src/features/home/`.** The route reaches in through five deep paths.
- **`--border` `#EADFCE` is 1.08:1 on ivory**, so the retinted tab bar's top border is
  effectively invisible. Deliberate per the design — worth a look on device.
- **Dark-mode `--success` `#5A926B`** with white text is 3.65:1, below AA. Only matters if
  dark mode is ever switched on (the app currently pins light).
- **Three now-unreachable routes.** `/categories`, `/users`, and `/home-nested` lost their
  only entry point when the placeholder Home screen was replaced. Probably fine — they're
  scaffolding — but they still ship.
- **`useCountdown`** schedules one 1s interval even when the deadline is already past at
  mount, before self-clearing on the first tick. No leak.
- **`greetingFor(new Date())`** is called inline in JSX, so the greeting won't flip at noon
  while the app stays open.

## Process note

The redundant-header defect (Critical, caught only by the whole-branch review) happened
because the plan depended on an uncommitted working-tree change that existed at the start
of the session and was reverted before the end. No task owned the file, so no per-task
review could see the gap. If a plan depends on state outside the branch, verify it at the
end as well as the start.

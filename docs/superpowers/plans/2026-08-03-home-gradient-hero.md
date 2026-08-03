# Home Gradient Hero (design 1a) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder Home screen with design 1a — an ivory screen carrying a deep-brown gradient loyalty card, flash-sale strip, horizontal featured-products row, and reorder row — and adopt 1a's palette as the app's global theme.

**Architecture:** Tailwind v4 CSS-first tokens in `src/app/global.css` are rewritten from the forest-green system to 1a's warm-brown system, so every screen inherits it. Home is decomposed into a thin route file plus a `src/features/home/` module holding two pure-logic units, three stub hooks, and seven presentational components. Gradients use React Native's `experimental_backgroundImage` CSS gradient strings, copied verbatim from the design HTML.

**Tech Stack:** Expo SDK 55, React Native 0.83 (New Architecture), Expo Router, gluestack-ui v5, NativeWind v5 / Tailwind v4, TanStack Query, `@expo-google-fonts/*`, jest-expo.

## Global Constraints

- **Do NOT install or use `expo-linear-gradient`.** Per `.agents/skills/building-native-ui/references/gradients.md`: *"Do NOT use `expo-linear-gradient` — use CSS gradients instead."* Use the `experimental_backgroundImage` style property with CSS gradient strings.
- **Do NOT add `@shopify/flash-list`.** The featured row is ~6 items and horizontal; use a horizontal `ScrollView`.
- **Do NOT add `@testing-library/react-native` or any renderer-based test setup.** `react-test-renderer` is 19.0.0 against React 19.2.0 and mismatched. Tests in this plan are plain-jest tests of pure functions only.
- **No new runtime dependencies except the two font packages** in Task 1.
- **Tailwind v4 is CSS-first.** There is no `tailwind.config.js` and none may be created. All tokens go in `src/app/global.css`.
- **Only one `useFonts()` call** may exist, in `src/app/_layout.tsx`. Extend the existing one.
- **TypeScript strict.** No `any`. Handle `null`/`undefined` explicitly.
- **Prefer gluestack primitives** from `src/components/ui/*` over raw RN `View`/`Text`, and `className` over inline styles — except for `experimental_backgroundImage`, which has no utility and must go through `style`.
- **The customer name is never hardcoded.** The mockup's "Sarah" is demo content. Read the name from the Better Auth session, fall back to `"there"`.
- **Exact palette values** (used throughout; do not re-derive):

  | Name | Hex | RGB triplet |
  |---|---|---|
  | ivory background | `#FAF7F2` | `250 247 242` |
  | espresso foreground | `#2C1408` | `44 20 8` |
  | warm gold primary | `#C9943A` | `201 148 58` |
  | gold foreground | `#3A1608` | `58 22 8` |
  | deep brown secondary | `#4A1C0A` | `74 28 10` |
  | rust (gradient end) | `#7A3416` | `122 52 22` |
  | light gold (numerals) | `#F2C879` | `242 200 121` |
  | taupe muted-foreground | `#7A5540` | `122 85 64` |
  | tinted muted fill | `#EFE6D8` | `239 230 216` |
  | hairline border | `#EADFCE` | `234 223 206` |
  | success green (countdown) | `#4A7C59` | `74 124 89` |

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `src/features/home/countdown.ts` | Pure time math: remaining ms, `HH:MM:SS` formatting |
| `src/features/home/countdown.test.ts` | Tests for the above |
| `src/features/home/variant.ts` | Pure variant selection + price/points formatting |
| `src/features/home/variant.test.ts` | Tests for the above |
| `src/features/home/types.ts` | `LoyaltySummary`, `FlashSale`, `LastOrder` |
| `src/features/home/stubs.ts` | `useLoyalty`, `useFlashSale`, `useLastOrder` |
| `src/features/home/useCountdown.ts` | React hook wrapping `countdown.ts` on a 1s interval |
| `src/features/home/components/HomeHeader.tsx` | Greeting, bell, avatar |
| `src/features/home/components/LoyaltyHeroCard.tsx` | Gradient card, glow, tier pill, points, progress |
| `src/features/home/components/FlashSaleStrip.tsx` | Percent tile, title, countdown chip |
| `src/features/home/components/SectionHeader.tsx` | Section title + "See all →" |
| `src/features/home/components/ProductCard.tsx` | 122px product card |
| `src/features/home/components/FeaturedProducts.tsx` | Horizontal row, owns `useProducts()` |
| `src/features/home/components/OrderAgainCard.tsx` | Last order + Reorder pill |

**Modified:**

| File | Change |
|---|---|
| `src/app/global.css` | Rewrite light + dark tokens; add brand + font tokens |
| `src/app/_layout.tsx` | Extend the existing `useFonts()` call |
| `src/app/(tabs)/(home)/index.tsx` | Replace placeholder with composition |
| `src/app/(tabs)/_layout.tsx` | Retint tab bar `screenOptions` |
| `package.json` | Two font packages |

---

## Task 1: Foundations — palette tokens and fonts

**Files:**
- Modify: `src/app/global.css` (whole file)
- Modify: `src/app/_layout.tsx:35-39` (the `useFonts` call) and its import block
- Modify: `package.json` (via install command)

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind utilities every later task depends on — `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `bg-secondary`, `text-secondary-foreground`, `bg-card`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-success`, `text-brand-gold-light`, `bg-brand-brown-deep`; and font utilities `font-body`, `font-body-medium`, `font-body-semibold`, `font-body-bold`, `font-display`, `font-display-black`.

- [ ] **Step 1: Install the font packages**

```bash
npx expo install @expo-google-fonts/playfair-display @expo-google-fonts/poppins
```

- [ ] **Step 2: Rewrite the token blocks in `src/app/global.css`**

Replace everything from the `@layer theme {` line through its closing brace, and replace the `@theme inline { … }` block, with the following. Keep the four `@import` lines at the top of the file exactly as they are.

```css
@layer theme {
  :root {
    /* ==========================================================================
       LIGHT MODE — design 1a "Gradient hero · classic & rich"
       Ivory ground, espresso ink, warm gold accent, deep brown for weight.
       ========================================================================== */
    --background: 250 247 242;          /* #FAF7F2 Ivory */
    --foreground: 44 20 8;              /* #2C1408 Espresso */

    --primary: 201 148 58;              /* #C9943A Warm gold */
    --primary-foreground: 58 22 8;      /* #3A1608 Dark brown on gold */

    --secondary: 74 28 10;              /* #4A1C0A Deep brown */
    --secondary-foreground: 250 247 242;/* #FAF7F2 Ivory on brown */

    --card: 255 255 255;                /* #FFFFFF */
    --card-foreground: 44 20 8;         /* #2C1408 */

    --popover: 255 255 255;             /* #FFFFFF */
    --popover-foreground: 44 20 8;      /* #2C1408 */

    --muted: 239 230 216;               /* #EFE6D8 Tinted fill */
    --muted-foreground: 122 85 64;      /* #7A5540 Taupe */

    --accent: 239 230 216;              /* #EFE6D8 */
    --accent-foreground: 44 20 8;       /* #2C1408 */

    --destructive: 197 49 49;           /* Accessible deep red */
    --destructive-foreground: 255 255 255;

    --border: 234 223 206;              /* #EADFCE Hairline */
    --input: 234 223 206;               /* #EADFCE */
    --ring: 201 148 58;                 /* #C9943A */

    /* ── Brand extensions — colors the semantic set has no slot for ────── */
    --brand-brown-deep: 74 28 10;       /* #4A1C0A hero gradient 0%   */
    --brand-brown-rust: 122 52 22;      /* #7A3416 hero gradient 100% */
    --brand-gold-light: 242 200 121;    /* #F2C879 hero numerals      */
    --success: 74 124 89;               /* #4A7C59 countdown chip     */
    --success-foreground: 255 255 255;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      /* ==========================================================================
         DARK MODE — derived from the same brown system. Not a delivered feature;
         RootLayoutNav pins colorMode to 'light'. Present so the app stays
         coherent if dark mode is ever enabled.
         ========================================================================== */
      --background: 26 14 7;            /* #1A0E07 Near-black espresso */
      --foreground: 250 247 242;        /* #FAF7F2 Ivory */

      --primary: 224 174 84;            /* #E0AE54 Brightened gold */
      --primary-foreground: 26 14 7;    /* #1A0E07 */

      --secondary: 92 40 18;            /* #5C2812 Lifted brown */
      --secondary-foreground: 250 247 242;

      --card: 45 25 14;                 /* #2D190E Raised surface */
      --card-foreground: 250 247 242;

      --popover: 45 25 14;              /* #2D190E */
      --popover-foreground: 250 247 242;

      --muted: 58 33 19;                /* #3A2113 */
      --muted-foreground: 196 168 146;  /* #C4A892 Warm gray */

      --accent: 58 33 19;               /* #3A2113 */
      --accent-foreground: 250 247 242;

      --destructive: 239 68 68;
      --destructive-foreground: 255 255 255;

      --border: 66 40 24;               /* #422818 */
      --input: 66 40 24;                /* #422818 */
      --ring: 224 174 84;               /* #E0AE54 */

      --brand-brown-deep: 58 22 8;      /* #3A1608 */
      --brand-brown-rust: 92 40 18;     /* #5C2812 */
      --brand-gold-light: 242 200 121;  /* #F2C879 */
      --success: 90 146 107;            /* #5A926B */
      --success-foreground: 255 255 255;
    }
  }
}

/* ─── Tailwind v4 utilities ───────────────────────────────────────
   bg-primary, text-foreground, border-border, font-display, etc. */
@theme inline {
  --color-primary: rgb(var(--primary));
  --color-primary-foreground: rgb(var(--primary-foreground));
  --color-card: rgb(var(--card));
  --color-card-foreground: rgb(var(--card-foreground));
  --color-secondary: rgb(var(--secondary));
  --color-secondary-foreground: rgb(var(--secondary-foreground));
  --color-background: rgb(var(--background));
  --color-popover: rgb(var(--popover));
  --color-popover-foreground: rgb(var(--popover-foreground));
  --color-muted: rgb(var(--muted));
  --color-muted-foreground: rgb(var(--muted-foreground));
  --color-destructive: rgb(var(--destructive));
  --color-destructive-foreground: rgb(var(--destructive-foreground));
  --color-foreground: rgb(var(--foreground));
  --color-border: rgb(var(--border));
  --color-input: rgb(var(--input));
  --color-ring: rgb(var(--ring));
  --color-accent: rgb(var(--accent));
  --color-accent-foreground: rgb(var(--accent-foreground));

  --color-brand-brown-deep: rgb(var(--brand-brown-deep));
  --color-brand-brown-rust: rgb(var(--brand-brown-rust));
  --color-brand-gold-light: rgb(var(--brand-gold-light));
  --color-success: rgb(var(--success));
  --color-success-foreground: rgb(var(--success-foreground));

  /* React Native cannot synthesize weights from one family — each weight is
     its own loaded family, so each gets its own utility. Names deliberately
     avoid `font-medium`/`font-semibold`/`font-bold`, which are Tailwind's
     font-weight utilities. */
  --font-body: "Poppins_400Regular";
  --font-body-medium: "Poppins_500Medium";
  --font-body-semibold: "Poppins_600SemiBold";
  --font-body-bold: "Poppins_700Bold";
  --font-display: "PlayfairDisplay_700Bold";
  --font-display-black: "PlayfairDisplay_800ExtraBold";
}
```

- [ ] **Step 3: Register the fonts in `src/app/_layout.tsx`**

Add these imports alongside the existing ones near the top of the file:

```tsx
import {
  PlayfairDisplay_700Bold,
  PlayfairDisplay_800ExtraBold,
} from '@expo-google-fonts/playfair-display';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
```

Then replace the existing `useFonts` call body (do not add a second call):

```tsx
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    ...FontAwesome.font,
  });
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0, no errors.

- [ ] **Step 5: Verify visually**

Run: `npm run android` (dev server must be reachable at the URL in `src/config/env.ts`).
Expected: the app builds. The login screen keeps its hardcoded dark-green panel
(`bg-[#022e1f]`, `src/app/login.tsx:69`) — it does not inherit the retheme, since it
never consumed `bg-background`/`text-foreground` in the first place. What to verify
is that the gold primary button (`bg-[#917400]`, `src/app/login.tsx:144`) and its
label remain legible against that dark-green panel — not that forest green is absent
from the screen.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/app/global.css src/app/_layout.tsx
git commit -m "feat(theme): adopt design 1a warm-brown palette and brand fonts"
```

---

## Task 2: Countdown time math (TDD)

**Files:**
- Create: `src/features/home/countdown.ts`
- Test: `src/features/home/countdown.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `computeRemaining(endsAt: Date, now: Date): number` — remaining milliseconds, clamped at `0`.
  - `formatRemaining(ms: number): string` — `"HH:MM:SS"`, zero-padded to 2 digits each, hours not capped at 24.

- [ ] **Step 1: Write the failing test**

Create `src/features/home/countdown.test.ts`:

```ts
import { computeRemaining, formatRemaining } from './countdown';

describe('computeRemaining', () => {
  it('returns the millisecond gap when the end is in the future', () => {
    const now = new Date('2026-08-03T10:00:00Z');
    const endsAt = new Date('2026-08-03T12:14:33Z');
    expect(computeRemaining(endsAt, now)).toBe(8073000);
  });

  it('clamps to zero when the end has passed', () => {
    const now = new Date('2026-08-03T12:00:00Z');
    const endsAt = new Date('2026-08-03T10:00:00Z');
    expect(computeRemaining(endsAt, now)).toBe(0);
  });

  it('returns zero at the exact end instant', () => {
    const at = new Date('2026-08-03T10:00:00Z');
    expect(computeRemaining(at, at)).toBe(0);
  });
});

describe('formatRemaining', () => {
  it('formats hours, minutes and seconds zero-padded', () => {
    expect(formatRemaining(8073000)).toBe('02:14:33');
  });

  it('formats zero', () => {
    expect(formatRemaining(0)).toBe('00:00:00');
  });

  it('does not roll hours over at 24', () => {
    expect(formatRemaining(90000000)).toBe('25:00:00');
  });

  it('truncates sub-second remainders rather than rounding up', () => {
    expect(formatRemaining(1999)).toBe('00:00:01');
  });

  it('treats negative input as zero', () => {
    expect(formatRemaining(-5000)).toBe('00:00:00');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest src/features/home/countdown.test.ts`
Expected: FAIL — `Cannot find module './countdown'`.

- [ ] **Step 3: Write the implementation**

Create `src/features/home/countdown.ts`:

```ts
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;

/** Milliseconds left until `endsAt`, never negative. */
export function computeRemaining(endsAt: Date, now: Date): number {
  return Math.max(0, endsAt.getTime() - now.getTime());
}

const pad = (value: number): string => String(value).padStart(2, '0');

/**
 * Renders a duration as HH:MM:SS. Hours are not capped at 24 — a three-day
 * sale reads "72:00:00" rather than silently wrapping.
 */
export function formatRemaining(ms: number): string {
  const safe = Math.max(0, ms);
  const hours = Math.floor(safe / MS_PER_HOUR);
  const minutes = Math.floor((safe % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((safe % MS_PER_MINUTE) / MS_PER_SECOND);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest src/features/home/countdown.test.ts`
Expected: PASS — 8 tests.

- [ ] **Step 5: Commit**

```bash
git add src/features/home/countdown.ts src/features/home/countdown.test.ts
git commit -m "feat(home): add countdown time math"
```

---

## Task 3: Product variant selection (TDD)

**Files:**
- Create: `src/features/home/variant.ts`
- Test: `src/features/home/variant.test.ts`

**Interfaces:**
- Consumes: `IProduct`, `IProductVariant` from `@/types` (already defined in `src/types/stock.ts`).
- Produces:
  - `selectCheapestVariant(product: IProduct): IProductVariant | null` — cheapest **active, in-stock** variant, or `null`.
  - `formatFromPrice(price: number): string` — `"from K185"`.
  - `formatPoints(earnValue: number): string` — `"+18 pts"`.

**Note on selection rules:** a variant qualifies when `isActive === true` **and** `isOutOfStock === false`. Ties on price resolve to the first qualifying variant in array order. `undefined` and empty `variants` both yield `null`.

- [ ] **Step 1: Write the failing test**

Create `src/features/home/variant.test.ts`:

```ts
import type { IProduct, IProductVariant } from '@/types';
import { formatFromPrice, formatPoints, selectCheapestVariant } from './variant';

const variant = (over: Partial<IProductVariant>): IProductVariant => ({
  id: 'v1',
  productId: 'p1',
  weightKg: 25,
  weightLabel: '25kg',
  price: 185,
  earnValue: 18,
  stockQty: 10,
  lowStockThreshold: 2,
  isOutOfStock: false,
  lastRestockedAt: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...over,
});

const product = (variants?: IProductVariant[]): IProduct => ({
  id: 'p1',
  name: 'Breakfast Meal',
  isActive: true,
  categoryId: 'c1',
  createdAt: new Date(),
  updatedAt: new Date(),
  variants,
});

describe('selectCheapestVariant', () => {
  it('returns the lowest-priced qualifying variant', () => {
    const cheap = variant({ id: 'cheap', price: 150 });
    const dear = variant({ id: 'dear', price: 320 });
    expect(selectCheapestVariant(product([dear, cheap]))?.id).toBe('cheap');
  });

  it('ignores inactive variants even when cheaper', () => {
    const cheapInactive = variant({ id: 'off', price: 10, isActive: false });
    const active = variant({ id: 'on', price: 185 });
    expect(selectCheapestVariant(product([cheapInactive, active]))?.id).toBe('on');
  });

  it('ignores out-of-stock variants even when cheaper', () => {
    const gone = variant({ id: 'gone', price: 10, isOutOfStock: true });
    const here = variant({ id: 'here', price: 185 });
    expect(selectCheapestVariant(product([gone, here]))?.id).toBe('here');
  });

  it('returns null when variants is undefined', () => {
    expect(selectCheapestVariant(product(undefined))).toBeNull();
  });

  it('returns null when variants is empty', () => {
    expect(selectCheapestVariant(product([]))).toBeNull();
  });

  it('returns null when no variant qualifies', () => {
    expect(selectCheapestVariant(product([variant({ isActive: false })]))).toBeNull();
  });

  it('resolves a price tie to the first qualifying variant', () => {
    const first = variant({ id: 'first', price: 185 });
    const second = variant({ id: 'second', price: 185 });
    expect(selectCheapestVariant(product([first, second]))?.id).toBe('first');
  });
});

describe('formatFromPrice', () => {
  it('prefixes with "from" and the kwacha symbol', () => {
    expect(formatFromPrice(185)).toBe('from K185');
  });

  it('drops trailing decimals on whole amounts', () => {
    expect(formatFromPrice(150.0)).toBe('from K150');
  });

  it('rounds fractional prices to whole kwacha', () => {
    expect(formatFromPrice(184.6)).toBe('from K185');
  });
});

describe('formatPoints', () => {
  it('renders a signed points badge', () => {
    expect(formatPoints(18)).toBe('+18 pts');
  });

  it('renders zero without a sign', () => {
    expect(formatPoints(0)).toBe('0 pts');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest src/features/home/variant.test.ts`
Expected: FAIL — `Cannot find module './variant'`.

- [ ] **Step 3: Write the implementation**

Create `src/features/home/variant.ts`:

```ts
import type { IProduct, IProductVariant } from '@/types';

const isPurchasable = (v: IProductVariant): boolean => v.isActive && !v.isOutOfStock;

/**
 * The variant a product card quotes: cheapest one a customer could actually
 * buy right now. Returns null when the product has no purchasable variant, in
 * which case the caller should not render a price.
 */
export function selectCheapestVariant(product: IProduct): IProductVariant | null {
  const purchasable = product.variants?.filter(isPurchasable) ?? [];
  if (purchasable.length === 0) return null;

  return purchasable.reduce((cheapest, candidate) =>
    candidate.price < cheapest.price ? candidate : cheapest
  );
}

export function formatFromPrice(price: number): string {
  return `from K${Math.round(price)}`;
}

export function formatPoints(earnValue: number): string {
  return earnValue > 0 ? `+${earnValue} pts` : `${earnValue} pts`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest src/features/home/variant.test.ts`
Expected: PASS — 12 tests.

- [ ] **Step 5: Commit**

```bash
git add src/features/home/variant.ts src/features/home/variant.test.ts
git commit -m "feat(home): add product variant selection and formatting"
```

---

## Task 4: Types, stub hooks, and the countdown hook

**Files:**
- Create: `src/features/home/types.ts`
- Create: `src/features/home/stubs.ts`
- Create: `src/features/home/useCountdown.ts`

**Interfaces:**
- Consumes: `computeRemaining`, `formatRemaining` from `./countdown` (Task 2).
- Produces:
  - `LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'`
  - `LoyaltySummary { tier; points; nextTier: LoyaltyTier | null; pointsToNext: number }`
  - `FlashSale { id; title; subtitle; badge; endsAt: Date }`
  - `LastOrder { id; placedAt: Date; summary: string; thumbnailUrl?: string }`
  - `StubResult<T> { data: T | null; isLoading: boolean }`
  - `useLoyalty(): StubResult<LoyaltySummary>`
  - `useFlashSale(): StubResult<FlashSale>`
  - `useLastOrder(): StubResult<LastOrder>`
  - `useCountdown(endsAt: Date): { label: string; hasExpired: boolean }`

- [ ] **Step 1: Create the types**

Create `src/features/home/types.ts`:

```ts
export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface LoyaltySummary {
  tier: LoyaltyTier;
  points: number;
  /** null once the customer is at the top tier. */
  nextTier: LoyaltyTier | null;
  /** Points still needed to reach `nextTier`; 0 at the top tier. */
  pointsToNext: number;
}

export interface FlashSale {
  id: string;
  /** e.g. "Flash Sale · 20% off maize" */
  title: string;
  /** e.g. "Ends Sunday" */
  subtitle: string;
  /** Glyph shown in the gold tile, e.g. "%" */
  badge: string;
  endsAt: Date;
}

export interface LastOrder {
  id: string;
  placedAt: Date;
  /** e.g. "2× Breakfast Meal, 1× Layers Feed" */
  summary: string;
  thumbnailUrl?: string;
}

/**
 * The subset of a TanStack Query result these screens actually read. Stub
 * hooks return this shape so swapping in a real useQuery is a drop-in change.
 */
export interface StubResult<T> {
  data: T | null;
  isLoading: boolean;
}
```

- [ ] **Step 2: Create the stub hooks**

Create `src/features/home/stubs.ts`:

```ts
import type { FlashSale, LastOrder, LoyaltySummary, StubResult } from './types';

/**
 * Static stand-ins for endpoints the API does not expose yet (loyalty balance,
 * merchandised flash sale, order history). Each hook returns the same shape a
 * useQuery call would, so replacing a body with apiFetch touches this file
 * only — no component changes.
 *
 * Values mirror the demo content in design 1a. The customer's *name* is
 * deliberately absent: it comes from the Better Auth session, not from here.
 */

const LOYALTY: LoyaltySummary = {
  tier: 'BRONZE',
  points: 180,
  nextTier: 'SILVER',
  pointsToNext: 320,
};

const FLASH_SALE: FlashSale = {
  id: 'stub-flash-sale',
  title: 'Flash Sale · 20% off maize',
  subtitle: 'Ends Sunday',
  badge: '%',
  // Relative so the countdown always has time on the clock in development.
  endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000 + 14 * 60 * 1000 + 33 * 1000),
};

const LAST_ORDER: LastOrder = {
  id: 'stub-last-order',
  placedAt: new Date('2026-06-12T09:30:00Z'),
  summary: '2× Breakfast Meal, 1× Layers Feed',
};

export function useLoyalty(): StubResult<LoyaltySummary> {
  return { data: LOYALTY, isLoading: false };
}

export function useFlashSale(): StubResult<FlashSale> {
  return { data: FLASH_SALE, isLoading: false };
}

export function useLastOrder(): StubResult<LastOrder> {
  return { data: LAST_ORDER, isLoading: false };
}
```

- [ ] **Step 3: Create the countdown hook**

Create `src/features/home/useCountdown.ts`:

```ts
import { useEffect, useState } from 'react';
import { computeRemaining, formatRemaining } from './countdown';

/**
 * Ticks once a second toward `endsAt`. The interval is cleared on unmount and
 * whenever `endsAt` changes, and stops running once the deadline passes so an
 * expired sale does not keep a timer alive.
 */
export function useCountdown(endsAt: Date): { label: string; hasExpired: boolean } {
  const [remaining, setRemaining] = useState(() => computeRemaining(endsAt, new Date()));

  useEffect(() => {
    setRemaining(computeRemaining(endsAt, new Date()));

    const id = setInterval(() => {
      const next = computeRemaining(endsAt, new Date());
      setRemaining(next);
      if (next === 0) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [endsAt]);

  return { label: formatRemaining(remaining), hasExpired: remaining === 0 };
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add src/features/home/types.ts src/features/home/stubs.ts src/features/home/useCountdown.ts
git commit -m "feat(home): add loyalty types, stub hooks and countdown hook"
```

---

## Task 5: HomeHeader

**Files:**
- Create: `src/features/home/components/HomeHeader.tsx`

**Interfaces:**
- Consumes: gluestack `Box`, `HStack`, `VStack`, `Text`, `Pressable`; `Bell` from `lucide-react-native`.
- Produces: `HomeHeader({ greeting, name, initial, hasUnread, onPressBell, onPressAvatar })`.

- [ ] **Step 1: Write the component**

Create `src/features/home/components/HomeHeader.tsx`:

```tsx
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Bell } from 'lucide-react-native';

interface HomeHeaderProps {
  greeting: string;
  name: string;
  /** Single uppercase character shown in the avatar. */
  initial: string;
  hasUnread: boolean;
  onPressBell?: () => void;
  onPressAvatar?: () => void;
}

export function HomeHeader({
  greeting,
  name,
  initial,
  hasUnread,
  onPressBell,
  onPressAvatar,
}: HomeHeaderProps) {
  return (
    <HStack className="items-center justify-between px-4 pb-3 pt-2">
      <VStack>
        <Text className="font-body text-[11px] text-muted-foreground">{greeting}</Text>
        <Text className="font-body-semibold text-[16px] text-foreground">{name} 👋</Text>
      </VStack>

      <HStack className="items-center gap-3">
        <Pressable
          onPress={onPressBell}
          accessibilityRole="button"
          accessibilityLabel={
            hasUnread ? 'Notifications, unread' : 'Notifications'
          }
          className="h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
        >
          <Bell size={16} color="rgb(74 28 10)" strokeWidth={2} />
          {hasUnread ? (
            <Box className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-[1.5px] border-card bg-primary" />
          ) : null}
        </Pressable>

        <Pressable
          onPress={onPressAvatar}
          accessibilityRole="button"
          accessibilityLabel="Account"
          className="h-[38px] w-[38px] items-center justify-center rounded-full bg-secondary"
        >
          <Text className="font-body-semibold text-[16px] text-primary">{initial}</Text>
        </Pressable>
      </HStack>
    </HStack>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/features/home/components/HomeHeader.tsx
git commit -m "feat(home): add HomeHeader component"
```

---

## Task 6: LoyaltyHeroCard

**Files:**
- Create: `src/features/home/components/LoyaltyHeroCard.tsx`

**Interfaces:**
- Consumes: `LoyaltySummary` from `../types` (Task 4).
- Produces: `LoyaltyHeroCard({ summary })`.

**Gradient strings** (verbatim from the design; do not substitute a library):
- surface — `linear-gradient(150deg, #4A1C0A 0%, #7A3416 100%)`
- glow — `radial-gradient(circle, rgba(201,148,58,0.4) 0%, transparent 70%)`
- progress fill — `linear-gradient(90deg, #C9943A 0%, #F2C879 100%)`

- [ ] **Step 1: Write the component**

Create `src/features/home/components/LoyaltyHeroCard.tsx`:

```tsx
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import type { LoyaltySummary } from '../types';

interface LoyaltyHeroCardProps {
  summary: LoyaltySummary;
}

/** Share of the way to the next tier, clamped to 0–100 and floored at a
 *  visible sliver so a customer with 0 points still sees the track start. */
function progressPercent(points: number, pointsToNext: number): number {
  const total = points + pointsToNext;
  if (total <= 0) return 100;
  return Math.min(100, Math.max(2, Math.round((points / total) * 100)));
}

export function LoyaltyHeroCard({ summary }: LoyaltyHeroCardProps) {
  const { tier, points, nextTier, pointsToNext } = summary;
  const percent = progressPercent(points, pointsToNext);
  const goalLabel = nextTier
    ? `${pointsToNext} pts to ${nextTier.charAt(0)}${nextTier.slice(1).toLowerCase()}`
    : 'Top tier reached';

  return (
    <Box
      className="mx-4 overflow-hidden rounded-3xl px-5 py-[22px]"
      style={{
        experimental_backgroundImage:
          'linear-gradient(150deg, #4A1C0A 0%, #7A3416 100%)',
      }}
    >
      {/* Gold bloom bleeding off the top-right corner. */}
      <Box
        pointerEvents="none"
        className="absolute -right-[34px] -top-[34px] h-[150px] w-[150px] rounded-full"
        style={{
          experimental_backgroundImage:
            'radial-gradient(circle, rgba(201,148,58,0.4) 0%, transparent 70%)',
        }}
      />

      <HStack className="items-center justify-between">
        <Box className="rounded-full bg-primary px-[11px] py-[5px]">
          <Text className="font-body-bold text-[10px] tracking-[1px] text-primary-foreground">
            {tier}
          </Text>
        </Box>
        <Text className="font-body text-[11px] text-secondary-foreground/70">
          Loyalty balance
        </Text>
      </HStack>

      <HStack className="mt-4 items-end gap-2">
        <Text className="font-display-black text-[46px] leading-[46px] text-brand-gold-light">
          {points}
        </Text>
        <Text className="mb-2 font-body-medium text-[13px] text-secondary-foreground/80">
          points
        </Text>
      </HStack>

      <Box className="mt-[18px]">
        <HStack className="mb-[7px] justify-between">
          <Text className="font-body-medium text-[10.5px] text-secondary-foreground/[0.78]">
            {tier.charAt(0)}{tier.slice(1).toLowerCase()}
          </Text>
          <Text className="font-body-medium text-[10.5px] text-secondary-foreground/[0.78]">
            {goalLabel}
          </Text>
        </HStack>

        <Box className="h-2 overflow-hidden rounded-md bg-secondary-foreground/[0.16]">
          <Box
            className="h-full rounded-md"
            style={{
              width: `${percent}%`,
              experimental_backgroundImage:
                'linear-gradient(90deg, #C9943A 0%, #F2C879 100%)',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/features/home/components/LoyaltyHeroCard.tsx
git commit -m "feat(home): add LoyaltyHeroCard with CSS gradient surface"
```

---

## Task 7: FlashSaleStrip

**Files:**
- Create: `src/features/home/components/FlashSaleStrip.tsx`

**Interfaces:**
- Consumes: `FlashSale` from `../types` (Task 4); `useCountdown` from `../useCountdown` (Task 4).
- Produces: `FlashSaleStrip({ sale, onPress })`.

- [ ] **Step 1: Write the component**

Create `src/features/home/components/FlashSaleStrip.tsx`:

```tsx
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { FlashSale } from '../types';
import { useCountdown } from '../useCountdown';

interface FlashSaleStripProps {
  sale: FlashSale;
  onPress?: () => void;
}

export function FlashSaleStrip({ sale, onPress }: FlashSaleStripProps) {
  const { label, hasExpired } = useCountdown(sale.endsAt);

  // A sale past its deadline is no longer an offer — drop the whole strip
  // rather than showing 00:00:00.
  if (hasExpired) return null;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" className="mx-4 mt-[14px]">
      <HStack className="items-center gap-[13px] rounded-[18px] border border-border bg-card px-[15px] py-[13px]">
        <Box
          className="h-[46px] w-[46px] items-center justify-center rounded-xl"
          style={{
            experimental_backgroundImage:
              'linear-gradient(135deg, #C9943A 0%, #E7B45F 100%)',
          }}
        >
          <Text className="font-display-black text-[20px] text-primary-foreground">
            {sale.badge}
          </Text>
        </Box>

        <VStack className="flex-1">
          <Text className="font-body-semibold text-[13px] text-foreground">
            {sale.title}
          </Text>
          <Text className="mt-0.5 font-body text-[11px] text-muted-foreground">
            {sale.subtitle}
          </Text>
        </VStack>

        <Box className="rounded-lg bg-success px-[9px] py-[5px]">
          <Text className="font-body-semibold text-[11px] text-success-foreground">
            {label}
          </Text>
        </Box>
      </HStack>
    </Pressable>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/features/home/components/FlashSaleStrip.tsx
git commit -m "feat(home): add FlashSaleStrip with live countdown"
```

---

## Task 8: ProductCard

**Files:**
- Create: `src/features/home/components/ProductCard.tsx`

**Interfaces:**
- Consumes: `IProduct` from `@/types`; `selectCheapestVariant`, `formatFromPrice`, `formatPoints` from `../variant` (Task 3).
- Produces: `ProductCard({ product, onPress, onAdd })`.

**Placeholder note:** `repeating-linear-gradient` is not among the supported CSS gradient functions, so a product without an image gets a flat `bg-muted` tile carrying the variant's `weightLabel` chip.

- [ ] **Step 1: Write the component**

Create `src/features/home/components/ProductCard.tsx`:

```tsx
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { IProduct } from '@/types';
import { formatFromPrice, formatPoints, selectCheapestVariant } from '../variant';

interface ProductCardProps {
  product: IProduct;
  onPress?: () => void;
  onAdd?: () => void;
}

export function ProductCard({ product, onPress, onAdd }: ProductCardProps) {
  const variant = selectCheapestVariant(product);
  const imageUri = variant?.image ?? product.image;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={product.name}
      className="w-[122px] overflow-hidden rounded-2xl border border-border bg-card"
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          alt={product.name}
          size="none"
          className="h-[84px] w-full"
          resizeMode="cover"
        />
      ) : (
        <Box className="h-[84px] w-full items-center justify-center bg-muted">
          <Box className="rounded bg-background/80 px-[5px] py-0.5">
            <Text className="font-body text-[8px] text-muted-foreground">
              {variant?.weightLabel ?? product.name}
            </Text>
          </Box>
        </Box>
      )}

      <VStack className="px-2.5 pb-[11px] pt-[9px]">
        <Text
          numberOfLines={2}
          className="font-body-semibold text-[12px] leading-[14px] text-foreground"
        >
          {product.name}
        </Text>

        {variant ? (
          <Text className="mt-0.5 font-body text-[10px] text-muted-foreground">
            {formatFromPrice(variant.price)}
          </Text>
        ) : (
          <Text className="mt-0.5 font-body text-[10px] text-muted-foreground">
            Unavailable
          </Text>
        )}

        <HStack className="mt-[9px] items-center justify-between">
          <Text className="font-body-semibold text-[11px] text-primary">
            {variant ? formatPoints(variant.earnValue) : ''}
          </Text>

          {variant ? (
            <Pressable
              onPress={onAdd}
              accessibilityRole="button"
              accessibilityLabel={`Add ${product.name} to basket`}
              className="h-[26px] w-[26px] items-center justify-center rounded-lg bg-secondary"
            >
              <Text className="font-body-semibold text-[17px] leading-[17px] text-primary">
                +
              </Text>
            </Pressable>
          ) : null}
        </HStack>
      </VStack>
    </Pressable>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/features/home/components/ProductCard.tsx
git commit -m "feat(home): add ProductCard"
```

---

## Task 9: SectionHeader and FeaturedProducts

**Files:**
- Create: `src/features/home/components/SectionHeader.tsx`
- Create: `src/features/home/components/FeaturedProducts.tsx`

**Interfaces:**
- Consumes: `useProducts` and `ProductFilters` from `@/api/queries/products`; `ProductCard` from `./ProductCard` (Task 8).
- Produces: `SectionHeader({ title, actionLabel, onPressAction })`; `FeaturedProducts({ onPressProduct, onAddProduct, onSeeAll })`.

**Behaviour:** loading renders three 122px skeleton tiles so the row does not reflow; error and empty both collapse the whole section — a failed product fetch must never hide the loyalty card above it.

- [ ] **Step 1: Write SectionHeader**

Create `src/features/home/components/SectionHeader.tsx`:

```tsx
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onPressAction }: SectionHeaderProps) {
  return (
    <HStack className="items-baseline justify-between px-4 pb-2.5 pt-[18px]">
      <Text className="font-display text-[16px] text-foreground">{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onPressAction} accessibilityRole="button">
          <Text className="font-body-medium text-[11px] text-primary">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </HStack>
  );
}
```

- [ ] **Step 2: Write FeaturedProducts**

Create `src/features/home/components/FeaturedProducts.tsx`:

```tsx
import { useProducts } from '@/api/queries/products';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import type { IProduct } from '@/types';
import { ScrollView } from 'react-native';
import { ProductCard } from './ProductCard';
import { SectionHeader } from './SectionHeader';

interface FeaturedProductsProps {
  onPressProduct?: (product: IProduct) => void;
  onAddProduct?: (product: IProduct) => void;
  onSeeAll?: () => void;
}

function SkeletonRow() {
  return (
    <HStack className="gap-3 px-4">
      {[0, 1, 2].map((key) => (
        <Box
          key={key}
          className="h-[168px] w-[122px] rounded-2xl border border-border bg-muted"
        />
      ))}
    </HStack>
  );
}

export function FeaturedProducts({
  onPressProduct,
  onAddProduct,
  onSeeAll,
}: FeaturedProductsProps) {
  const { data, isLoading, isError } = useProducts({ limit: 6, isActive: true });
  const products = data?.data ?? [];

  // A products outage must not take the screen down with it.
  if (isError) return null;
  if (!isLoading && products.length === 0) return null;

  return (
    <Box>
      <SectionHeader title="Featured Products" actionLabel="See all →" onPressAction={onSeeAll} />

      {isLoading ? (
        <SkeletonRow />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          // Not contentContainerClassName — that prop only exists on
          // react-native-css's ScrollView wrapper, and this is RN's own, so a
          // className here would be silently dropped.
          contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingBottom: 4 }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => onPressProduct?.(product)}
              onAdd={() => onAddProduct?.(product)}
            />
          ))}
        </ScrollView>
      )}
    </Box>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

(`IListResponse<T>` in `src/types/common.ts` is `{ success: true; data: T[]; pagination: IPagination }`, so `data?.data ?? []` is already correct — no adjustment needed.)

- [ ] **Step 4: Commit**

```bash
git add src/features/home/components/SectionHeader.tsx src/features/home/components/FeaturedProducts.tsx
git commit -m "feat(home): add featured products row backed by useProducts"
```

---

## Task 10: OrderAgainCard

**Files:**
- Create: `src/features/home/components/OrderAgainCard.tsx`

**Interfaces:**
- Consumes: `LastOrder` from `../types` (Task 4).
- Produces: `OrderAgainCard({ order, onReorder })`.

- [ ] **Step 1: Write the component**

Create `src/features/home/components/OrderAgainCard.tsx`:

```tsx
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { format } from 'date-fns';
import type { LastOrder } from '../types';
import { SectionHeader } from './SectionHeader';

interface OrderAgainCardProps {
  order: LastOrder;
  onReorder?: () => void;
}

export function OrderAgainCard({ order, onReorder }: OrderAgainCardProps) {
  return (
    <Box className="pb-5">
      <SectionHeader title="Order again" />

      <HStack className="mx-4 items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-3">
        {order.thumbnailUrl ? (
          <Image
            source={{ uri: order.thumbnailUrl }}
            alt=""
            size="none"
            className="h-[42px] w-[42px] rounded-[10px]"
            resizeMode="cover"
          />
        ) : (
          <Box className="h-[42px] w-[42px] rounded-[10px] bg-muted" />
        )}

        <VStack className="flex-1">
          <Text className="font-body-semibold text-[12.5px] text-foreground">
            Last order · {format(order.placedAt, 'd MMM')}
          </Text>
          <Text
            numberOfLines={1}
            className="mt-px font-body text-[10.5px] text-muted-foreground"
          >
            {order.summary}
          </Text>
        </VStack>

        <Pressable
          onPress={onReorder}
          accessibilityRole="button"
          accessibilityLabel="Reorder"
          className="rounded-full border-[1.5px] border-primary px-[13px] py-1.5"
        >
          <Text className="font-body-semibold text-[11px] text-secondary">Reorder</Text>
        </Pressable>
      </HStack>
    </Box>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0. `date-fns` is already a dependency at ^4.1.0.

- [ ] **Step 3: Commit**

```bash
git add src/features/home/components/OrderAgainCard.tsx
git commit -m "feat(home): add OrderAgainCard"
```

---

## Task 11: Compose the Home route and retint the tab bar

**Files:**
- Modify: `src/app/(tabs)/(home)/index.tsx` (replace entire contents)
- Modify: `src/app/(tabs)/_layout.tsx:11-14` (the `screenOptions` object)

**Interfaces:**
- Consumes: everything produced by Tasks 4–10; `authClient` from `@/lib/auth-client`; `useRouter` from `expo-router`.
- Produces: the rendered Home screen.

- [ ] **Step 1: Replace the Home route**

Replace the entire contents of `src/app/(tabs)/(home)/index.tsx`:

```tsx
import { Box } from '@/components/ui/box';
import { FeaturedProducts } from '@/features/home/components/FeaturedProducts';
import { FlashSaleStrip } from '@/features/home/components/FlashSaleStrip';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { LoyaltyHeroCard } from '@/features/home/components/LoyaltyHeroCard';
import { OrderAgainCard } from '@/features/home/components/OrderAgainCard';
import { useFlashSale, useLastOrder, useLoyalty } from '@/features/home/stubs';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // The mockup's "Sarah" is demo content; the real name comes from the session.
  const fullName = session?.user?.name?.trim();
  const displayName = fullName && fullName.length > 0 ? fullName.split(' ')[0] : 'there';
  const initial = (fullName ?? 'G').charAt(0).toUpperCase();

  const { data: loyalty } = useLoyalty();
  const { data: flashSale } = useFlashSale();
  const { data: lastOrder } = useLastOrder();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <HomeHeader
          greeting={greetingFor(new Date())}
          name={displayName}
          initial={initial}
          hasUnread
          onPressBell={() => router.push('/modal')}
        />

        {loyalty ? <LoyaltyHeroCard summary={loyalty} /> : null}
        {flashSale ? <FlashSaleStrip sale={flashSale} /> : null}

        <FeaturedProducts
          onPressProduct={(product) => router.push(`/products/${product.id}`)}
          onSeeAll={() => router.push('/products')}
        />

        {lastOrder ? <OrderAgainCard order={lastOrder} /> : null}

        <Box className="h-2" />
      </ScrollView>
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: Retint the tab bar**

In `src/app/(tabs)/_layout.tsx`, replace the `screenOptions` object passed to `<Tabs>`:

```tsx
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#C9943A',
            tabBarInactiveTintColor: '#7A5540',
            tabBarStyle: {
                backgroundColor: '#FAF7F2',
                borderTopColor: '#EADFCE',
            },
        }}>
```

Leave every `<Tabs.Screen>` exactly as it is.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Run the whole test suite**

Run: `npx jest --watchAll=false`
Expected: PASS — 20 tests across `countdown.test.ts` and `variant.test.ts`.

- [ ] **Step 5: Verify on device**

Run: `npm run android`

Check each:
- Screen ground is ivory `#FAF7F2`; no forest green anywhere except the countdown chip.
- Hero card shows a brown→rust diagonal gradient with a gold bloom off the top-right corner.
- `180` renders in Playfair Display in light gold, not a system serif.
- Progress track is 36% filled (180 of 500), gold→light-gold left to right.
- Countdown chip ticks down once a second.
- Featured Products shows real product names and prices from the API; with the dev server stopped, the section collapses and the rest of the screen still renders.
- Tab bar is ivory with a gold active icon.

- [ ] **Step 6: Commit**

```bash
git add "src/app/(tabs)/(home)/index.tsx" "src/app/(tabs)/_layout.tsx"
git commit -m "feat(home): compose gradient hero home screen and retint tab bar"
```

---

## Done

`npx tsc --noEmit` clean, `npx jest --watchAll=false` green, and Home renders per design 1a on device.

**Deliberately not built** (from the spec's Out of Scope): login/register/onboarding redesign to frames 1f–1i; real loyalty, flash-sale, and order endpoints; basket and loyalty-detail destinations behind "See all", "+", and "Reorder"; dark mode as a delivered feature.

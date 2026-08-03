# Home screen — gradient hero (design 1a)

**Date:** 2026-08-03
**Source design:** Claude Design project `1f1103bb-ec47-43b9-b6db-a4f47af3682f`, file `Good Taste App.dc.html`, frame `1a` — "Gradient hero · classic & rich"

## Goal

Replace the placeholder Home screen (`src/app/(tabs)/(home)/index.tsx`, currently a
`Center` of navigation buttons) with the 1a design: an ivory screen carrying a
deep-brown gradient loyalty card, a flash-sale strip, a horizontal featured-products
row, and a reorder row.

Design 1a is also the chosen direction for the app as a whole, so its palette becomes
the app's global theme rather than a Home-local style.

## Decisions

Three decisions were settled before design:

1. **Palette scope — retheme globally.** The app's current tokens are Cream + Forest
   Green + Gold. Design 1a is Ivory + deep Brown + warm Gold. Rather than run two
   palettes, the light-mode tokens in `src/app/global.css` are rewritten to 1a's
   system. Onboarding inherits the retheme because it consumes `bg-background` /
   `text-foreground`. Login, register, location-picker, and the splash screen do
   **not** inherit it — they hardcode `#022e1f` (forest green) and `#917400` (gold)
   directly rather than consuming the semantic tokens, at these call sites:
   - `src/app/login.tsx:69` — `bg-[#022e1f]`
   - `src/app/login.tsx:144` — `bg-[#917400]`
   - `src/app/register.tsx:142` — `bg-[#022e1f]`
   - `src/app/location-picker.tsx:109,131,144` — `#022e1f`
   - `src/components/SplashScreen.tsx:44` — `bg-[#022e1f]`

   These will remain forest-green until they are separately retinted; that retint
   is deferred, not in scope here.
2. **Data — real products, typed stubs elsewhere.** `useProducts()` exists and its
   variants carry `price` and `earnValue`, which map onto the mockup's `from K185`
   and `+18 pts`. Loyalty, flash sale, and last order have no endpoints, so they are
   served by stub hooks shaped like `useQuery` results.
3. **Fonts — install Playfair Display and Poppins.** The serif numerals are central
   to why this direction reads as "rich"; system fonts lose that.

## Foundations

### Tokens

The project uses Tailwind v4 CSS-first configuration — there is no `tailwind.config.js`,
so all token work happens in `src/app/global.css`.

Light mode (`:root`) is rewritten to:

| Token | Value | Hex | Role |
|---|---|---|---|
| `--background` | `250 247 242` | `#FAF7F2` | screen ivory |
| `--foreground` | `44 20 8` | `#2C1408` | espresso text |
| `--primary` | `201 148 58` | `#C9943A` | warm gold |
| `--primary-foreground` | `58 22 8` | `#3A1608` | text on gold |
| `--secondary` | `74 28 10` | `#4A1C0A` | deep brown |
| `--secondary-foreground` | `250 247 242` | `#FAF7F2` | text on brown |
| `--card` | `255 255 255` | `#FFFFFF` | card white |
| `--card-foreground` | `44 20 8` | `#2C1408` | |
| `--muted` | `239 230 216` | `#EFE6D8` | tinted fill |
| `--muted-foreground` | `122 85 64` | `#7A5540` | taupe secondary text |
| `--border` / `--input` | `234 223 206` | `#EADFCE` | hairline |
| `--ring` | `201 148 58` | `#C9943A` | focus |
| `--destructive` | `197 49 49` | | unchanged |

Four tokens are added because the mockup needs colors the existing set has no slot for:

| Token | Value | Hex | Used by |
|---|---|---|---|
| `--brand-brown-deep` | `74 28 10` | `#4A1C0A` | hero gradient stop 0% |
| `--brand-brown-rust` | `122 52 22` | `#7A3416` | hero gradient stop 100% |
| `--brand-gold-light` | `242 200 121` | `#F2C879` | hero numerals, progress fill end |
| `--success` | `74 124 89` | `#4A7C59` | countdown chip — the only green retained |

Each gets a matching `--color-*` entry in the `@theme inline` block so it is reachable
as a utility (`bg-brand-brown-deep`, `text-brand-gold-light`, `bg-success`).

Dark mode (`@media (prefers-color-scheme: dark)`) is rewritten to a derived brown
variant — dark espresso background, ivory foreground, brightened gold. The mockup does
not specify dark mode and `RootLayoutNav` currently pins `colorMode = 'light'`, so this
exists to keep the app coherent if dark mode is enabled later, not as a delivered feature.

### Fonts

Add `@expo-google-fonts/playfair-display` and `@expo-google-fonts/poppins`. Register in
the existing `useFonts()` call in `src/app/_layout.tsx` (do not add a second call):

- Playfair Display: `700Bold`, `800ExtraBold`
- Poppins: `400Regular`, `500Medium`, `600SemiBold`, `700Bold`

Expose in `@theme inline` as `--font-display` (Playfair) and `--font-sans` (Poppins),
giving `font-display` and `font-sans` utilities. `SpaceMono` and `FontAwesome.font` stay.

### Gradients

Gradients use React Native's CSS gradient support via the `experimental_backgroundImage`
style property, per `.agents/skills/building-native-ui/references/gradients.md`, which
states plainly: *"Do NOT use `expo-linear-gradient` — use CSS gradients instead."*

This requires the New Architecture. Expo SDK 55 / RN 0.83 enables it by default and
`app.json` contains no opt-out, so the requirement is met.

The practical benefit is that gradient strings transfer verbatim from the design HTML —
no library, no new dependency, no angle conversion:

| Element | Value |
|---|---|
| Hero surface | `linear-gradient(150deg, #4A1C0A 0%, #7A3416 100%)` |
| Hero glow | `radial-gradient(circle, rgba(201,148,58,0.4) 0%, transparent 70%)` |
| Progress fill | `linear-gradient(90deg, #C9943A 0%, #F2C879 100%)` |
| Promo tile | `linear-gradient(135deg, #C9943A 0%, #E7B45F 100%)` |
| Image placeholder | `repeating-linear-gradient(45deg, …)` — see note below |

No new dependencies are added.

- **`expo-linear-gradient`** — explicitly *not* installed, per the skill above.
- **`react-native-svg`** — already present at 15.15.3, but no longer needed for the glow
  now that `radial-gradient` is available. Left unused by this work.
- **`@shopify/flash-list`** — not added. The repo convention prefers it for large lists,
  but the featured row is roughly six items and horizontal, so a plain horizontal
  `ScrollView` is the simpler correct choice.

**Placeholder caveat:** `repeating-linear-gradient` is not listed among the supported CSS
gradient functions in the reference. The striped product placeholder therefore falls back
to a flat `--muted` (`#EFE6D8`) fill with the `weightLabel` chip on top. If a spike shows
`repeating-linear-gradient` renders correctly, the stripes can be restored; the flat fill
is the committed behaviour.

## Structure

Repo convention (`.github/AGENTS.MD`) is to keep route files thin and move logic into
hooks or feature modules. So:

```
src/features/home/
  types.ts                    LoyaltySummary · FlashSale · LastOrder
  stubs.ts                    useLoyalty() · useFlashSale() · useLastOrder()
  useCountdown.ts             ticking countdown for the flash-sale chip
  components/
    HomeHeader.tsx            greeting · notification bell with dot · avatar
    LoyaltyHeroCard.tsx       gradient + radial glow + tier pill + points + progress
    FlashSaleStrip.tsx        percent tile · title · countdown chip
    SectionHeader.tsx         section title + "See all →"
    FeaturedProducts.tsx      horizontal product row, reads useProducts()
    ProductCard.tsx           122px card · price · +pts · add button
    OrderAgainCard.tsx        last order summary · Reorder pill

src/app/(tabs)/(home)/index.tsx   composition only, ~40 lines
```

Each component takes its data as props except `FeaturedProducts`, which owns its query.
This keeps the presentational pieces independently renderable and testable, and means
the route file's only job is layout order inside a `SafeAreaView` + `ScrollView`.

### Component contracts

- **`HomeHeader`** — props `{ name: string; initial: string; hasUnread: boolean }`.
  Renders the "Good morning / Sarah 👋" stack, a bell button with a gold unread dot, and
  a brown circular avatar with a gold initial. Name and initial derive from the Better
  Auth session (`authClient.useSession()`) in the route file, with a fallback for a
  missing name.
- **`LoyaltyHeroCard`** — props `{ summary: LoyaltySummary }`. Renders the gradient
  surface, the SVG radial glow, the tier pill, the Playfair points numeral, and the
  progress track. Progress percentage is computed from `points` and `pointsToNext`, not
  passed in.
- **`FlashSaleStrip`** — props `{ sale: FlashSale }`. Calls `useCountdown(sale.endsAt)`
  internally for the `HH:MM:SS` chip. Renders nothing when `sale` is null.
- **`FeaturedProducts`** — no props. Calls `useProducts({ limit: 6, isActive: true })`.
- **`ProductCard`** — props `{ product: IProduct }`. Derives display price and points
  from the product's cheapest active variant.
- **`OrderAgainCard`** — props `{ order: LastOrder }`, plus an `onReorder` callback.

## Data flow

**Featured products** use the existing `useProducts({ limit: 6, isActive: true })` hook
from `src/api/queries/products.ts`. For each product, the cheapest active variant supplies
the display price (`from K{price}`) and the points badge (`+{earnValue} pts`). Products
carrying an `image` render it; those without fall back to the diagonal-stripe placeholder
used in the mockup, labelled with the variant's `weightLabel`.

- Loading: three skeleton cards at the same 122px width, so the row does not reflow.
- Error: the section collapses. A missing product row must not block the loyalty card,
  which is the screen's primary content.
- Empty: the section collapses.

**Loyalty, flash sale, and last order** come from `src/features/home/stubs.ts`. Each stub
hook returns `{ data, isLoading: false }` — the shape `useQuery` returns — so swapping in
a real `apiFetch` call later changes one file and no components. Stub values match the
mockup: Bronze tier, 180 points, 320 to Silver; 20% off maize ending Sunday; last order
12 Jun with 2× Breakfast Meal and 1× Layers Feed. The customer name is *not* stubbed —
the header reads it from the Better Auth session, falling back to "there" when absent.
The mockup's "Sarah" is demo content, not a value to hardcode.

`useCountdown(endsAt)` holds the remaining milliseconds in state and updates on a 1s
interval, clearing on unmount and clamping at zero. When it reaches zero the strip hides.

## Screen chrome

The mockup's status bar and home indicator are device chrome, not app UI, and are not
built. The screen uses `SafeAreaView` with a `ScrollView` body.

The tab bar in `src/app/(tabs)/_layout.tsx` is currently `tomato` / `gray`, which clashes
with the ivory-and-brown screen. Its `screenOptions` change to active `#C9943A`, inactive
`#7A5540`, on an ivory bar with a `#EADFCE` top border. This is a single options object;
no tab structure changes.

## Out of scope

- **Login, register, and onboarding redesign.** Onboarding visibly reskins as a side
  effect of the global retheme; login and register do not, since they hardcode their
  own colours (see Decision 1). None of the three are designed to frames 1f–1i. That
  is separate work.
- **Real loyalty, flash-sale, and order endpoints.** Backend does not expose them.
- **"See all →", the add-to-basket button, and "Reorder" wiring.** Rendered per the
  design and given pressable affordances, but their handlers are left as stubs — basket
  and loyalty-detail destinations do not exist yet.
- **Dark mode as a delivered feature.** Tokens are defined; the app stays pinned to light.
- **Retinting login, register, location-picker, and the splash screen.** They hardcode
  `#022e1f`/`#917400` rather than consuming the semantic tokens (Decision 1) and remain
  forest-green for now. Follow-up work.

## Verification

- `npx tsc --noEmit` passes.
- App builds and Home renders on Android against the running dev server.
- Featured Products shows real product names and prices when the API is reachable, and
  collapses without breaking the screen when it is not.
- The countdown chip visibly ticks.
- Login and register still render legibly under the new tokens (contrast check on the
  gold primary button, which now sits on ivory rather than green).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start           # Start Expo dev server (or: yarn start)
npm run android     # Start with Android
npm run ios         # Start with iOS
npm run web         # Start web
npm run build       # Export web build to dist/
npm test            # Run jest in watch mode (jest-expo preset)
```

Run a single test file: `npx jest path/to/file.test.tsx`

## Stack

Expo SDK 55 + Expo Router (file-based routing) + React Native 0.83 + TypeScript (strict) + gluestack-ui v5 + NativeWind/Tailwind v4 + TanStack Query + Zustand + Better Auth + react-hook-form + zod.

The `@/*` path alias maps to `./src/*` (configured in both `tsconfig.json` and `babel.config.js` via `module-resolver`).

## Architecture

### Routing & route protection (`src/app`)

Routes live under `src/app` using Expo Router's file-based conventions (route groups like `(tabs)`, dynamic segments like `[productId]`). `src/app/_layout.tsx` is the root: it wraps the app in `GluestackUIProvider`, `ThemeProvider`, `GestureHandlerRootView`, and `QueryClientProvider`, then renders a single `<Stack>` whose screen groups are gated with `Stack.Protected guard={...}`:

- `guard={!!session}` → `(tabs)` and `modal` (authenticated app)
- `guard={!session && onboardingCompleted}` → `login` / `register`
- `guard={!onboardingCompleted}` → `onboarding`

Auth state comes from `authClient.useSession()` (Better Auth); onboarding state comes from the persisted Zustand store (`useGlobalStore`). When adding new top-level routes/flows, register the screen inside the appropriate `Stack.Protected` block rather than introducing parallel navigation logic.

### Auth (`src/lib/auth-client.ts`)

Better Auth is the single source of truth for authentication — created once via `createAuthClient` with the `expoClient` plugin (uses `expo-secure-store` for storage, scheme `goodpocket`). Don't create additional auth clients or hand-roll JWT/session state; consume `authClient.useSession()`, `authClient.signIn.email(...)`, etc. The base URL currently points at a local dev server (`http://10.0.2.2:8000`, the Android emulator alias for the host machine's `localhost`).

### Data fetching (TanStack Query)

`src/lib/query-client.ts` exports the single shared `queryClient` (provided once in the root layout — never instantiate another). `src/lib/react-query.ts` (`setupReactQuery`) wires React Query's `focusManager` to `AppState` and `onlineManager` to `expo-network` connectivity for proper refetch-on-focus/reconnect behavior on native. Use `useQuery` for reads and `useMutation` for writes; never fetch directly inside components. Query key factories belong in `src/queries`.

### Forms & validation

Forms use `react-hook-form` with `zodResolver` against schemas in `src/zod` (e.g. `signInSchema`, `signUpSchema` in `src/zod/auth.ts`, with inferred types like `SignInForm`/`SignUpForm` exported alongside). See `src/app/login.tsx` for the canonical pattern: `Controller`-wrapped gluestack `Input`/`FormControl` components, `formState: { errors, isSubmitting }` driving inline error text and a loading `ButtonSpinner`.

### State management

- Server state → TanStack Query
- Auth state → Better Auth (`authClient`)
- Cross-screen/persisted local state → Zustand with `persist` + `expo-secure-store` as the storage backend (see `src/stores/globalStore.ts` for the pattern: wrap `getItem`/`setItem`/`deleteItemAsync` in `createJSONStorage`)
- Local component state → `useState`

Avoid introducing additional global state libraries.

### UI (gluestack-ui + NativeWind)

`src/components/ui/*` contains the full set of generated gluestack-ui v5 primitives (Box, Text, Button, Input, VStack, HStack, FormControl, etc.) styled via Tailwind `className` (NativeWind). Prefer these primitives over raw React Native `View`/`Text`/`StyleSheet`, and prefer `className` + design tokens over inline styles. Build new shared components by composing these primitives; only add wrapper components when reused in multiple places.

### Environment

`src/config/env.ts` reads `EXPO_PUBLIC_API_URL` / `EXPO_PUBLIC_API_KEY` from `process.env`. Never hardcode API endpoints — read from environment variables.

## Project conventions (from `.github/AGENTS.MD`)

- Keep screens thin; move business/API logic into hooks or feature modules, not directly into route files.
- Centralize API calls; use stable, non-duplicated query keys; invalidate queries after successful mutations.
- Use `FlashList` instead of `FlatList` for large/performance-critical lists.
- TypeScript strict mode — avoid `any`, prefer inferred types, handle `null`/`undefined` explicitly.
- Don't create multiple `QueryClient` or auth client instances.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

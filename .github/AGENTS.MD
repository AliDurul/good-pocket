# Mobile App Agent Instructions

## Stack

* Expo SDK 55
* Expo Router
* React Native
* TypeScript
* gluestack-ui v5
* Tailwind CSS v4 (NativeWind)
* TanStack Query
* Better Auth

## Structure

```text
app/                 # Expo Router routes
components/          # Shared UI components
features/            # Feature modules
hooks/
providers/
lib/
  api.ts
  auth.ts
  query-client.ts
```

## Routing

* Use Expo Router file-based routing
* Public routes belong in `(auth)`
* Protected routes belong in `(app)`
* Keep screens thin and move business logic into features

Example:

```text
app/
  (auth)/
    sign-in.tsx

  (app)/
    index.tsx
```

## gluestack-ui

### Rules

* Prefer gluestack-ui components over custom UI
* Use `Box`, `Text`, `Button`, `Input`, `VStack`, `HStack`, etc.
* Build reusable components from gluestack primitives
* Avoid creating wrapper components unless reused multiple times

### Styling

* Use `className`
* Prefer design tokens over hardcoded colors
* Avoid inline styles unless required
* Use spacing utilities instead of custom margins/paddings

Good:

```tsx
<Box className="p-4 rounded-xl">
  <Text>Profile</Text>
</Box>
```

Avoid:

```tsx
<View style={{ padding: 16 }}>
```

## Tailwind

* Use Tailwind utilities for layout and spacing
* Avoid large unreadable class lists
* Extract repeated UI into reusable components
* Do not mix multiple styling approaches unnecessarily

## TanStack Query

### Rules

* `useQuery` for reads
* `useMutation` for writes
* Keep API calls inside feature folders
* Use stable query keys
* Invalidate queries after successful mutations
* Never fetch data directly inside components

Example:

```ts
export const userKeys = {
  all: ["users"],
  detail: (id: string) => ["users", id],
};
```

### Query Client

Create a single shared QueryClient.

```ts
export const queryClient = new QueryClient();
```

Register it once in the root layout.

## Better Auth

### Rules

* Use Better Auth as the single authentication source
* Do not manually manage JWTs
* Do not create custom auth state stores
* Access session through Better Auth APIs

Example:

```ts
const { data: session } = authClient.useSession();
```

### Route Protection

* `(auth)` → public routes
* `(app)` → authenticated routes
* Redirect unauthenticated users from layout logic

## Data Fetching

### API Layer

Use a shared API client.

```ts
lib/api.ts
```

Rules:

* Centralize all requests
* Handle errors consistently
* Never hardcode API URLs
* Read URLs from environment variables

## State Management

Use the simplest solution possible:

* Server state → TanStack Query
* Auth state → Better Auth
* Local state → useState
* Shared UI state → Context

Avoid Redux, Zustand, Jotai, etc. unless clearly required.

## Forms

Preferred stack:

* react-hook-form
* zod

Validate all user input.

## Lists

* Use FlashList for large datasets
* Avoid FlatList for performance-critical screens

## Error Handling

* Show proper loading states
* Show proper error states
* Never swallow errors
* Let TanStack Query handle request state

## Environment Variables

Use:

```env
EXPO_PUBLIC_API_URL=
```

Never hardcode API endpoints.

## TypeScript

* Strict mode enabled
* Avoid `any`
* Prefer inferred types
* Handle `null` and `undefined` explicitly

## Performance

* Memoize expensive calculations
* Avoid unnecessary re-renders
* Avoid inline functions in large lists
* Use React.memo only when beneficial

## Accessibility

* Add accessibility labels
* Ensure readable contrast
* Support screen readers where applicable

## Important Rules

* Prefer composition over inheritance
* Keep components small and focused
* One responsibility per component
* Business logic belongs in hooks/services, not screens
* Shared logic belongs in features or hooks
* Shared UI belongs in components
* Do not duplicate API logic
* Do not duplicate query keys
* Do not duplicate auth logic

## Pitfalls

* Keep all gluestack packages on compatible versions
* Keep NativeWind configuration synchronized with Expo
* Do not mix Tailwind, StyleSheet, and inline styles unnecessarily
* Do not fetch data without TanStack Query
* Do not create multiple QueryClient instances
* Do not create multiple auth clients

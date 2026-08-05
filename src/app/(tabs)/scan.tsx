import { Redirect } from 'expo-router';

/**
 * Placeholder for the middle tab slot. `Tabs.Screen name="scan"` has to resolve to a
 * file, but the slot renders an inert spacer so this never mounts in normal use — the
 * raised `ScanFab` handles the navigation. The redirect only matters for a deep link
 * to `/scan`, which should still reach the scanner.
 */
export default function ScanTabPlaceholder() {
  return <Redirect href="/scanner" />;
}

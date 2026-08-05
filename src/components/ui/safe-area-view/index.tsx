'use client';
import {
  SafeAreaView as RNSafeAreaView,
  type SafeAreaViewProps,
} from 'react-native-safe-area-context';
import { useCssElement } from 'nativewind';

/**
 * NativeWind v5 wires `className` -> `style` through a Babel pass that only rewrites
 * imports from `react-native`, so a third-party SafeAreaView gets no interop and every
 * `className` on it is silently dropped. This mirrors how `react-native-css` wraps its
 * own primitives.
 */
const mapping = { className: 'style' } as const;

export function SafeAreaView(
  props: SafeAreaViewProps & { className?: string }
) {
  return useCssElement(RNSafeAreaView, props, mapping);
}

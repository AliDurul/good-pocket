import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const COUNT = 26;
/** Static hex only — Reanimated styles cannot take PlatformColor or CSS variables. */
const COLORS = ['#F2C879', '#C9943A', '#E7B45F'];

interface CoinSpec {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  spin: number;
  phase: number;
  color: string;
}

function Coin({ spec, fallHeight }: { spec: CoinSpec; fallHeight: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      spec.delay,
      withTiming(1, { duration: spec.duration, easing: Easing.linear }),
    );
  }, [progress, spec.delay, spec.duration]);

  const style = useAnimatedStyle(() => {
    const t = progress.value;

    return {
      transform: [
        { translateY: -80 + t * fallHeight },
        { translateX: Math.sin(t * Math.PI * 2 + spec.phase) * spec.drift },
        { rotateZ: `${t * spec.spin}deg` },
        // Foreshortening as the disc turns — this is what reads as a coin rather
        // than a dot. Floored so a coin never vanishes completely edge-on.
        { scaleX: 0.2 + 0.8 * Math.abs(Math.cos(t * Math.PI * 4 + spec.phase)) },
      ],
      opacity: t > 0.78 ? Math.max(0, (1 - t) / 0.22) : 1,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: spec.left,
          width: spec.size,
          height: spec.size,
          borderRadius: spec.size / 2,
          backgroundColor: spec.color,
        },
        style,
      ]}
    />
  );
}

/**
 * Gold coins raining down the celebration screen.
 *
 * Gold discs rather than multicolour confetti because the whole loyalty system is
 * built out of this palette, and the currency being won is points.
 *
 * Purely decorative: `pointerEvents="none"` so nothing here can swallow a tap on the
 * buttons underneath.
 */
export function CoinBurst() {
  const { width, height } = useWindowDimensions();

  // Seeded once, so a re-render (the points numeral ticks every frame) doesn't
  // reshuffle the coins mid-fall.
  const coins = useMemo<CoinSpec[]>(
    () =>
      Array.from({ length: COUNT }, (_, id) => ({
        id,
        left: Math.random() * (width - 18),
        size: 9 + Math.random() * 9,
        delay: Math.random() * 900,
        duration: 2100 + Math.random() * 1300,
        drift: 14 + Math.random() * 34,
        spin: 220 + Math.random() * 520,
        phase: Math.random() * Math.PI * 2,
        color: COLORS[id % COLORS.length],
      })),
    [width],
  );

  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]} pointerEvents="none">
      {coins.map((spec) => (
        <Coin key={spec.id} spec={spec} fallHeight={height + 160} />
      ))}
    </View>
  );
}

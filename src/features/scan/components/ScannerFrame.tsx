import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const FRAME = 240;
const ARM = 34;
const STROKE = 3;
const GOLD = '#F2C879';
const SCRIM = 'rgba(0, 0, 0, 0.55)';

const corners = [
  { top: 0, left: 0, borderTopWidth: STROKE, borderLeftWidth: STROKE, borderTopLeftRadius: 6 },
  { top: 0, right: 0, borderTopWidth: STROKE, borderRightWidth: STROKE, borderTopRightRadius: 6 },
  { bottom: 0, left: 0, borderBottomWidth: STROKE, borderLeftWidth: STROKE, borderBottomLeftRadius: 6 },
  { bottom: 0, right: 0, borderBottomWidth: STROKE, borderRightWidth: STROKE, borderBottomRightRadius: 6 },
] as const;

interface ScannerFrameProps {
  /** Pauses the sweep while a scan is being validated. */
  isActive: boolean;
}

/**
 * The targeting overlay: a clear square with gold corner markers, everything around it
 * dimmed.
 *
 * The dim is four panels laid out around the square rather than one translucent sheet
 * with a hole in it, because a React Native view cannot punch a hole through its own
 * background.
 */
export function ScannerFrame({ isActive }: ScannerFrameProps) {
  const sweep = useSharedValue(0);

  useEffect(() => {
    if (!isActive) {
      sweep.value = withTiming(0, { duration: 160 });
      return;
    }
    sweep.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [isActive, sweep]);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sweep.value * (FRAME - STROKE) }],
    opacity: 0.35 + sweep.value * 0.45,
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={{ flex: 1, backgroundColor: SCRIM }} />

      <View style={{ flexDirection: 'row', height: FRAME }}>
        <View style={{ flex: 1, backgroundColor: SCRIM }} />

        <View style={{ width: FRAME, height: FRAME }}>
          {corners.map((corner, index) => (
            <View
              key={index}
              style={{
                position: 'absolute',
                width: ARM,
                height: ARM,
                borderColor: GOLD,
                ...corner,
              }}
            />
          ))}

          <Animated.View
            style={[
              {
                position: 'absolute',
                left: STROKE,
                right: STROKE,
                height: 2,
                borderRadius: 1,
                experimental_backgroundImage:
                  'linear-gradient(90deg, transparent 0%, #F2C879 50%, transparent 100%)',
              },
              sweepStyle,
            ]}
          />
        </View>

        <View style={{ flex: 1, backgroundColor: SCRIM }} />
      </View>

      {/* Heavier than the top panel so the frame sits a little above centre. */}
      <View style={{ flex: 1.35, backgroundColor: SCRIM }} />
    </View>
  );
}

export const SCANNER_FRAME_SIZE = FRAME;

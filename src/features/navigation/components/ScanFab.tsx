import { QrCode } from 'lucide-react-native';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface ScanFabProps {
  onPress: () => void;
  /** Distance from the bottom of the screen, already including the safe-area inset. */
  bottom: number;
}

const SIZE = 62;

/**
 * The raised QR button in the middle of the tab bar.
 *
 * It is deliberately NOT a `tabBarButton`. On Android a child rendered outside its
 * parent's bounds does not receive touches, so a FAB that overhangs the tab bar from
 * inside it is tappable on iOS and dead on Android. Instead this renders as an
 * absolutely-positioned sibling of the whole navigator, and the middle tab slot is an
 * inert spacer that leaves it a gap to sit in.
 *
 * The gold gradient is the same one `TierLadder` gives the Gold tier, so the button
 * reads as belonging to the loyalty system rather than as generic chrome.
 */
export function ScanFab({ onPress, bottom }: ScanFabProps) {
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{ position: 'absolute', left: 0, right: 0, bottom, alignItems: 'center' }}
    >
      <Animated.View
        style={[
          pressStyle,
          {
            borderRadius: SIZE / 2,
            shadowColor: '#4A1C0A',
            shadowOpacity: 0.3,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Scan QR code"
          accessibilityHint="Opens the camera to scan your agent's delivery code"
          onPress={onPress}
          onPressIn={() => {
            scale.value = withSpring(0.92, { damping: 14, stiffness: 320 });
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { damping: 14, stiffness: 320 });
          }}
          style={{
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 4,
            borderColor: '#FAF7F2',
            // Literal hex: a CSS gradient string cannot resolve a CSS variable
            // through NativeWind.
            experimental_backgroundImage:
              'linear-gradient(150deg, #F2C879 0%, #C9943A 100%)',
          }}
        >
          {/* #3A1608, not white — ivory on this gold is 2.53:1. */}
          <QrCode size={26} color="#3A1608" strokeWidth={2.2} />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

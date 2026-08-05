import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { formatPoints, formatPointsDelta } from '../format';
import { useCountUp } from '../useCountUp';

interface PointsAwardProps {
  pointsEarned: number;
  newBalance: number;
  orderRef: string;
}

/**
 * The reward itself: the points won, ticking up from zero, on the same deep-brown
 * gradient the home screen's loyalty card uses — the numeral needs to be gold, and gold
 * on ivory would be too faint to carry a display size.
 */
export function PointsAward({ pointsEarned, newBalance, orderRef }: PointsAwardProps) {
  const counted = useCountUp(pointsEarned, { durationMs: 1200, delayMs: 200 });

  return (
    <Animated.View entering={ZoomIn.duration(420).springify().damping(13)}>
      <Box
        className="mx-5 items-center overflow-hidden rounded-3xl px-6 py-8"
        style={{
          experimental_backgroundImage:
            'linear-gradient(150deg, #4A1C0A 0%, #7A3416 100%)',
        }}
      >
        {/* Gold bloom, as on the home hero card. */}
        <Box
          pointerEvents="none"
          className="absolute -top-16 h-56 w-56 rounded-full"
          style={{
            experimental_backgroundImage:
              'radial-gradient(circle, rgba(242,200,121,0.42) 0%, transparent 70%)',
          }}
        />

        <Text className="font-poppins-medium text-[12px] uppercase tracking-[1.6px] text-secondary-foreground/70">
          Points earned
        </Text>

        <HStack className="mt-2.5 items-baseline gap-2">
          <Text className="font-playfair-black text-6xl text-brand-gold-light">
            {formatPointsDelta(counted)}
          </Text>
          <Text className="font-poppins-semibold text-xl text-brand-gold-light/80">pts</Text>
        </HStack>

        <Animated.View entering={FadeInUp.delay(1400).duration(420)}>
          <VStack className="mt-4 items-center gap-1.5">
            <Text className="font-poppins-medium text-[14px] text-secondary-foreground/78">
              New balance: {formatPoints(newBalance)} pts
            </Text>
          </VStack>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(1700).duration(420)}>
          <Box className="mt-4 rounded-full bg-secondary-foreground/12 px-3.5 py-1.5">
            <Text className="font-poppins-semibold text-[12px] text-secondary-foreground/85">
              {orderRef} confirmed ✓
            </Text>
          </Box>
        </Animated.View>
      </Box>
    </Animated.View>
  );
}

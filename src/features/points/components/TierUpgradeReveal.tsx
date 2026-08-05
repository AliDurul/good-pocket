import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { tierFor, titleCaseTier } from '@/features/loyalty/tiers';
import type { TierUpgrade } from '@/features/scan/types';
import { useEffect } from 'react';
import Animated, {
  Easing,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const BADGE = 96;

interface TierUpgradeRevealProps {
  upgrade: TierUpgrade;
  /** Milliseconds to hold before the section appears, so it lands after the points. */
  delay: number;
}

/**
 * The level-up. Only rendered when the scan actually moved the customer up a tier —
 * there is no "you stayed where you were" state, because that isn't news.
 *
 * The badge scales in on a spring and then a highlight sweeps across it, which is the
 * bit that makes it read as earned rather than merely displayed.
 */
export function TierUpgradeReveal({ upgrade, delay }: TierUpgradeRevealProps) {
  const tier = tierFor(upgrade.to);
  const shine = useSharedValue(0);

  useEffect(() => {
    shine.value = withDelay(
      delay + 320,
      withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        3,
        false,
      ),
    );
  }, [delay, shine]);

  const shineStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -BADGE + shine.value * (BADGE * 2) },
      { rotateZ: '18deg' },
    ],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(480).springify().damping(15)}>
      <VStack className="mx-5 mt-5 items-center gap-3 rounded-3xl border border-border bg-card px-5 py-6">
        <Box
          className="items-center justify-center overflow-hidden rounded-full"
          style={{
            width: BADGE,
            height: BADGE,
            experimental_backgroundImage: tier.gradient,
          }}
        >
          <Text
            className="font-playfair-black text-white"
            style={{ fontSize: 38, lineHeight: 44 }}
          >
            {tier.initial}
          </Text>

          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                top: -BADGE / 2,
                width: BADGE * 0.5,
                height: BADGE * 2,
                experimental_backgroundImage:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%)',
              },
              shineStyle,
            ]}
          />
        </Box>

        <Text className="text-center font-poppins-bold text-lg text-foreground">
          🎉 You reached {titleCaseTier(upgrade.to)} Tier!
        </Text>

        <Box className="rounded-full bg-primary px-3.5 py-1.5">
          <Text className="font-poppins-semibold text-[12.5px] text-primary-foreground">
            You now earn {upgrade.multiplier}× points on every order
          </Text>
        </Box>

        <VStack className="mt-1.5 w-full gap-2">
          {upgrade.benefits.map((benefit, index) => (
            <Animated.View
              key={benefit}
              entering={FadeInUp.delay(delay + 520 + index * 90).duration(360)}
            >
              <HStack className="items-center gap-2.5">
                <Box className="h-1.5 w-1.5 rounded-full bg-primary" />
                <Text className="flex-1 font-poppins text-[13px] text-muted-foreground">
                  {benefit}
                </Text>
              </HStack>
            </Animated.View>
          ))}
        </VStack>
      </VStack>
    </Animated.View>
  );
}

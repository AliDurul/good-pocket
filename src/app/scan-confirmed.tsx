import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { AuthButton } from '@/features/auth';
import { CoinBurst } from '@/features/points/components/CoinBurst';
import { PointsAward } from '@/features/points/components/PointsAward';
import { ReceiptSummary } from '@/features/points/components/ReceiptSummary';
import { TierUpgradeReveal } from '@/features/points/components/TierUpgradeReveal';
import useScanResultStore from '@/stores/scanResultStore';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

/**
 * When each section lands. The points have to finish counting before anything else
 * asks for attention, and the tier reveal — when there is one — gets its own beat
 * before the receipt and the buttons show up.
 */
const TIER_DELAY = 2100;
const RECEIPT_DELAY_WITH_TIER = 2900;
const RECEIPT_DELAY_WITHOUT_TIER = 2100;

export default function ScanConfirmedScreen() {
  const router = useRouter();
  const stored = useScanResultStore((state) => state.result);
  const clear = useScanResultStore((state) => state.clear);

  // Snapshot on first render so clearing the store on the way out can't blank the
  // screen mid-animation.
  const [result] = useState(stored);

  useEffect(() => clear, [clear]);

  const leaveCelebration = () => {
    if (router.canDismiss()) router.dismissAll();
  };

  // Nothing to celebrate — a cold deep link, or a reload that lost the handoff.
  if (!result) return <Redirect href="/" />;

  const receiptDelay = result.tierUpgrade ? RECEIPT_DELAY_WITH_TIER : RECEIPT_DELAY_WITHOUT_TIER;

  return (
    // The ivory lives on a Box, not on the Animated.View: NativeWind's interop only
    // rewrites components imported from `react-native`, so a `className` on a
    // Reanimated view is dropped without warning.
    <Box className="flex-1 bg-background">
      <Animated.View entering={FadeIn.duration(260)} style={{ flex: 1 }}>
        <SafeAreaView edges={['top', 'bottom']} className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 24, paddingBottom: 24, flexGrow: 1 }}
          >
            <PointsAward
              pointsEarned={result.pointsEarned}
              newBalance={result.newBalance}
              orderRef={result.orderRef}
            />

            {result.tierUpgrade ? (
              <TierUpgradeReveal upgrade={result.tierUpgrade} delay={TIER_DELAY} />
            ) : null}

            <ReceiptSummary receipt={result.receipt} delay={receiptDelay} />

            <Box className="flex-1" />

            <Animated.View entering={FadeInUp.delay(receiptDelay + 300).duration(420)}>
              <VStack className="mt-6 gap-1 px-5">
                <AuthButton
                  label="View my points"
                  onPress={() => {
                    leaveCelebration();
                    router.navigate('/points');
                  }}
                />

                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    leaveCelebration();
                    router.navigate('/');
                  }}
                  className="items-center py-3.5"
                >
                  <Text className="font-poppins-medium text-[13.5px] text-muted-foreground">
                    Back to Home
                  </Text>
                </Pressable>
              </VStack>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>

      {/* Above the content, but decorative — it must never eat a button press. */}
      <CoinBurst />
    </Box>
  );
}

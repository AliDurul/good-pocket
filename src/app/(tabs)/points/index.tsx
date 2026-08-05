import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { TierLadder } from '@/features/auth';
import { LoyaltyHeroCard } from '@/features/home/components/LoyaltyHeroCard';
import { formatPoints, formatPointsDelta } from '@/features/points/format';
import { usePointsSnapshot } from '@/features/points/stubs';
import { format } from 'date-fns';
import { ScrollView } from 'react-native';

export default function PointsScreen() {
  const { summary, history } = usePointsSnapshot();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background pt-3">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <VStack className="px-4 pb-4">
          <Text className="font-poppins-semibold text-xl text-foreground">Points & Loyalty</Text>
          <Text className="font-poppins text-[13px] text-muted-foreground">
            Earn points every time you confirm a delivery.
          </Text>
        </VStack>

        <LoyaltyHeroCard summary={summary} variant="points" />

        <VStack className="mx-4 mt-5 items-center gap-4 rounded-3xl border border-border bg-card px-5 py-6">
          <Text className="font-poppins-semibold text-[14px] text-foreground">Your tier ladder</Text>
          <TierLadder />
          <Text className="text-center font-poppins text-[12.5px] leading-[18px] text-muted-foreground">
            {summary.nextTier
              ? `${formatPoints(summary.pointsToNext)} pts to go before you reach ${summary.nextTier.charAt(0)}${summary.nextTier.slice(1).toLowerCase()}.`
              : "You're at the top tier — every order earns the maximum."}
          </Text>
        </VStack>

        <Text className="mx-4 mb-2.5 mt-6 font-poppins-semibold text-[14px] text-foreground">
          Recent activity
        </Text>

        <VStack className="mx-4 overflow-hidden rounded-2xl border border-border bg-card">
          {history.map((entry, index) => (
            <HStack
              key={entry.id}
              className={`items-center justify-between gap-3 px-4 py-3.5 ${
                index > 0 ? 'border-t border-border' : ''
              }`}
            >
              <VStack className="flex-1">
                <Text className="font-poppins-medium text-[13.5px] text-foreground">
                  {entry.label}
                </Text>
                <Text className="font-poppins text-[11.5px] text-muted-foreground">
                  {entry.orderRef} · {format(entry.earnedAt, 'd MMM')}
                </Text>
              </VStack>

              <Box className="rounded-full bg-primary/12 px-2.5 py-1">
                <Text className="font-poppins-semibold text-[12.5px] text-primary-strong">
                  {formatPointsDelta(entry.points)}
                </Text>
              </Box>
            </HStack>
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

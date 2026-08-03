import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import type { LoyaltySummary } from '../types';

interface LoyaltyHeroCardProps {
  summary: LoyaltySummary;
}

/** Share of the way to the next tier, clamped to 0–100 and floored at a
 *  visible sliver so a customer with 0 points still sees the track start. */
function progressPercent(points: number, pointsToNext: number): number {
  const total = points + pointsToNext;
  if (total <= 0) return 100;
  return Math.min(100, Math.max(2, Math.round((points / total) * 100)));
}

export function LoyaltyHeroCard({ summary }: LoyaltyHeroCardProps) {
  const { tier, points, nextTier, pointsToNext } = summary;
  const percent = progressPercent(points, pointsToNext);
  const goalLabel = nextTier
    ? `${pointsToNext} pts to ${nextTier.charAt(0)}${nextTier.slice(1).toLowerCase()}`
    : 'Top tier reached';

  return (
    <Box
      className="mx-4 overflow-hidden rounded-3xl px-5 py-[22px]"
      style={{
        experimental_backgroundImage:
          'linear-gradient(150deg, #4A1C0A 0%, #7A3416 100%)',
      }}
    >
      {/* Gold bloom bleeding off the top-right corner. */}
      <Box
        pointerEvents="none"
        className="absolute -right-[34px] -top-[34px] h-[150px] w-[150px] rounded-full"
        style={{
          experimental_backgroundImage:
            'radial-gradient(circle, rgba(201,148,58,0.4) 0%, transparent 70%)',
        }}
      />

      <HStack className="items-center justify-between">
        <Box className="rounded-full bg-primary px-[11px] py-[5px]">
          <Text className="font-body-bold text-[10px] tracking-[1px] text-primary-foreground">
            {tier}
          </Text>
        </Box>
        <Text className="font-body text-[11px] text-secondary-foreground/70">
          Loyalty balance
        </Text>
      </HStack>

      <HStack className="mt-4 items-end gap-2">
        <Text className="font-display-black text-[46px] leading-[46px] text-brand-gold-light">
          {points}
        </Text>
        <Text className="mb-2 font-body-medium text-[13px] text-secondary-foreground/80">
          points
        </Text>
      </HStack>

      <Box className="mt-[18px]">
        <HStack className="mb-[7px] justify-between">
          <Text className="font-body-medium text-[10.5px] text-secondary-foreground/[0.78]">
            {tier.charAt(0)}{tier.slice(1).toLowerCase()}
          </Text>
          <Text className="font-body-medium text-[10.5px] text-secondary-foreground/[0.78]">
            {goalLabel}
          </Text>
        </HStack>

        <Box className="h-2 overflow-hidden rounded-md bg-secondary-foreground/[0.16]">
          <Box
            className="h-full rounded-md"
            style={{
              width: `${percent}%`,
              experimental_backgroundImage:
                'linear-gradient(90deg, #C9943A 0%, #F2C879 100%)',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { progressPercent } from '../loyalty';
import type { LoyaltySummary } from '../types';

interface LoyaltyHeroCardProps {
  summary: LoyaltySummary;
  /**
   * How to frame the balance. `wallet` (the default, and what Home has always shown)
   * prefixes it with `K`; `points` suffixes it with `pts` instead, for surfaces that
   * are explicitly about the loyalty balance rather than money.
   */
  variant?: 'wallet' | 'points';
}

export function LoyaltyHeroCard({ summary, variant = 'wallet' }: LoyaltyHeroCardProps) {
  const { tier, walletBalance, nextTier, pointsToNext } = summary;
  const isPoints = variant === 'points';
  const percent = progressPercent(walletBalance, pointsToNext);
  const goalLabel = nextTier
    ? `${pointsToNext} pts to ${nextTier.charAt(0)}${nextTier.slice(1).toLowerCase()}`
    : 'Top tier reached';

  return (
    <Box
      className="mx-4 overflow-hidden rounded-3xl px-5 py-5.5"
      style={{
        experimental_backgroundImage:
          'linear-gradient(150deg, #4A1C0A 0%, #7A3416 100%)',
      }}
    >
      {/* Gold bloom bleeding off the top-right corner. */}
      <Box
        pointerEvents="none"
        className="absolute -right-8.5 -top-8.5 h-37.5 w-37.5 rounded-full"
        style={{
          experimental_backgroundImage:
            'radial-gradient(circle, rgba(201,148,58,0.4) 0%, transparent 70%)',
        }}
      />

      <HStack className="items-center justify-between">
        <Text className="font-poppins-medium  text-xl text-secondary-foreground/70">
          {isPoints ? 'Points Balance' : 'Total Balance'}
        </Text>
        <Box className="rounded-full bg-primary px-2.75 py-1.25">
          <Text className="font-poppins-bold text-xs tracking-[1px] text-primary-foreground">
            {tier}
          </Text>
        </Box>
      </HStack>

      <HStack className="mt-4 items-end gap-2">
        {isPoints ? null : (
          <Text className="font-playfair-black text-5xl leading-5 text-brand-gold-light">
            K
          </Text>
        )}
        <Text className="font-playfair-black text-5xl leading-5 text-brand-gold-light">
          {walletBalance.toLocaleString('en-ZM', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        {isPoints ? (
          <Text className="font-poppins-semibold text-xl leading-5 text-brand-gold-light/80">
            pts
          </Text>
        ) : null}
      </HStack>

      <Box className="mt-4.5">
        <HStack className="mb-1.75 justify-end">
          {/* <Text className="font-poppins-medium text-base text-secondary-foreground/78">
            {tier.charAt(0)}{tier.slice(1).toLowerCase()}
          </Text> */}
          <Text className="font-poppins-medium text-sm text-secondary-foreground/78">
            {goalLabel}
          </Text>
        </HStack>

        <Box className="h-2 overflow-hidden rounded-md bg-secondary-foreground/16">
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

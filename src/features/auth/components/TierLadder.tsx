import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { TIERS, TIER_ORDER, type TierName } from '@/features/loyalty/tiers';

/**
 * Ladder-only sizing. This is presentation of a progression, not a property of the
 * tiers themselves, so it stays here while colours and labels come from the shared
 * table in `@/features/loyalty/tiers`.
 */
const LADDER: Record<TierName, { size: number; type: number }> = {
  BRONZE: { size: 46, type: 16 },
  SILVER: { size: 58, type: 20 },
  GOLD: { size: 74, type: 26 },
};

const GOAL: TierName = 'GOLD';

/**
 * The loyalty-tier medallions on the last onboarding slide. Bottom-aligned so the
 * labels sit on one line and the discs step upward toward Gold.
 */
export function TierLadder() {
  return (
    <HStack className="items-end gap-4">
      {TIER_ORDER.map((name) => {
        const tier = TIERS[name];
        const { size, type } = LADDER[name];
        const isGoal = name === GOAL;

        return (
          <VStack key={name} className="items-center gap-[7px]">
            <Box
              className="items-center justify-center rounded-full"
              style={{
                width: size,
                height: size,
                experimental_backgroundImage: tier.gradient,
              }}
            >
              <Text
                className={isGoal ? 'font-playfair-black text-white' : 'font-playfair text-white'}
                style={{ fontSize: type, lineHeight: type * 1.15 }}
              >
                {tier.initial}
              </Text>
            </Box>
            <Text
              className={
                isGoal
                  ? 'font-poppins-bold text-[9px] text-secondary'
                  : 'font-poppins-semibold text-[9px] text-muted-foreground'
              }
            >
              {tier.label}
            </Text>
          </VStack>
        );
      })}
    </HStack>
  );
}

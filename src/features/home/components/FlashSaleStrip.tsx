import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { FlashSale } from '../types';
import { useCountdown } from '../useCountdown';

interface FlashSaleStripProps {
  sale: FlashSale;
  onPress?: () => void;
}

export function FlashSaleStrip({ sale, onPress }: FlashSaleStripProps) {
  const { label, hasExpired } = useCountdown(sale.endsAt);

  // A sale past its deadline is no longer an offer — drop the whole strip
  // rather than showing 00:00:00.
  if (hasExpired) return null;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" className="mx-4 mt-[14px]">
      <HStack className="items-center gap-[13px] rounded-[18px] border border-border bg-card px-[15px] py-[13px]">
        <Box
          className="h-[46px] w-[46px] items-center justify-center rounded-xl"
          style={{
            experimental_backgroundImage:
              'linear-gradient(135deg, #C9943A 0%, #E7B45F 100%)',
          }}
        >
          <Text className="font-playfair-black text-[20px] text-primary-foreground">
            {sale.badge}
          </Text>
        </Box>

        <VStack className="flex-1">
          <Text className="font-poppins-semibold text-[13px] text-foreground">
            {sale.title}
          </Text>
          <Text className="mt-0.5 font-poppins text-[11px] text-muted-foreground">
            {sale.subtitle}
          </Text>
        </VStack>

        <Box className="rounded-lg bg-success px-[9px] py-[5px]">
          <Text className="font-poppins-semibold text-[11px] text-success-foreground">
            {label}
          </Text>
        </Box>
      </HStack>
    </Pressable>
  );
}

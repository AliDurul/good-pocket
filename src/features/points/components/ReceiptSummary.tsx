import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { ScanConfirmation } from '@/features/scan/types';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { formatKwacha, formatPaymentMethod } from '../format';

interface ReceiptSummaryProps {
  receipt: ScanConfirmation['receipt'];
  delay: number;
}

/**
 * The order behind the points, collapsed by default so it never competes with the
 * reward. Every line comes off the QR payload, so opening it costs no request.
 */
export function ReceiptSummary({ receipt, delay }: ReceiptSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const chevron = useSharedValue(0);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${chevron.value * 180}deg` }],
  }));

  const toggle = () => {
    chevron.value = withTiming(isOpen ? 0 : 1, { duration: 200 });
    setIsOpen(!isOpen);
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(420)}
      layout={LinearTransition.duration(220)}
    >
      <VStack className="mx-5 mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isOpen ? 'Hide order receipt' : 'View order receipt'}
          onPress={toggle}
          className="px-4 py-3.5"
        >
          <HStack className="items-center justify-between">
            <Text className="font-poppins-semibold text-[13.5px] text-foreground">
              View order receipt
            </Text>
            <Animated.View style={chevronStyle}>
              <ChevronDown size={17} color="#7A5540" strokeWidth={2} />
            </Animated.View>
          </HStack>
        </Pressable>

        {isOpen ? (
          <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(140)}>
            <VStack className="gap-2.5 border-t border-border px-4 py-3.5">
              {receipt.items.map((item) => (
                <HStack key={item.name} className="items-center justify-between gap-3">
                  <Text className="flex-1 font-poppins text-[13px] text-muted-foreground">
                    {item.qty}× {item.name}
                  </Text>
                  <Text className="font-poppins-medium text-[13px] text-foreground">
                    {formatKwacha(item.qty * item.unitPrice)}
                  </Text>
                </HStack>
              ))}

              <Box className="mt-1 border-t border-border pt-3">
                <HStack className="items-center justify-between">
                  <Text className="font-poppins-semibold text-[13.5px] text-foreground">
                    Total paid
                  </Text>
                  <Text className="font-poppins-semibold text-[13.5px] text-foreground">
                    {formatKwacha(receipt.total)} · {formatPaymentMethod(receipt.paymentMethod)} ✓
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Animated.View>
        ) : null}
      </VStack>
    </Animated.View>
  );
}

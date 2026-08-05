import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useStubOrders } from '@/features/orders/stubs';
import { formatKwacha } from '@/features/points/format';
import { format } from 'date-fns';
import { ScrollView } from 'react-native';

export default function OrdersScreen() {
  const orders = useStubOrders();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background pt-3">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <VStack className="px-4 pb-4">
          <Text className="font-poppins-semibold text-xl text-foreground">Your orders</Text>
          <Text className="font-poppins text-[13px] text-muted-foreground">
            Scan your agent&apos;s QR code on delivery to confirm receipt and earn points.
          </Text>
        </VStack>

        <VStack className="mx-4 gap-3">
          {orders.map((order) => {
            const isConfirmed = order.status === 'CONFIRMED';

            return (
              <VStack
                key={order.id}
                className="gap-2.5 rounded-2xl border border-border bg-card px-4 py-4"
              >
                <HStack className="items-center justify-between gap-3">
                  <Text className="font-poppins-semibold text-[14.5px] text-foreground">
                    {order.ref}
                  </Text>

                  <Box
                    className={`rounded-full px-2.5 py-1 ${
                      isConfirmed ? 'bg-success/14' : 'bg-primary/14'
                    }`}
                  >
                    <Text
                      className={`font-poppins-semibold text-[11px] ${
                        isConfirmed ? 'text-success' : 'text-primary-strong'
                      }`}
                    >
                      {isConfirmed ? 'Confirmed ✓' : 'Awaiting confirmation'}
                    </Text>
                  </Box>
                </HStack>

                <Text className="font-poppins text-[12.5px] text-muted-foreground">
                  {order.summary}
                </Text>

                <HStack className="items-center justify-between border-t border-border pt-2.5">
                  <Text className="font-poppins text-[12px] text-muted-foreground">
                    {format(order.placedAt, 'd MMM yyyy')}
                  </Text>
                  <Text className="font-poppins-semibold text-[13px] text-foreground">
                    {formatKwacha(order.total)}
                  </Text>
                </HStack>
              </VStack>
            );
          })}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

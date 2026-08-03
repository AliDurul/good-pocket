import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { format } from 'date-fns';
import type { LastOrder } from '../types';
import { SectionHeader } from './SectionHeader';

interface OrderAgainCardProps {
  order: LastOrder;
  onReorder?: () => void;
}

export function OrderAgainCard({ order, onReorder }: OrderAgainCardProps) {
  return (
    <Box className="pb-5">
      <SectionHeader title="Order again" />

      <HStack className="mx-4 items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-3">
        {order.thumbnailUrl ? (
          <Image
            source={{ uri: order.thumbnailUrl }}
            alt=""
            size="none"
            className="h-[42px] w-[42px] rounded-[10px]"
            resizeMode="cover"
          />
        ) : (
          <Box className="h-[42px] w-[42px] rounded-[10px] bg-muted" />
        )}

        <VStack className="flex-1">
          <Text className="font-body-semibold text-[12.5px] text-foreground">
            Last order · {format(order.placedAt, 'd MMM')}
          </Text>
          <Text
            numberOfLines={1}
            className="mt-px font-body text-[10.5px] text-muted-foreground"
          >
            {order.summary}
          </Text>
        </VStack>

        <Pressable
          onPress={onReorder}
          accessibilityRole="button"
          accessibilityLabel="Reorder"
          className="rounded-full border-[1.5px] border-primary px-[13px] py-1.5"
        >
          <Text className="font-body-semibold text-[11px] text-secondary">Reorder</Text>
        </Pressable>
      </HStack>
    </Box>
  );
}

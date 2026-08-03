import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { GestureResponderEvent } from 'react-native';
import type { IProduct } from '@/types';
import { formatFromPrice, formatPoints, selectCheapestVariant } from '../variant';

interface ProductCardProps {
  product: IProduct;
  onPress?: () => void;
  onAdd?: () => void;
}

export function ProductCard({ product, onPress, onAdd }: ProductCardProps) {
  const variant = selectCheapestVariant(product);
  const imageUri = variant?.image ?? product.image;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={product.name}
      className="w-[122px] overflow-hidden rounded-2xl border border-border bg-card"
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          alt={product.name}
          size="none"
          className="h-[84px] w-full"
          resizeMode="cover"
        />
      ) : (
        <Box className="h-[84px] w-full items-center justify-center bg-muted">
          <Box className="rounded bg-background/80 px-[5px] py-0.5">
            <Text className="font-body text-[8px] text-muted-foreground">
              {variant?.weightLabel ?? product.name}
            </Text>
          </Box>
        </Box>
      )}

      <VStack className="px-2.5 pb-[11px] pt-[9px]">
        <Text
          numberOfLines={2}
          className="font-body-semibold text-[12px] leading-[14px] text-foreground"
        >
          {product.name}
        </Text>

        {variant ? (
          <Text className="mt-0.5 font-body text-[10px] text-muted-foreground">
            {formatFromPrice(variant.price)}
          </Text>
        ) : (
          <Text className="mt-0.5 font-body text-[10px] text-muted-foreground">
            Unavailable
          </Text>
        )}

        <HStack className="mt-[9px] items-center justify-between">
          <Text className="font-body-semibold text-[11px] text-primary">
            {variant ? formatPoints(variant.earnValue) : ''}
          </Text>

          {variant ? (
            <Pressable
              onPress={(e: GestureResponderEvent) => {
                e.stopPropagation();
                onAdd?.();
              }}
              accessibilityRole="button"
              accessibilityLabel={`Add ${product.name} to basket`}
              className="h-[26px] w-[26px] items-center justify-center rounded-lg bg-secondary"
            >
              <Text className="font-body-semibold text-[17px] leading-[17px] text-primary">
                +
              </Text>
            </Pressable>
          ) : null}
        </HStack>
      </VStack>
    </Pressable>
  );
}

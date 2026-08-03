import { useProducts } from '@/api/queries/products';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import type { IProduct } from '@/types';
import { ScrollView } from 'react-native';
import { ProductCard } from './ProductCard';
import { SectionHeader } from './SectionHeader';

interface FeaturedProductsProps {
  onPressProduct?: (product: IProduct) => void;
  onAddProduct?: (product: IProduct) => void;
  onSeeAll?: () => void;
}

function SkeletonRow() {
  return (
    <HStack className="gap-3 px-4">
      {[0, 1, 2].map((key) => (
        <Box
          key={key}
          className="h-[183px] w-[122px] rounded-2xl border border-border bg-muted"
        />
      ))}
    </HStack>
  );
}

export function FeaturedProducts({
  onPressProduct,
  onAddProduct,
  onSeeAll,
}: FeaturedProductsProps) {
  const { data, isLoading, isError } = useProducts({ limit: 6, isActive: true });
  const products = data?.data ?? [];

  // A products outage must not take the screen down with it.
  if (isError) return null;
  if (!isLoading && products.length === 0) return null;

  return (
    <Box>
      <SectionHeader title="Featured Products" actionLabel="See all →" onPressAction={onSeeAll} />

      {isLoading ? (
        <SkeletonRow />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          // Not contentContainerClassName — that prop only exists on
          // react-native-css's ScrollView wrapper, and this is RN's own, so a
          // className here would be silently dropped.
          contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingBottom: 4 }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => onPressProduct?.(product)}
              onAdd={() => onAddProduct?.(product)}
            />
          ))}
        </ScrollView>
      )}
    </Box>
  );
}

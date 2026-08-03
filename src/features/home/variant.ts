import type { IProduct, IProductVariant } from '@/types';

const isPurchasable = (v: IProductVariant): boolean => v.isActive && !v.isOutOfStock;

/**
 * The variant a product card quotes: cheapest one a customer could actually
 * buy right now. Returns null when the product has no purchasable variant, in
 * which case the caller should not render a price.
 */
export function selectCheapestVariant(product: IProduct): IProductVariant | null {
  const purchasable = product.variants?.filter(isPurchasable) ?? [];
  if (purchasable.length === 0) return null;

  return purchasable.reduce((cheapest, candidate) =>
    candidate.price < cheapest.price ? candidate : cheapest
  );
}

export function formatFromPrice(price: number): string {
  return `from K${Math.round(price)}`;
}

export function formatPoints(earnValue: number): string {
  return earnValue > 0 ? `+${earnValue} pts` : `${earnValue} pts`;
}

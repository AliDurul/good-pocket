// export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface LoyaltySummary {
  tier: string;
  walletBalance: number;
  /** null once the customer is at the top tier. */
  nextTier: string | null;
  /** Points still needed to reach `nextTier`; 0 at the top tier. */
  pointsToNext: number;
}

export interface FlashSale {
  id: string;
  /** e.g. "Flash Sale · 20% off maize" */
  title: string;
  /** e.g. "Ends Sunday" */
  subtitle: string;
  /** Glyph shown in the gold tile, e.g. "%" */
  badge: string;
  endsAt: Date;
}

export interface LastOrder {
  id: string;
  placedAt: Date;
  /** e.g. "2× Breakfast Meal, 1× Layers Feed" */
  summary: string;
  thumbnailUrl?: string;
}

/**
 * The subset of a TanStack Query result these screens actually read. Stub
 * hooks return this shape so swapping in a real useQuery is a drop-in change.
 */
export interface StubResult<T> {
  data: T | null;
  isLoading: boolean;
}

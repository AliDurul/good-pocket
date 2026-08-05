import type { FlashSale, LastOrder, LoyaltySummary, StubResult } from './types';

/**
 * Static stand-ins for endpoints the API does not expose yet (loyalty balance,
 * merchandised flash sale, order history). Each hook returns the same shape a
 * useQuery call would, so replacing a body with apiFetch touches this file
 * only — no component changes.
 *
 * Values mirror the demo content in design 1a. The customer's *name* is
 * deliberately absent: it comes from the Better Auth session, not from here.
 */

const LOYALTY: LoyaltySummary = {
  tier: 'BRONZE',
  walletBalance: 180,
  nextTier: 'SILVER',
  pointsToNext: 320,
};

const FLASH_SALE: FlashSale = {
  id: 'stub-flash-sale',
  title: 'Flash Sale · 20% off maize',
  subtitle: 'Ends Sunday',
  badge: '%',
  // Relative so the countdown always has time on the clock in development.
  endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000 + 14 * 60 * 1000 + 33 * 1000),
};

const LAST_ORDER: LastOrder = {
  id: 'stub-last-order',
  placedAt: new Date('2026-06-12T09:30:00Z'),
  summary: '2× Breakfast Meal, 1× Layers Feed',
};

export function useLoyalty(): StubResult<LoyaltySummary> {
  return { data: LOYALTY, isLoading: false };
}

export function useFlashSale(): StubResult<FlashSale> {
  return { data: FLASH_SALE, isLoading: false };
}

export function useLastOrder(): StubResult<LastOrder> {
  return { data: LAST_ORDER, isLoading: false };
}

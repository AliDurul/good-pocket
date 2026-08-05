import type { LoyaltySummary } from '@/features/home/types';
import { nextTierAfter, tierForBalance } from '@/features/loyalty/tiers';
import { stubRedemptions, stubWalletBalance } from '@/features/scan/stubs';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

/**
 * Stand-ins for the points endpoints, following `src/features/home/stubs.ts`.
 *
 * The balance and the recent entries are read back out of the scan stub rather than
 * being fixed here, so confirming a delivery visibly moves this screen — which is the
 * whole loop the QR flow exists to close.
 */

export interface PointsEntry {
  id: string;
  label: string;
  orderRef: string;
  earnedAt: Date;
  points: number;
}

/** History from before this session, so the list is never empty on a fresh install. */
const SEED_HISTORY: PointsEntry[] = [
  {
    id: 'stub-pts-3',
    label: 'Delivery confirmed',
    orderRef: 'ORD-0039',
    earnedAt: new Date('2026-07-28T11:20:00Z'),
    points: 12,
  },
  {
    id: 'stub-pts-2',
    label: 'Delivery confirmed',
    orderRef: 'ORD-0034',
    earnedAt: new Date('2026-07-14T08:05:00Z'),
    points: 8.5,
  },
  {
    id: 'stub-pts-1',
    label: 'Welcome bonus',
    orderRef: '—',
    earnedAt: new Date('2026-06-30T09:00:00Z'),
    points: 50,
  },
];

export interface PointsSnapshot {
  summary: LoyaltySummary;
  history: PointsEntry[];
}

/** Derives the tier and the distance to the next one from a raw balance. */
export function loyaltySummaryFor(balance: number): LoyaltySummary {
  const tier = tierForBalance(balance);
  const next = nextTierAfter(tier.name);

  return {
    tier: tier.name,
    walletBalance: balance,
    nextTier: next?.name ?? null,
    pointsToNext: next ? Math.max(0, next.threshold - balance) : 0,
  };
}

function readSnapshot(): PointsSnapshot {
  const scanned: PointsEntry[] = stubRedemptions().map((redemption) => ({
    id: `scan-${redemption.orderRef}`,
    label: 'Delivery confirmed',
    orderRef: redemption.orderRef,
    earnedAt: redemption.at,
    points: redemption.points,
  }));

  return {
    summary: loyaltySummaryFor(stubWalletBalance()),
    history: [...scanned, ...SEED_HISTORY],
  };
}

/**
 * Re-reads on focus. The stub's balance lives in a module variable rather than in
 * React state, so a tab that stays mounted would otherwise keep showing the number it
 * had when it first rendered.
 */
export function usePointsSnapshot(): PointsSnapshot {
  const [snapshot, setSnapshot] = useState<PointsSnapshot>(readSnapshot);

  useFocusEffect(
    useCallback(() => {
      setSnapshot(readSnapshot());
    }, []),
  );

  return snapshot;
}

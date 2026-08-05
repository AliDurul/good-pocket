import { nextTierAfter, tierForBalance } from '@/features/loyalty/tiers';
import { ScanError } from './errors';
import type { ScanConfirmation, ScanPayload } from './types';

/**
 * Stand-in for the delivery-confirmation endpoint, which the API does not expose yet.
 * `confirmScan` has the signature the real call will have, so replacing its body with
 * an `apiFetch` touches this file only — no hook and no screen changes. Follows the
 * same shape as `src/features/home/stubs.ts`.
 *
 * Manual-test triggers, since there is no backend to set state up in:
 *
 * | orderRef suffix | behaviour                                        |
 * |-----------------|--------------------------------------------------|
 * | `-DUP`          | always ALREADY_SCANNED                           |
 * | `-NET`          | always NETWORK                                   |
 * | `-TIER`         | awards enough points to cross the next tier       |
 * | anything else   | succeeds once, then ALREADY_SCANNED on a re-scan  |
 */

/** Matches the opening balance the home screen shows, so the two agree on screen. */
const OPENING_BALANCE = 180;

const LATENCY_MS = 900;

/**
 * Survives for the life of the JS context, which is what makes a genuine second scan
 * of the same code report ALREADY_SCANNED rather than silently paying out twice.
 */
const REDEEMED = new Set<string>();

export interface StubRedemption {
  orderRef: string;
  points: number;
  at: Date;
}

/** What has actually been scanned this session, newest last. */
const LEDGER: StubRedemption[] = [];

let balance = OPENING_BALANCE;

/** Current stub balance, so other stubbed surfaces can stay consistent with it. */
export function stubWalletBalance(): number {
  return balance;
}

/** Scans made this session, newest first — the Points tab lists these above its seed data. */
export function stubRedemptions(): StubRedemption[] {
  return [...LEDGER].reverse();
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function confirmScan(payload: ScanPayload): Promise<ScanConfirmation> {
  await delay(LATENCY_MS);

  if (payload.orderRef.endsWith('-NET')) throw new ScanError('NETWORK');
  if (payload.orderRef.endsWith('-DUP')) throw new ScanError('ALREADY_SCANNED');
  if (REDEEMED.has(payload.orderRef)) throw new ScanError('ALREADY_SCANNED');

  const previousTier = tierForBalance(balance);
  const upcoming = nextTierAfter(previousTier.name);

  // `-TIER` tops the award up to whatever it takes to cross the boundary, so the
  // upgrade reveal is reachable without hand-crafting a large balance.
  const pointsEarned =
    payload.orderRef.endsWith('-TIER') && upcoming
      ? Math.max(payload.pointsEarned, upcoming.threshold - balance)
      : payload.pointsEarned;

  REDEEMED.add(payload.orderRef);
  balance = Math.round((balance + pointsEarned) * 100) / 100;
  LEDGER.push({ orderRef: payload.orderRef, points: pointsEarned, at: new Date() });

  const newTier = tierForBalance(balance);

  return {
    orderRef: payload.orderRef,
    pointsEarned,
    newBalance: balance,
    tierUpgrade:
      newTier.name === previousTier.name
        ? null
        : {
          from: previousTier.name,
          to: newTier.name,
          multiplier: newTier.multiplier,
          benefits: newTier.benefits,
        },
    receipt: {
      items: payload.items,
      total: payload.total,
      paymentMethod: payload.paymentMethod,
    },
  };
}

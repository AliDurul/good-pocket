import { stubRedemptions } from '@/features/scan/stubs';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

/**
 * Stand-ins for the orders endpoint, following `src/features/home/stubs.ts`.
 *
 * An order flips to CONFIRMED once its code has actually been scanned this session, so
 * the list reflects what the customer just did rather than a fixed picture.
 */

export type OrderStatus = 'AWAITING_CONFIRMATION' | 'CONFIRMED';

export interface OrderSummary {
  id: string;
  ref: string;
  placedAt: Date;
  status: OrderStatus;
  total: number;
  summary: string;
}

const ORDERS: Omit<OrderSummary, 'status'>[] = [
  {
    id: 'stub-order-42',
    ref: 'ORD-0042',
    placedAt: new Date('2026-08-05T07:40:00Z'),
    total: 700,
    summary: '2× Breakfast Meal, 1× Layers Feed',
  },
  {
    id: 'stub-order-39',
    ref: 'ORD-0039',
    placedAt: new Date('2026-07-28T10:15:00Z'),
    total: 480,
    summary: '1× Roller Meal, 2× Samp',
  },
  {
    id: 'stub-order-34',
    ref: 'ORD-0034',
    placedAt: new Date('2026-07-14T07:50:00Z'),
    total: 340,
    summary: '1× Breakfast Meal',
  },
];

/** Orders confirmed before this session started. */
const PRE_CONFIRMED = new Set(['ORD-0039', 'ORD-0034']);

function readOrders(): OrderSummary[] {
  const scanned = new Set(stubRedemptions().map((redemption) => redemption.orderRef));

  return ORDERS.map((order) => ({
    ...order,
    status:
      scanned.has(order.ref) || PRE_CONFIRMED.has(order.ref)
        ? 'CONFIRMED'
        : 'AWAITING_CONFIRMATION',
  }));
}

/** Re-reads on focus, for the same reason `usePointsSnapshot` does. */
export function useStubOrders(): OrderSummary[] {
  const [orders, setOrders] = useState<OrderSummary[]>(readOrders);

  useFocusEffect(
    useCallback(() => {
      setOrders(readOrders());
    }, []),
  );

  return orders;
}

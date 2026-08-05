import { z } from 'zod';

/**
 * The JSON an agent's QR code encodes. It carries the whole receipt, so the
 * confirmation screen can render the order without a second round trip.
 *
 * `v` is a hard gate: a payload from a future format is treated as invalid rather
 * than parsed on a best-effort basis, so a customer never sees a half-populated
 * receipt for a real delivery.
 */
export const scanReceiptItemSchema = z.object({
    name: z.string().min(1),
    qty: z.number().int().positive(),
    unitPrice: z.number().nonnegative(),
});

export const scanPayloadSchema = z.object({
    v: z.literal(1),
    orderRef: z.string().min(1),
    customerId: z.string().min(1),
    issuedAt: z.string().refine(isParsableDate, 'issuedAt must be an ISO timestamp'),
    expiresAt: z.string().refine(isParsableDate, 'expiresAt must be an ISO timestamp'),
    pointsEarned: z.number().nonnegative(),
    total: z.number().nonnegative(),
    paymentMethod: z.enum(['cash', 'mobile-money', 'card']),
    items: z.array(scanReceiptItemSchema).min(1),
});

function isParsableDate(value: string): boolean {
    return !Number.isNaN(Date.parse(value));
}

export type ScanPayloadInput = z.infer<typeof scanPayloadSchema>;

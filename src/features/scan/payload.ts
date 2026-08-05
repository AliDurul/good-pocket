import { scanPayloadSchema } from '@/zod/scan';
import type { ParseScanResult } from './types';

/**
 * Turns the raw string a QR code carries into a validated payload, or into the
 * specific reason it can't be used. Never throws — the camera fires this on every
 * frame that decodes, so a bad code has to be a value, not an exception.
 *
 * Everything checkable on-device is checked here, which is why an expired or
 * wrong-account code reports instantly instead of after a round trip.
 *
 * `now` is a parameter rather than read from the clock so the expiry boundary is
 * directly testable.
 */
export function parseScanPayload(
  raw: string,
  now: Date,
  currentUserId: string,
): ParseScanResult {
  let decoded: unknown;
  try {
    decoded = JSON.parse(raw);
    console.log('decoded', decoded);
  } catch {
    return { ok: false, code: 'INVALID' };
  }

  const parsed = scanPayloadSchema.safeParse(decoded);
  if (!parsed.success) return { ok: false, code: 'INVALID' };

  const payload = parsed.data;

  // Ownership is checked before expiry: telling someone their neighbour's code has
  // expired sends them back to the agent for a new one that still won't work.
  if (payload.customerId !== currentUserId) {
    return { ok: false, code: 'WRONG_ACCOUNT' };
  }

  if (Date.parse(payload.expiresAt) <= now.getTime()) {
    return { ok: false, code: 'EXPIRED' };
  }

  return { ok: true, payload };
}

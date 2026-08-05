import type { ScanPayloadInput } from '@/zod/scan';

/** Every way a scan can fail. There is no "other" — see `errors.ts`. */
export type ScanErrorCode =
  | 'INVALID'
  | 'EXPIRED'
  | 'ALREADY_SCANNED'
  | 'WRONG_ACCOUNT'
  | 'NETWORK';

/** The subset resolvable on-device, without asking the server. */
export type LocalScanErrorCode = Extract<
  ScanErrorCode,
  'INVALID' | 'EXPIRED' | 'WRONG_ACCOUNT'
>;

export type ScanPayload = ScanPayloadInput;
export type ScanReceiptItem = ScanPayload['items'][number];
export type PaymentMethod = ScanPayload['paymentMethod'];

export type ParseScanResult =
  | { ok: true; payload: ScanPayload }
  | { ok: false; code: LocalScanErrorCode };

export interface TierUpgrade {
  /** Uppercase, as the API emits tiers. Rendered Title Case. */
  from: string;
  to: string;
  /** Points multiplier the new tier earns, e.g. 1.5. */
  multiplier: number;
  benefits: string[];
}

export interface ScanConfirmation {
  orderRef: string;
  pointsEarned: number;
  newBalance: number;
  /** Null unless this scan crossed a tier boundary. */
  tierUpgrade: TierUpgrade | null;
  receipt: {
    items: ScanReceiptItem[];
    total: number;
    paymentMethod: PaymentMethod;
  };
}

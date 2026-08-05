import type { ScanErrorCode } from './types';

export interface ScanErrorCopy {
  title: string;
  body: string;
  /**
   * Whether the customer can fix this by scanning again. Recoverable errors leave
   * the camera live; the rest stop the flow and offer a way out.
   */
  recoverable: boolean;
}

/**
 * Every failure the scanner can surface, spelled out.
 *
 * Typing this as `Record<ScanErrorCode, ...>` is the mechanism, not decoration: adding
 * a member to `ScanErrorCode` without adding copy here is a compile error, so no code
 * can ever fall through to a generic "Something went wrong".
 */
const COPY: Record<ScanErrorCode, ScanErrorCopy> = {
  INVALID: {
    title: 'Invalid QR code',
    body: "That code isn't a Good Taste delivery code. Ask your agent to show the code from their order screen.",
    recoverable: true,
  },
  EXPIRED: {
    title: 'QR code has expired',
    body: 'Ask your agent to generate a new code.',
    recoverable: false,
  },
  ALREADY_SCANNED: {
    title: 'This QR code has already been scanned',
    body: 'This delivery was already confirmed, so no further points are owed for it.',
    recoverable: false,
  },
  WRONG_ACCOUNT: {
    title: "This QR code doesn't belong to your account",
    body: "It was issued for another customer's order. Ask your agent to open your order and show its code.",
    recoverable: false,
  },
  NETWORK: {
    title: "Couldn't reach the server",
    body: 'Check your connection and try again.',
    recoverable: true,
  },
};

export function describeScanError(code: ScanErrorCode): ScanErrorCopy {
  return COPY[code];
}

/** Thrown by the confirmation call so the screen can branch on a code, not a string. */
export class ScanError extends Error {
  code: ScanErrorCode;

  constructor(code: ScanErrorCode) {
    super(describeScanError(code).title);
    this.name = 'ScanError';
    this.code = code;
  }
}

/**
 * Narrows anything thrown during confirmation to a code.
 *
 * An unrecognised throw resolves to NETWORK rather than to a generic message: an
 * unexpected failure mid-request is overwhelmingly a connectivity problem, and NETWORK
 * is both accurate enough to act on and recoverable, so the customer can simply retry.
 */
export function scanErrorCode(error: unknown): ScanErrorCode {
  if (error instanceof ScanError) return error.code;
  return 'NETWORK';
}

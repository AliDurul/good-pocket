/**
 * Whole seconds left until `endsAt`, never negative.
 *
 * Rounds *up* so a freshly started 60s timer reads "60s" rather than "59s":
 * the deadline is set from `Date.now()` and the first render lands a few
 * milliseconds later, which would otherwise truncate straight to 59.
 */
export function secondsRemaining(endsAt: Date, now: Date): number {
  return Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / 1000));
}

/** The `(54s)` suffix beside the resend link. Empty once the timer is spent. */
export function formatResendDelay(seconds: number): string {
  return seconds > 0 ? `(${seconds}s)` : '';
}

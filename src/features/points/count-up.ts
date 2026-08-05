/**
 * Time math for the points numeral ticking up from zero.
 *
 * Kept apart from the hook so the curve — which is the part that can be subtly wrong —
 * is a pure function of elapsed time, and so `elapsedMs` can be handed in directly by a
 * test instead of a clock being mocked.
 */

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Fast out of the gate, easing into the final value. */
export function easeOutCubic(progress: number): number {
  const t = clamp(progress, 0, 1);
  return 1 - (1 - t) ** 3;
}

/**
 * The value to display `elapsedMs` into a count-up toward `target`.
 *
 * Lands on `target` exactly rather than approaching it, so the number the customer is
 * left looking at is the real one.
 */
export function countUpValue(target: number, elapsedMs: number, durationMs: number): number {
  if (durationMs <= 0) return target;
  if (elapsedMs >= durationMs) return target;
  return target * easeOutCubic(elapsedMs / durationMs);
}

/** Whether the animation has finished, so the caller can stop its frame loop. */
export function isCountUpComplete(elapsedMs: number, durationMs: number): boolean {
  return elapsedMs >= durationMs;
}

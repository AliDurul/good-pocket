/**
 * Share of the way to the next tier, clamped to 0–100 and floored at a
 * visible sliver so a customer with 0 points still sees the track start.
 *
 * Caveat: this measures lifetime `points` against the *absolute* threshold
 * for the next tier (`points + pointsToNext`), not progress within the
 * current tier. A customer already deep into their current tier (e.g. a
 * SILVER member at 700 points with 300 to go for GOLD) will read as far
 * more "full" than they actually are within that tier. Doing this correctly
 * needs the current tier's floor, which no API or type currently exposes —
 * this will need a tier floor once a real loyalty endpoint lands.
 */
export function progressPercent(points: number, pointsToNext: number): number {
  const total = points + pointsToNext;
  if (total <= 0) return 100;
  return Math.min(100, Math.max(2, Math.round((points / total) * 100)));
}

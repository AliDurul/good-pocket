const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;

/** Milliseconds left until `endsAt`, never negative. */
export function computeRemaining(endsAt: Date, now: Date): number {
  return Math.max(0, endsAt.getTime() - now.getTime());
}

const pad = (value: number): string => String(value).padStart(2, '0');

/**
 * Renders a duration as HH:MM:SS. Hours are not capped at 24 — a three-day
 * sale reads "72:00:00" rather than silently wrapping.
 */
export function formatRemaining(ms: number): string {
  const safe = Math.max(0, ms);
  const hours = Math.floor(safe / MS_PER_HOUR);
  const minutes = Math.floor((safe % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((safe % MS_PER_MINUTE) / MS_PER_SECOND);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

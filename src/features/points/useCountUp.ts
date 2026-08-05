import { useEffect, useState } from 'react';
import { countUpValue, isCountUpComplete } from './count-up';

interface UseCountUpOptions {
  durationMs?: number;
  delayMs?: number;
}

/**
 * Ticks a number up from zero to `target`.
 *
 * Deliberately a JS `requestAnimationFrame` loop over `useState` rather than a
 * Reanimated shared value: animating text content on the UI thread needs the
 * `animatedProps`-on-`TextInput` trick, which is fragile on the New Architecture. One
 * `Text` re-rendering for a second is cheap, and the coins falling behind it run on the
 * UI thread, so they are unaffected by this.
 */
export function useCountUp(
  target: number,
  { durationMs = 1200, delayMs = 0 }: UseCountUpOptions = {},
): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(0);

    let frame: number;
    let start: number | null = null;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start - delayMs;

      setValue(countUpValue(target, elapsed, durationMs));

      if (!isCountUpComplete(elapsed, durationMs)) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, delayMs]);

  return value;
}

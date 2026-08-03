import { useEffect, useState } from 'react';
import { computeRemaining, formatRemaining } from './countdown';

/**
 * Ticks once a second toward `endsAt`. The interval is cleared on unmount and
 * whenever `endsAt` changes, and stops running once the deadline passes so an
 * expired sale does not keep a timer alive.
 */
export function useCountdown(endsAt: Date): { label: string; hasExpired: boolean } {
  const [remaining, setRemaining] = useState(() => computeRemaining(endsAt, new Date()));

  useEffect(() => {
    setRemaining(computeRemaining(endsAt, new Date()));

    const id = setInterval(() => {
      const next = computeRemaining(endsAt, new Date());
      setRemaining(next);
      if (next === 0) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [endsAt]);

  return { label: formatRemaining(remaining), hasExpired: remaining === 0 };
}

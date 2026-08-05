import { useCallback, useEffect, useState } from 'react';
import { secondsRemaining } from './resend';

interface ResendTimer {
  /** Whole seconds left; 0 once resending is allowed again. */
  seconds: number;
  canResend: boolean;
  /** Restarts the cooldown — call after actually firing a resend. */
  restart: () => void;
}

/**
 * Cooldown for the OTP resend link. Measures against a wall-clock deadline
 * rather than counting ticks, so the remaining time stays correct across a
 * backgrounded app where `setInterval` is throttled or paused.
 */
export function useResendTimer(durationSeconds: number): ResendTimer {
  const [endsAt, setEndsAt] = useState(() => new Date(Date.now() + durationSeconds * 1000));
  const [seconds, setSeconds] = useState(() => secondsRemaining(endsAt, new Date()));

  useEffect(() => {
    setSeconds(secondsRemaining(endsAt, new Date()));

    const id = setInterval(() => {
      const next = secondsRemaining(endsAt, new Date());
      setSeconds(next);
      if (next === 0) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [endsAt]);

  const restart = useCallback(() => {
    setEndsAt(new Date(Date.now() + durationSeconds * 1000));
  }, [durationSeconds]);

  return { seconds, canResend: seconds === 0, restart };
}

import { formatResendDelay, secondsRemaining } from './resend';

describe('secondsRemaining', () => {
  it('returns the whole-second gap when the end is in the future', () => {
    const now = new Date('2026-08-05T10:00:00Z');
    const endsAt = new Date('2026-08-05T10:00:54Z');
    expect(secondsRemaining(endsAt, now)).toBe(54);
  });

  it('rounds up so a just-started timer reads its full duration', () => {
    const now = new Date('2026-08-05T10:00:00.010Z');
    const endsAt = new Date('2026-08-05T10:01:00.000Z');
    expect(secondsRemaining(endsAt, now)).toBe(60);
  });

  it('clamps to zero when the end has passed', () => {
    const now = new Date('2026-08-05T10:01:00Z');
    const endsAt = new Date('2026-08-05T10:00:00Z');
    expect(secondsRemaining(endsAt, now)).toBe(0);
  });

  it('returns zero at the exact end instant', () => {
    const at = new Date('2026-08-05T10:00:00Z');
    expect(secondsRemaining(at, at)).toBe(0);
  });
});

describe('formatResendDelay', () => {
  it('wraps a live countdown in parentheses', () => {
    expect(formatResendDelay(54)).toBe('(54s)');
  });

  it('renders nothing once the cooldown is spent', () => {
    expect(formatResendDelay(0)).toBe('');
  });

  it('renders nothing for a negative value rather than "(-1s)"', () => {
    expect(formatResendDelay(-1)).toBe('');
  });
});

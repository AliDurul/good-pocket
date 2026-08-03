/// <reference types="@jest/globals" />
import { computeRemaining, formatRemaining } from './countdown';

describe('computeRemaining', () => {
  it('returns the millisecond gap when the end is in the future', () => {
    const now = new Date('2026-08-03T10:00:00Z');
    const endsAt = new Date('2026-08-03T12:14:33Z');
    expect(computeRemaining(endsAt, now)).toBe(8073000);
  });

  it('clamps to zero when the end has passed', () => {
    const now = new Date('2026-08-03T12:00:00Z');
    const endsAt = new Date('2026-08-03T10:00:00Z');
    expect(computeRemaining(endsAt, now)).toBe(0);
  });

  it('returns zero at the exact end instant', () => {
    const at = new Date('2026-08-03T10:00:00Z');
    expect(computeRemaining(at, at)).toBe(0);
  });
});

describe('formatRemaining', () => {
  it('formats hours, minutes and seconds zero-padded', () => {
    expect(formatRemaining(8073000)).toBe('02:14:33');
  });

  it('formats zero', () => {
    expect(formatRemaining(0)).toBe('00:00:00');
  });

  it('does not roll hours over at 24', () => {
    expect(formatRemaining(90000000)).toBe('25:00:00');
  });

  it('truncates sub-second remainders rather than rounding up', () => {
    expect(formatRemaining(1999)).toBe('00:00:01');
  });

  it('treats negative input as zero', () => {
    expect(formatRemaining(-5000)).toBe('00:00:00');
  });
});

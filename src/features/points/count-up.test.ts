import { countUpValue, easeOutCubic, isCountUpComplete } from './count-up';

describe('easeOutCubic', () => {
  it('runs from 0 to 1 across the interval', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });

  it('is past halfway by the time a third of the duration has passed', () => {
    expect(easeOutCubic(1 / 3)).toBeGreaterThan(0.5);
  });

  it('clamps rather than overshooting outside the interval', () => {
    expect(easeOutCubic(-1)).toBe(0);
    expect(easeOutCubic(4)).toBe(1);
  });
});

describe('countUpValue', () => {
  it('starts at zero', () => {
    expect(countUpValue(7.5, 0, 1200)).toBe(0);
  });

  it('lands on the target exactly, not near it', () => {
    expect(countUpValue(7.5, 1200, 1200)).toBe(7.5);
  });

  it('stays at the target once the duration is spent', () => {
    expect(countUpValue(7.5, 9000, 1200)).toBe(7.5);
  });

  it('never overshoots the target mid-flight', () => {
    for (let elapsed = 0; elapsed <= 1200; elapsed += 50) {
      expect(countUpValue(7.5, elapsed, 1200)).toBeLessThanOrEqual(7.5);
    }
  });

  it('only ever increases', () => {
    let previous = -1;
    for (let elapsed = 0; elapsed <= 1200; elapsed += 40) {
      const value = countUpValue(2457.5, elapsed, 1200);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it('shows the target immediately for a zero or negative duration rather than dividing by zero', () => {
    expect(countUpValue(7.5, 0, 0)).toBe(7.5);
    expect(countUpValue(7.5, 0, -100)).toBe(7.5);
  });

  it('treats a negative elapsed time as not started', () => {
    expect(countUpValue(7.5, -50, 1200)).toBe(0);
  });

  it('counts up to zero without producing NaN when nothing was earned', () => {
    expect(countUpValue(0, 600, 1200)).toBe(0);
  });
});

describe('isCountUpComplete', () => {
  it('is false before the duration and true at or after it', () => {
    expect(isCountUpComplete(1199, 1200)).toBe(false);
    expect(isCountUpComplete(1200, 1200)).toBe(true);
    expect(isCountUpComplete(1500, 1200)).toBe(true);
  });
});

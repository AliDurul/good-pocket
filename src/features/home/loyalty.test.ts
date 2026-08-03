import { progressPercent } from './loyalty';

describe('progressPercent', () => {
  it('computes a normal mid-tier share', () => {
    expect(progressPercent(150, 350)).toBe(30);
  });

  it('floors at 2% for zero points rather than returning 0', () => {
    expect(progressPercent(0, 500)).toBe(2);
  });

  it('returns 100 for the top tier, where pointsToNext is 0', () => {
    expect(progressPercent(2500, 0)).toBe(100);
  });

  it('guards divide-by-zero when total is 0 or negative', () => {
    expect(progressPercent(0, 0)).toBe(100);
  });

  it('clamps values that would exceed 100', () => {
    expect(progressPercent(600, -100)).toBe(100);
  });
});

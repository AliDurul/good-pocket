import { maskEmail } from './mask';

describe('maskEmail', () => {
  it('keeps the first character and the whole domain', () => {
    expect(maskEmail('sarah@gmail.com')).toBe('s•••@gmail.com');
  });

  it('masks a single-character local part without revealing more than it has', () => {
    expect(maskEmail('a@example.com')).toBe('a•••@example.com');
  });

  it('falls back for a value with no @', () => {
    expect(maskEmail('sarah')).toBe('your email address');
  });

  it('falls back for an empty value', () => {
    expect(maskEmail('')).toBe('your email address');
  });

  it('falls back when @ is leading or trailing', () => {
    expect(maskEmail('@gmail.com')).toBe('your email address');
    expect(maskEmail('sarah@')).toBe('your email address');
  });
});

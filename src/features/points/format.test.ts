import {
  formatKwacha,
  formatPaymentMethod,
  formatPoints,
  formatPointsDelta,
} from './format';

describe('formatPoints', () => {
  it('always shows two decimals', () => {
    expect(formatPoints(7.5)).toBe('7.50');
    expect(formatPoints(180)).toBe('180.00');
  });

  it('groups thousands', () => {
    expect(formatPoints(2457.5)).toBe('2,457.50');
  });

  it('renders zero rather than an empty string', () => {
    expect(formatPoints(0)).toBe('0.00');
  });
});

describe('formatPointsDelta', () => {
  it('signs an award', () => {
    expect(formatPointsDelta(7.5)).toBe('+7.50');
  });

  it('signs a deduction without doubling the minus', () => {
    expect(formatPointsDelta(-7.5)).toBe('-7.50');
  });

  it('treats zero as a non-negative award', () => {
    expect(formatPointsDelta(0)).toBe('+0.00');
  });
});

describe('formatKwacha', () => {
  it('drops the decimals on a whole amount, as a receipt would', () => {
    expect(formatKwacha(700)).toBe('K700');
  });

  it('keeps both decimals when there are ngwee', () => {
    expect(formatKwacha(699.5)).toBe('K699.50');
  });

  it('groups thousands', () => {
    expect(formatKwacha(12500)).toBe('K12,500');
  });
});

describe('formatPaymentMethod', () => {
  it('title-cases a single word', () => {
    expect(formatPaymentMethod('cash')).toBe('Cash');
  });

  it('turns a hyphenated method into words', () => {
    expect(formatPaymentMethod('mobile-money')).toBe('Mobile money');
  });
});

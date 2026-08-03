import type { IProduct, IProductVariant } from '@/types';
import { formatFromPrice, formatPoints, selectCheapestVariant } from './variant';

const variant = (over: Partial<IProductVariant>): IProductVariant => ({
  id: 'v1',
  productId: 'p1',
  weightKg: 25,
  weightLabel: '25kg',
  price: 185,
  earnValue: 18,
  stockQty: 10,
  lowStockThreshold: 2,
  isOutOfStock: false,
  lastRestockedAt: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...over,
});

const product = (variants?: IProductVariant[]): IProduct => ({
  id: 'p1',
  name: 'Breakfast Meal',
  isActive: true,
  categoryId: 'c1',
  createdAt: new Date(),
  updatedAt: new Date(),
  variants,
});

describe('selectCheapestVariant', () => {
  it('returns the lowest-priced qualifying variant', () => {
    const cheap = variant({ id: 'cheap', price: 150 });
    const dear = variant({ id: 'dear', price: 320 });
    expect(selectCheapestVariant(product([dear, cheap]))?.id).toBe('cheap');
  });

  it('ignores inactive variants even when cheaper', () => {
    const cheapInactive = variant({ id: 'off', price: 10, isActive: false });
    const active = variant({ id: 'on', price: 185 });
    expect(selectCheapestVariant(product([cheapInactive, active]))?.id).toBe('on');
  });

  it('ignores out-of-stock variants even when cheaper', () => {
    const gone = variant({ id: 'gone', price: 10, isOutOfStock: true });
    const here = variant({ id: 'here', price: 185 });
    expect(selectCheapestVariant(product([gone, here]))?.id).toBe('here');
  });

  it('returns null when variants is undefined', () => {
    expect(selectCheapestVariant(product(undefined))).toBeNull();
  });

  it('returns null when variants is empty', () => {
    expect(selectCheapestVariant(product([]))).toBeNull();
  });

  it('returns null when no variant qualifies', () => {
    expect(selectCheapestVariant(product([variant({ isActive: false })]))).toBeNull();
  });

  it('resolves a price tie to the first qualifying variant', () => {
    const first = variant({ id: 'first', price: 185 });
    const second = variant({ id: 'second', price: 185 });
    expect(selectCheapestVariant(product([first, second]))?.id).toBe('first');
  });
});

describe('formatFromPrice', () => {
  it('prefixes with "from" and the kwacha symbol', () => {
    expect(formatFromPrice(185)).toBe('from K185');
  });

  it('drops trailing decimals on whole amounts', () => {
    expect(formatFromPrice(150.0)).toBe('from K150');
  });

  it('rounds fractional prices to whole kwacha', () => {
    expect(formatFromPrice(184.6)).toBe('from K185');
  });
});

describe('formatPoints', () => {
  it('renders a signed points badge', () => {
    expect(formatPoints(18)).toBe('+18 pts');
  });

  it('renders zero without a sign', () => {
    expect(formatPoints(0)).toBe('0 pts');
  });
});

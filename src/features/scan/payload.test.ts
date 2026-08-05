import { parseScanPayload } from './payload';
import type { ScanPayload } from './types';

const NOW = new Date('2026-08-05T10:00:00.000Z');
const CUSTOMER = 'usr_sarah';

function validPayload(overrides: Partial<ScanPayload> = {}): ScanPayload {
  return {
    v: 1,
    orderRef: 'ORD-0042',
    customerId: CUSTOMER,
    issuedAt: '2026-08-05T09:55:00.000Z',
    expiresAt: '2026-08-05T10:05:00.000Z',
    pointsEarned: 7.5,
    total: 700,
    paymentMethod: 'cash',
    items: [{ name: 'Breakfast Meal', qty: 2, unitPrice: 250 }],
    ...overrides,
  };
}

function scan(payload: unknown, now = NOW, userId = CUSTOMER) {
  return parseScanPayload(JSON.stringify(payload), now, userId);
}

describe('parseScanPayload', () => {
  it('accepts a well-formed, unexpired code issued to this customer', () => {
    const result = scan(validPayload());
    expect(result).toEqual({ ok: true, payload: validPayload() });
  });

  it('rejects a string that is not JSON rather than throwing', () => {
    expect(parseScanPayload('https://example.com', NOW, CUSTOMER)).toEqual({
      ok: false,
      code: 'INVALID',
    });
  });

  it('rejects an empty scan', () => {
    expect(parseScanPayload('', NOW, CUSTOMER)).toEqual({ ok: false, code: 'INVALID' });
  });

  it('rejects JSON that is not a delivery payload', () => {
    expect(scan({ hello: 'world' })).toEqual({ ok: false, code: 'INVALID' });
  });

  it('rejects a payload from a newer format version instead of parsing it partially', () => {
    expect(scan(validPayload({ v: 2 as unknown as 1 }))).toEqual({
      ok: false,
      code: 'INVALID',
    });
  });

  it('rejects a payload with no line items, which could not render a receipt', () => {
    expect(scan(validPayload({ items: [] }))).toEqual({ ok: false, code: 'INVALID' });
  });

  it('rejects an unparsable expiry timestamp', () => {
    expect(scan(validPayload({ expiresAt: 'next tuesday' }))).toEqual({
      ok: false,
      code: 'INVALID',
    });
  });

  it("reports another customer's code as wrong-account", () => {
    expect(scan(validPayload({ customerId: 'usr_someone_else' }))).toEqual({
      ok: false,
      code: 'WRONG_ACCOUNT',
    });
  });

  it('reports a lapsed code as expired', () => {
    expect(scan(validPayload({ expiresAt: '2026-08-05T09:59:59.000Z' }))).toEqual({
      ok: false,
      code: 'EXPIRED',
    });
  });

  it('treats the exact expiry instant as expired', () => {
    expect(scan(validPayload({ expiresAt: NOW.toISOString() }))).toEqual({
      ok: false,
      code: 'EXPIRED',
    });
  });

  it("prefers wrong-account over expired, so the customer isn't sent back for a code that still would not work", () => {
    const result = scan(
      validPayload({ customerId: 'usr_someone_else', expiresAt: '2026-08-05T09:00:00.000Z' }),
    );
    expect(result).toEqual({ ok: false, code: 'WRONG_ACCOUNT' });
  });
});

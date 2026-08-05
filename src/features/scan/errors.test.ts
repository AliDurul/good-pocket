import { ScanError, describeScanError, scanErrorCode } from './errors';
import type { ScanErrorCode } from './types';

const ALL_CODES: ScanErrorCode[] = [
  'INVALID',
  'EXPIRED',
  'ALREADY_SCANNED',
  'WRONG_ACCOUNT',
  'NETWORK',
];

describe('describeScanError', () => {
  it.each(ALL_CODES)('gives %s a non-empty title and body', (code) => {
    const copy = describeScanError(code);
    expect(copy.title.length).toBeGreaterThan(0);
    expect(copy.body.length).toBeGreaterThan(0);
  });

  it('gives every code a distinct title, so two failures never read the same', () => {
    const titles = ALL_CODES.map((code) => describeScanError(code).title);
    expect(new Set(titles).size).toBe(ALL_CODES.length);
  });

  it('never falls back to generic copy', () => {
    for (const code of ALL_CODES) {
      const { title, body } = describeScanError(code);
      expect(`${title} ${body}`.toLowerCase()).not.toContain('something went wrong');
    }
  });

  it('tells an expired code to ask the agent for a new one', () => {
    expect(describeScanError('EXPIRED').body).toBe('Ask your agent to generate a new code.');
  });

  it('keeps the camera live only for failures a retry can fix', () => {
    expect(describeScanError('INVALID').recoverable).toBe(true);
    expect(describeScanError('NETWORK').recoverable).toBe(true);

    expect(describeScanError('EXPIRED').recoverable).toBe(false);
    expect(describeScanError('ALREADY_SCANNED').recoverable).toBe(false);
    expect(describeScanError('WRONG_ACCOUNT').recoverable).toBe(false);
  });
});

describe('scanErrorCode', () => {
  it('reads the code straight off a ScanError', () => {
    expect(scanErrorCode(new ScanError('ALREADY_SCANNED'))).toBe('ALREADY_SCANNED');
  });

  it('treats an unrecognised throw as a network problem, which is recoverable', () => {
    expect(scanErrorCode(new Error('boom'))).toBe('NETWORK');
    expect(scanErrorCode('boom')).toBe('NETWORK');
    expect(scanErrorCode(undefined)).toBe('NETWORK');
    expect(describeScanError(scanErrorCode(null)).recoverable).toBe(true);
  });
});

describe('ScanError', () => {
  it('carries the code and a human title as its message', () => {
    const error = new ScanError('EXPIRED');
    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe('EXPIRED');
    expect(error.message).toBe('QR code has expired');
  });
});

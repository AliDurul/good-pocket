/**
 * Display formatting for points and money, matching what `LoyaltyHeroCard` already
 * puts on the home screen so a balance reads identically wherever it appears.
 */

const LOCALE = 'en-ZM';

/** Always two decimals: `2457.5` -> `2,457.50`. */
export function formatPoints(value: number): string {
  return value.toLocaleString(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Signed, for a single award: `7.5` -> `+7.50`. */
export function formatPointsDelta(value: number): string {
  return `${value < 0 ? '-' : '+'}${formatPoints(Math.abs(value))}`;
}

/**
 * Kwacha, dropping the decimals when there are none — receipts read `K700`, not
 * `K700.00`, and a total that genuinely has kwacha and ngwee still shows both.
 */
export function formatKwacha(value: number): string {
  const isWhole = Number.isInteger(value);
  return `K${value.toLocaleString(LOCALE, {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/** `mobile-money` -> `Mobile money`. */
export function formatPaymentMethod(method: string): string {
  const spaced = method.replace(/-/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

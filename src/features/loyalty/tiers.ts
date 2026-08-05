/**
 * The one description of the loyalty tiers.
 *
 * The gradients used to live inside `TierLadder`, which meant the tier-upgrade badge on
 * the confirmation screen would have had to redeclare them. They live here now so a
 * Silver medallion is the same Silver everywhere it appears.
 *
 * Names are UPPERCASE because that is how the API emits them; `titleCaseTier` is the
 * only thing that should be putting them on screen.
 */

export const TIER_ORDER = ['BRONZE', 'SILVER', 'GOLD'] as const;

export type TierName = (typeof TIER_ORDER)[number];

export interface Tier {
  name: TierName;
  label: string;
  initial: string;
  /** CSS gradient string — literal hex, since NativeWind cannot resolve a var here. */
  gradient: string;
  /** Wallet balance at which this tier begins. */
  threshold: number;
  /** Points multiplier the tier earns. */
  multiplier: number;
  /** Perks beyond the multiplier, which is stated separately. */
  benefits: string[];
}

export const TIERS: Record<TierName, Tier> = {
  BRONZE: {
    name: 'BRONZE',
    label: 'Bronze',
    initial: 'B',
    gradient: 'linear-gradient(150deg, #C9884F 0%, #9C5A2A 100%)',
    threshold: 0,
    multiplier: 1,
    benefits: ['Points on every order', 'Order tracking and reorder'],
  },
  SILVER: {
    name: 'SILVER',
    label: 'Silver',
    initial: 'S',
    gradient: 'linear-gradient(150deg, #DCDCE0 0%, #A9A9B0 100%)',
    threshold: 500,
    multiplier: 1.5,
    benefits: [
      'Free delivery on orders over K500',
      'Early access to flash sales',
      'Priority support line',
    ],
  },
  GOLD: {
    name: 'GOLD',
    label: 'Gold',
    initial: 'G',
    gradient: 'linear-gradient(150deg, #F2C879 0%, #C9943A 100%)',
    threshold: 1500,
    multiplier: 2,
    benefits: [
      'Free delivery on every order',
      'Priority agent assignment',
      'A 500 pt bonus on your birthday',
    ],
  },
};

function isTierName(value: string): value is TierName {
  return (TIER_ORDER as readonly string[]).includes(value);
}

/** Falls back to Bronze so an unrecognised tier from the API still renders. */
export function tierFor(name: string): Tier {
  const upper = name.toUpperCase();
  return isTierName(upper) ? TIERS[upper] : TIERS.BRONZE;
}

/** 'SILVER' -> 'Silver'. Works for tiers this app has no visual for yet. */
export function titleCaseTier(name: string): string {
  if (name.length === 0) return name;
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/** The highest tier the balance has reached. */
export function tierForBalance(balance: number): Tier {
  let reached: Tier = TIERS.BRONZE;
  for (const name of TIER_ORDER) {
    if (balance >= TIERS[name].threshold) reached = TIERS[name];
  }
  return reached;
}

/** The tier above `name`, or null at the top of the ladder. */
export function nextTierAfter(name: TierName): Tier | null {
  const index = TIER_ORDER.indexOf(name);
  const next = TIER_ORDER[index + 1];
  return next ? TIERS[next] : null;
}

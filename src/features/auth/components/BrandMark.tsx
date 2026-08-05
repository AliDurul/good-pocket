import { Box } from '@/components/ui/box';
import { Image } from '@/components/ui/image';

type BrandMarkSize = 'sm' | 'lg';

interface BrandMarkProps {
  /** `lg` is the splash treatment, `sm` the one that sits above a form heading. */
  size?: BrandMarkSize;
}

/**
 * Badge geometry. The logo is 1015×766 (aspect ≈ 1.325), so the badge is landscape
 * rather than the square the mockup drew around the old "GT" monogram.
 */
const SIZES: Record<BrandMarkSize, { badge: string; logo: string }> = {
  sm: { badge: 'h-[130px] w-[170px] rounded-[22px]', logo: 'h-[104px] w-[146px]' },
  lg: { badge: 'h-[168px] w-[220px] rounded-[28px]', logo: 'h-[136px] w-[192px]' },
};

/**
 * The Good Taste mark on the deep-brown badge from design frames 1d/1f.
 *
 * The badge is not just decoration: the logo's lower wordmark is near-white
 * (#F9F9F9), which sits at roughly 1.01:1 against the ivory background — invisible.
 * On brown it reads cleanly.
 *
 * A CSS gradient string can't resolve a CSS variable through NativeWind, so the brown
 * ramp is literal here, matching the precedent in LoyaltyHeroCard.
 */
export function BrandMark({ size = 'lg' }: BrandMarkProps) {
  const { badge, logo } = SIZES[size];

  return (
    <Box
      className={`items-center justify-center border-[1.5px] border-primary/50 ${badge}`}
      style={{
        experimental_backgroundImage: 'linear-gradient(150deg, #5A2410 0%, #3A1408 100%)',
      }}
    >
      {/* gluestack's Image overwrites the `style` prop on native, so size has to come
          through className — and `size="none"` defeats its default h-20 w-20 square. */}
      <Image
        source={require('../../../../assets/images/icon.png')}
        size="none"
        className={logo}
        resizeMode="contain"
        alt="Good Taste Milling"
      />
    </Box>
  );
}

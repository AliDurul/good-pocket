import { Box } from '@/components/ui/box';
import { FeaturedProducts } from '@/features/home/components/FeaturedProducts';
import { FlashSaleStrip } from '@/features/home/components/FlashSaleStrip';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { LoyaltyHeroCard } from '@/features/home/components/LoyaltyHeroCard';
import { OrderAgainCard } from '@/features/home/components/OrderAgainCard';
import { useFlashSale, useLastOrder, useLoyalty } from '@/features/home/stubs';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // The mockup's "Sarah" is demo content; the real name comes from the session.
  const fullName = session?.user?.name?.trim();
  const displayName = fullName && fullName.length > 0 ? fullName.split(' ')[0] : 'there';
  const initial = (fullName || 'G').charAt(0).toUpperCase();

  const { data: loyalty } = useLoyalty();
  const { data: flashSale } = useFlashSale();
  const { data: lastOrder } = useLastOrder();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <HomeHeader
          greeting={greetingFor(new Date())}
          name={displayName}
          initial={initial}
          hasUnread
          onPressBell={() => router.push('/modal')}
        />

        {loyalty ? <LoyaltyHeroCard summary={loyalty} /> : null}
        {flashSale ? <FlashSaleStrip sale={flashSale} /> : null}

        <FeaturedProducts
          onPressProduct={(product) => router.push(`/products/${product.id}`)}
          onSeeAll={() => router.push('/products')}
        />

        {lastOrder ? <OrderAgainCard order={lastOrder} /> : null}

        <Box className="h-2" />
      </ScrollView>
    </SafeAreaView>
  );
}

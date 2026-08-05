import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { AuthButton } from '@/features/auth';
import { tierFor } from '@/features/loyalty/tiers';
import { formatPoints } from '@/features/points/format';
import { usePointsSnapshot } from '@/features/points/stubs';
import { authClient } from '@/lib/auth-client';
import { Alert, ScrollView } from 'react-native';

interface DetailRowProps {
  label: string;
  value: string;
  isFirst?: boolean;
}

function DetailRow({ label, value, isFirst }: DetailRowProps) {
  return (
    <HStack
      className={`items-center justify-between gap-4 px-4 py-3.5 ${
        isFirst ? '' : 'border-t border-border'
      }`}
    >
      <Text className="font-poppins text-[13px] text-muted-foreground">{label}</Text>
      <Text className="flex-1 text-right font-poppins-medium text-[13px] text-foreground">
        {value}
      </Text>
    </HStack>
  );
}

export default function ProfileScreen() {
  const { data: session } = authClient.useSession();
  const { summary } = usePointsSnapshot();

  const user = session?.user;
  const fullName = user?.name?.trim();
  const displayName = fullName && fullName.length > 0 ? fullName : 'Your account';
  const initial = (fullName || 'G').charAt(0).toUpperCase();
  const tier = tierFor(summary.tier);

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          void authClient.signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background pt-3">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <VStack className="items-center gap-3 px-4 pb-6 pt-4">
          <Box
            className="h-20 w-20 items-center justify-center rounded-full"
            style={{ experimental_backgroundImage: tier.gradient }}
          >
            <Text className="font-playfair-black text-white" style={{ fontSize: 30, lineHeight: 36 }}>
              {initial}
            </Text>
          </Box>

          <VStack className="items-center gap-1">
            <Text className="font-poppins-semibold text-lg text-foreground">{displayName}</Text>
            {user?.email ? (
              <Text className="font-poppins text-[13px] text-muted-foreground">{user.email}</Text>
            ) : null}
          </VStack>

          <HStack className="items-center gap-2">
            <Box className="rounded-full bg-primary px-3 py-1">
              <Text className="font-poppins-bold text-[11px] tracking-[1px] text-primary-foreground">
                {tier.label.toUpperCase()}
              </Text>
            </Box>
            <Text className="font-poppins-medium text-[12.5px] text-muted-foreground">
              {formatPoints(summary.walletBalance)} pts
            </Text>
          </HStack>
        </VStack>

        <VStack className="mx-4 overflow-hidden rounded-2xl border border-border bg-card">
          <DetailRow label="Phone" value={user?.phone ?? 'Not set'} isFirst />
          <DetailRow label="Town" value={user?.town ?? 'Not set'} />
          <DetailRow label="City" value={user?.city ?? 'Not set'} />
          <DetailRow label="Country" value={user?.country ?? 'Not set'} />
        </VStack>

        <Box className="mt-8 px-4">
          <AuthButton label="Sign out" variant="outline" onPress={handleSignOut} />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

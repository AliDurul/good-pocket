import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import { AuthButton } from '@/features/auth';
import { TriangleAlert } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import type { ScanErrorCopy } from '../errors';

interface ScanErrorCardProps {
  copy: ScanErrorCopy;
  /** Shown for failures a retry cannot fix, so the customer is never stranded. */
  onDismiss: () => void;
}

/**
 * The inline failure message over the camera.
 *
 * Recoverable failures get no button — the camera is already live again behind this
 * card, and the customer just points at another code. Anything else gets a way out.
 */
export function ScanErrorCard({ copy, onDismiss }: ScanErrorCardProps) {
  return (
    <Animated.View entering={FadeInDown.duration(220)} exiting={FadeOutDown.duration(160)}>
      <Box
        className="rounded-3xl border border-white/10 px-5 py-4.5"
        style={{ backgroundColor: 'rgba(28, 12, 4, 0.94)' }}
      >
        <HStack className="items-start gap-3">
          <Box className="mt-0.5 h-7 w-7 items-center justify-center rounded-full bg-primary/20">
            <TriangleAlert size={15} color="#F2C879" strokeWidth={2.2} />
          </Box>

          <VStack className="flex-1 gap-1">
            <Text className="font-poppins-semibold text-[14.5px] text-white">{copy.title}</Text>
            <Text className="font-poppins text-[12.5px] leading-[18px] text-white/70">
              {copy.body}
            </Text>
          </VStack>
        </HStack>

        {copy.recoverable ? (
          <Text className="mt-3 font-poppins-medium text-[12px] text-primary">
            The camera is still running — try another code.
          </Text>
        ) : (
          <AuthButton label="Close scanner" onPress={onDismiss} className="mt-4" />
        )}
      </Box>
    </Animated.View>
  );
}

interface ScanErrorRetryLinkProps {
  onPress: () => void;
  label: string;
}

/** Plain text affordance used beneath the card on the permission screen. */
export function ScanTextLink({ onPress, label }: ScanErrorRetryLinkProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} className="items-center py-2.5">
      <Text className="font-poppins-medium text-[13.5px] text-muted-foreground">{label}</Text>
    </Pressable>
  );
}

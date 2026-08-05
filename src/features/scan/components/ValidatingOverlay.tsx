import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

/**
 * Covers the camera while the confirmation call is in flight. The scan must not
 * navigate anywhere until the server answers, so this is the only thing on screen for
 * that beat — it also stops a customer aiming at a second code mid-request.
 */
export function ValidatingOverlay() {
  return (
    <Animated.View
      entering={FadeIn.duration(160)}
      exiting={FadeOut.duration(160)}
      style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}
    >
      <Box className="flex-1 items-center justify-center">
        <VStack className="items-center gap-3.5">
          <ActivityIndicator size="large" color="#F2C879" />
          <Text className="font-poppins-medium text-[15px] text-white">Validating...</Text>
        </VStack>
      </Box>
    </Animated.View>
  );
}

import { useEffect } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { BrandMark } from '@/features/auth';

export default function SplashScreen() {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.85);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
        scale.value = withSequence(
            withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }),
            withDelay(
                150,
                withRepeat(
                    withSequence(
                        withTiming(1.04, { duration: 700, easing: Easing.inOut(Easing.sin) }),
                        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.sin) })
                    ),
                    -1,
                    false
                )
            )
        );
    }, [opacity, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    return (
        <Box className="flex-1 items-center justify-center bg-secondary">
            {/* Gold blooms bleeding off opposite corners. Decorative only. */}
            <Box
                pointerEvents="none"
                className="absolute -left-10 -top-10 h-[200px] w-[200px] rounded-full"
                style={{
                    experimental_backgroundImage:
                        'radial-gradient(circle, rgba(201,148,58,0.16) 0%, transparent 70%)',
                }}
            />
            <Box
                pointerEvents="none"
                className="absolute -right-[50px] bottom-10 h-[220px] w-[220px] rounded-full"
                style={{
                    experimental_backgroundImage:
                        'radial-gradient(circle, rgba(201,148,58,0.1) 0%, transparent 70%)',
                }}
            />

            <VStack className="items-center gap-5 px-8">
                <Animated.View style={animatedStyle}>
                    <BrandMark size="lg" />
                </Animated.View>

                {/* No wordmark lines here — the logo already carries "GoodTaste CLUB". */}
                <Text className="mt-1 font-poppins text-[13px] text-background/60">
                    Quality you can taste
                </Text>
            </VStack>
        </Box>
    );
}

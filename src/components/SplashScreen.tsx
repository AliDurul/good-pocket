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
import Logo from '../../assets/icons/Logo';

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
        <Box className="flex-1 items-center justify-center bg-[#022e1f]">
            <Animated.View style={animatedStyle}>
                <Logo />
            </Animated.View>
        </Box>
    );
}

import { useRef, useState } from 'react'
import { Dimensions, FlatList, Pressable, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native'
import { Box } from '@/components/ui/box'
import { VStack } from '@/components/ui/vstack'
import { Text } from '@/components/ui/text'
import { Icon } from '@/components/ui/icon'
import { Package, Gift } from 'lucide-react-native'
import { SafeAreaView } from '@/components/ui/safe-area-view'
import useAppStore from '@/stores/appStore'
import { AuthButton, TierLadder } from '@/features/auth'

const { width } = Dimensions.get('window')

const SLIDES = [
    {
        key: 'order',
        title: 'Order your favourite\nproducts',
        body: 'Browse the full Good Taste range and get it delivered to your door.',
        IconShape: Package,
    },
    {
        key: 'earn',
        title: 'Earn points on\nevery delivery',
        body: 'Every order adds to your balance — no cards, no forms, nothing to remember.',
        IconShape: Gift,
    },
    {
        key: 'tier',
        title: 'Unlock rewards\nas you grow',
        body: 'Reach Gold tier for the best rewards, faster points, and exclusive deals.',
        IconShape: null,
    },
] as const

export default function Onboarding() {
    const { setOnboardingCompleted } = useAppStore()
    const [activeIndex, setActiveIndex] = useState(0)
    const listRef = useRef<FlatList>(null)

    const isLastSlide = activeIndex === SLIDES.length - 1

    const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width)
        setActiveIndex(index)
    }

    const handleComplete = () => setOnboardingCompleted(true)

    return (
        <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background">
            {/* `top-4` now sits below a real inset instead of standing in for one. */}
            {!isLastSlide && (
                <Box className="absolute right-5 top-4 z-10">
                    <Pressable onPress={handleComplete} hitSlop={12} accessibilityRole="button">
                        <Text className="font-poppins-medium text-[12px] text-muted-foreground">Skip</Text>
                    </Pressable>
                </Box>
            )}

            <FlatList
                ref={listRef}
                data={SLIDES}
                keyExtractor={(item) => item.key}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                renderItem={({ item }) => (
                    <VStack className="items-center justify-center px-[30px]" style={{ width }}>
                        {/* The last slide earns the tier ladder; the first two keep their glyphs. */}
                        <Box className="mb-[34px] items-center">
                            {item.IconShape ? (
                                <Box className="h-40 w-40 items-center justify-center rounded-full bg-primary/10">
                                    <Icon as={item.IconShape} className="h-16 w-16 text-primary" />
                                </Box>
                            ) : (
                                <TierLadder />
                            )}
                        </Box>

                        <Text className="text-center font-playfair text-[23px] leading-[28px] text-foreground">
                            {item.title}
                        </Text>
                        <Text className="mt-3 max-w-[232px] text-center font-poppins text-[13px] leading-5 text-muted-foreground">
                            {item.body}
                        </Text>
                    </VStack>
                )}
            />

            {/* pb-6, not pb-12 — the SafeAreaView bottom edge now contributes the rest. */}
            <VStack className="items-center pb-6">
                <Box className="flex-row items-center gap-[7px] pb-4 pt-[10px]">
                    {SLIDES.map((slide, index) => (
                        <Box
                            key={slide.key}
                            className={`h-[7px] rounded-[4px] ${index === activeIndex ? 'w-[22px] bg-primary' : 'w-[7px] bg-muted'}`}
                        />
                    ))}
                </Box>

                {/* Height is reserved on every slide so the dots don't jump on the last one. */}
                <Box className="h-[52px] w-full px-6">
                    {isLastSlide && <AuthButton label="Get Started" onPress={handleComplete} />}
                </Box>
            </VStack>
        </SafeAreaView>
    )
}

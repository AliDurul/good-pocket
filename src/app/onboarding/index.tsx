import { useRef, useState } from 'react'
import { Dimensions, FlatList, Pressable, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native'
import { Box } from '@/components/ui/box'
import { VStack } from '@/components/ui/vstack'
import { Heading } from '@/components/ui/heading'
import { Button, ButtonText } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Package, Gift, Trophy } from 'lucide-react-native'
import useAppStore from '@/stores/appStore'

const { width } = Dimensions.get('window')

const SLIDES = [
    {
        key: 'order',
        title: 'Order your favourite products',
        IconShape: Package,
    },
    {
        key: 'earn',
        title: 'Earn points on every delivery',
        IconShape: Gift,
    },
    {
        key: 'tier',
        title: 'Reach Gold tier and unlock rewards',
        IconShape: Trophy,
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
        <Box className="flex-1 bg-background">
            {!isLastSlide && (
                <Box className="absolute right-4 top-14 z-10">
                    <Pressable onPress={handleComplete} hitSlop={12}>
                        <Heading size="sm" className="text-muted-foreground">Skip</Heading>
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
                    <VStack space="xl" className="items-center justify-center px-10" style={{ width }}>
                        <Box className="h-48 w-48 items-center justify-center rounded-full bg-primary/10">
                            <Icon as={item.IconShape} size="xl" className="h-20 w-20 text-primary" />
                        </Box>
                        <Heading size="2xl" className="text-center text-foreground">{item.title}</Heading>
                    </VStack>
                )}
            />

            <VStack space="2xl" className="items-center pb-12">
                <Box className="flex-row gap-2">
                    {SLIDES.map((slide, index) => (
                        <Box
                            key={slide.key}
                            className={`h-2 rounded-full ${index === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-muted'}`}
                        />
                    ))}
                </Box>

                {isLastSlide && (
                    <Box className="w-full px-10">
                        <Button size="lg" className="w-full bg-primary" onPress={handleComplete}>
                            <ButtonText className="text-primary-foreground">Get Started</ButtonText>
                        </Button>
                    </Box>
                )}
            </VStack>
        </Box>
    )
}

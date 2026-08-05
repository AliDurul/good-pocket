import { ScanFab } from '@/features/navigation/components/ScanFab';
import { Tabs, useRouter } from 'expo-router';
import { Gem, House, ReceiptText, User } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Bar content height, before the safe-area inset is added underneath it. */
const BAR_HEIGHT = 60;

export default function TabsLayout() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#C9943A',
                    tabBarInactiveTintColor: '#7A5540',
                    tabBarStyle: {
                        backgroundColor: '#FAF7F2',
                        borderTopColor: '#EADFCE',
                        height: BAR_HEIGHT + insets.bottom,
                        paddingTop: 6,
                        paddingBottom: insets.bottom,
                    },
                    tabBarLabelStyle: {
                        fontFamily: 'Poppins_500Medium',
                        fontSize: 10,
                    },
                }}
            >
                <Tabs.Screen
                    name="(home)"
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
                    }} />
                <Tabs.Screen
                    name="orders/index"
                    options={{
                        title: 'Orders',
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => <ReceiptText color={color} size={size} />,
                    }} />

                {/*
                  Inert spacer. `ScanFab` below is rendered outside the navigator (see the
                  comment in that file), so this slot exists purely to keep the middle
                  fifth of the bar empty for it to sit in. The route itself never mounts.
                */}
                <Tabs.Screen
                    name="scan"
                    options={{ tabBarButton: () => <View style={{ flex: 1 }} /> }} />

                <Tabs.Screen
                    name="points/index"
                    options={{
                        title: 'Points',
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => <Gem color={color} size={size} />,
                    }} />
                <Tabs.Screen
                    name="profile/index"
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                    }} />

                <Tabs.Screen name='products/index' options={{ title: 'Products', href: null }} />
                <Tabs.Screen name='products/[productId]' options={{ headerShown: false, href: null }} />
                <Tabs.Screen name='categories/index' options={{ title: 'Categories', href: null }} />
                <Tabs.Screen name='users/index' options={{ title: 'Users', href: null }} />
            </Tabs>

            <ScanFab
                onPress={() => router.push('/scanner')}
                bottom={insets.bottom + 30}
            />
        </View>
    )
}

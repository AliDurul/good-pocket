import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Icon } from '@/components/ui/icon'
import { ChartBarStacked, EditIcon, Home } from 'lucide-react-native'

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
        }}>
            <Tabs.Screen
                name="(home)"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Icon as={Home} color={color} />,
                    // tabBarLabel: 'Home'
                }} />
            <Tabs.Screen
                name="second"
                options={{
                    title: 'Second Page',
                    headerShown: false,
                    tabBarLabel: 'Second',
                    popToTopOnBlur: true,
                    tabBarIcon: ({ color, size }) => <Icon as={EditIcon} color={color} />
                }} />
            <Tabs.Screen
                name="products/index"
                options={{
                    title: 'Products',
                    tabBarBadge: 3,
                    tabBarIcon: ({ color, size }) => <Icon as={ChartBarStacked} color={color} />
                }} />

            <Tabs.Screen name='products/[productId]' options={{ headerShown: false, href: null }} />

            <Tabs.Screen name='categories/index' options={{ title: 'Categories', href: null }} />
            <Tabs.Screen name='users/index' options={{ title: 'Users', href: null }} />
        </Tabs>
    )
}
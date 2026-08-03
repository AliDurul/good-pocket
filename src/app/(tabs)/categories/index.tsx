import { Box } from '@/components/ui/box'
import { Center } from '@/components/ui/center'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Card } from '@/components/ui/card'
import { Badge, BadgeText } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import { Spinner } from '@/components/ui/spinner'
import { Button, ButtonText } from '@/components/ui/button'
import { FlatList } from '@/components/ui/flat-list'
import { RefreshControl } from '@/components/ui/refresh-control'
import { Stack } from 'expo-router'
import React from 'react'
import { useCategories } from '@/api/queries/categories'
import type { IProductCategory } from '@/types'

export default function CategoriesPage() {
    const { data, isPending, isError, error, refetch, isRefetching } = useCategories();
    const categories = data?.data ?? [];

    if (isPending) {
        return (
            <Center className="flex-1 bg-background gap-2">
                <Spinner />
                <Text className="text-foreground">Loading categories…</Text>
            </Center>
        );
    }

    if (isError) {
        return (
            <Center className="flex-1 bg-background gap-3 px-6">
                <Text className="text-error-500 text-center">{error.message}</Text>
                <Button variant="outline" onPress={() => refetch()}>
                    <ButtonText>Retry</ButtonText>
                </Button>
            </Center>
        );
    }

    return (
        <Box className="flex-1 bg-background">
            <Stack.Screen options={{ title: 'Categories' }} />

            <FlatList
                data={categories}
                keyExtractor={(item: IProductCategory) => item.id}
                contentContainerClassName="gap-3 p-4"
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
                ListEmptyComponent={
                    <Center className="flex-1 py-20">
                        <Text className="text-foreground">No categories found</Text>
                    </Center>
                }
                renderItem={({ item }: { item: IProductCategory }) => (
                    <Card size="sm">
                        <HStack space="md" className="items-center">
                            {item.image ? (
                                <Image source={{ uri: item.image }} size="sm" className="rounded-md" alt={item.name} />
                            ) : (
                                <Box className="h-16 w-16 rounded-md bg-secondary" />
                            )}
                            <VStack className="flex-1">
                                <Heading size="sm" numberOfLines={1}>{item.name}</Heading>
                                {item.description && (
                                    <Text size="xs" className="text-muted-foreground" numberOfLines={2}>{item.description}</Text>
                                )}
                            </VStack>
                            <Badge variant={item.isActive ? 'default' : 'outline'}>
                                <BadgeText>{item.isActive ? 'Active' : 'Inactive'}</BadgeText>
                            </Badge>
                        </HStack>
                    </Card>
                )}
            />
        </Box>
    )
}

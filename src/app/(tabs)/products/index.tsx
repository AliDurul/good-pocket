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
import { Pressable } from '@/components/ui/pressable'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useProducts } from '@/api/queries/products'
import { useCategories } from '@/api/queries/categories'
import type { IProduct, IProductCategory } from '@/types'

export default function ProductPage() {
    const router = useRouter();
    const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

    const { data: categoriesData } = useCategories({ isActive: true, limit: 50 });
    const categories = categoriesData?.data ?? [];

    const {
        data,
        isPending,
        isError,
        error,
        refetch,
        isRefetching,
    } = useProducts({ categoryId, isActive: true });

    const products = data?.data ?? [];

    if (isPending) {
        return (
            <Center className="flex-1 bg-background gap-2">
                <Spinner />
                <Text className="text-foreground">Loading products…</Text>
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
            {categories.length > 0 && (
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item: IProductCategory) => item.id}
                    contentContainerClassName="gap-2 px-4 py-3"
                    renderItem={({ item }: { item: IProductCategory }) => (
                        <Pressable onPress={() => setCategoryId((prev) => (prev === item.id ? undefined : item.id))}>
                            <Badge variant={categoryId === item.id ? 'default' : 'outline'}>
                                <BadgeText>{item.name}</BadgeText>
                            </Badge>
                        </Pressable>
                    )}
                />
            )}

            <FlatList
                data={products}
                keyExtractor={(item: IProduct) => item.id}
                contentContainerClassName="gap-3 p-4"
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
                ListEmptyComponent={
                    <Center className="flex-1 py-20">
                        <Text className="text-foreground">No products found</Text>
                    </Center>
                }
                renderItem={({ item }: { item: IProduct }) => {
                    const prices = (item.variants ?? []).map((v) => v.price);
                    const minPrice = prices.length ? Math.min(...prices) : undefined;

                    return (
                        <Link
                            href={{ pathname: '/products/[productId]', params: { productId: item.id } }}
                            asChild
                        >
                            <Pressable>
                                <Card size="sm">
                                    <HStack space="md" className="items-center">
                                        {item.image ? (
                                            <Image
                                                source={{ uri: item.image }}
                                                size="sm"
                                                className="rounded-md"
                                                alt={item.name}
                                            />
                                        ) : (
                                            <Box className="h-16 w-16 rounded-md bg-secondary" />
                                        )}
                                        <VStack className="flex-1">
                                            <Heading size="sm" numberOfLines={1}>{item.name}</Heading>
                                            {item.category && (
                                                <Text size="xs" className="text-muted-foreground">{item.category.name}</Text>
                                            )}
                                            {minPrice !== undefined && (
                                                <Text size="sm" className="text-foreground">From ${minPrice.toFixed(2)}</Text>
                                            )}
                                        </VStack>
                                    </HStack>
                                </Card>
                            </Pressable>
                        </Link>
                    );
                }}
            />
        </Box>
    )
}

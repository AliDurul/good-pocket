import { Box } from '@/components/ui/box'
import { Center } from '@/components/ui/center'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Card } from '@/components/ui/card'
import { Badge, BadgeText } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Button, ButtonText } from '@/components/ui/button'
import { FlatList } from '@/components/ui/flat-list'
import { RefreshControl } from '@/components/ui/refresh-control'
import { Stack } from 'expo-router'
import React from 'react'
import { useUsers } from '@/api/queries/users'
import type { IUser } from '@/types'

export default function UsersPage() {
    const { data, isPending, isError, error, refetch, isRefetching } = useUsers();
    const users = data?.data ?? [];

    if (isPending) {
        return (
            <Center className="flex-1 bg-background gap-2">
                <Spinner />
                <Text className="text-foreground">Loading users…</Text>
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
            <Stack.Screen options={{ title: 'Users' }} />

            <FlatList
                data={users}
                keyExtractor={(item: IUser) => item.id}
                contentContainerClassName="gap-3 p-4"
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
                ListEmptyComponent={
                    <Center className="flex-1 py-20">
                        <Text className="text-foreground">No users found</Text>
                    </Center>
                }
                renderItem={({ item }: { item: IUser }) => (
                    <Card size="sm">
                        <HStack space="md" className="items-center justify-between">
                            <VStack className="flex-1">
                                <Heading size="sm" numberOfLines={1}>{item.name}</Heading>
                                <Text size="xs" className="text-muted-foreground" numberOfLines={1}>{item.email}</Text>
                            </VStack>
                            <Badge variant="outline">
                                <BadgeText>{item.role}</BadgeText>
                            </Badge>
                        </HStack>
                    </Card>
                )}
            />
        </Box>
    )
}

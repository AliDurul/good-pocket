import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { Center } from '@/components/ui/center'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { Link } from 'expo-router'
import React from 'react'

export default function HomeNested() {
    return (
        <Box className="flex-1 bg-background ">
            <Center className="flex-1">
                <VStack className="gap-5 items-center">

                    <Text className="text-foreground">Home Nested</Text>
                    <Link href="/" asChild>
                        <Button variant='outline'>
                            <ButtonText>Go back</ButtonText>
                        </Button>
                    </Link>
                </VStack>
            </Center>
        </Box>
    )
}

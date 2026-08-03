import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { Center } from '@/components/ui/center'
import { Text } from '@/components/ui/text'
import { Link } from 'expo-router'
import React from 'react'

export default function Second() {
    return (
        <Box className="flex-1 bg-background">
            <Center className="flex-1 gap-5">
                <Text>Second </Text>
                <Link href="/second/nested" asChild>
                    <Button variant='default'>
                        <ButtonText>Go to nested</ButtonText>
                    </Button>
                </Link>
            </Center>
        </Box>
    )
}

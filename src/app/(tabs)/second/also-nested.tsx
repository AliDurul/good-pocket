import React from 'react'
import { Box } from '@/components/ui/box'
import { Center } from '@/components/ui/center'
import { Text } from '@/components/ui/text'

export default function AlsoNested() {
    return (
        <Box className="flex-1 bg-background ">
            <Center className="flex-1">
                <Text className="text-foreground">Also Nested</Text>
            </Center>
        </Box>
    )
}
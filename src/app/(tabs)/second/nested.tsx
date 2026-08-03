import React from 'react'
import { Box } from '@/components/ui/box'
import { Center } from '@/components/ui/center'
import { Text } from '@/components/ui/text'
import { Link } from 'expo-router'
import { Button, ButtonText } from '@/components/ui/button'
import { VStack } from '@/components/ui/vstack'
import { Modal } from 'react-native'

export default function SecondNested() {
    const [modalvisible, setModalVisible] = React.useState(false);
    return (
        <Box className="flex-1 bg-background ">
            <Center className="flex-1">
                <VStack className="gap-5 items-center">
                    <Text className="text-foreground">Nested</Text>
                    <Link href="/second/nested" asChild>
                        <Button variant='outline'>
                            <ButtonText>Go to also nested</ButtonText>
                        </Button>
                    </Link>
                    <Button variant='outline' onPress={() => setModalVisible(true)}>
                        <ButtonText>Open Modal</ButtonText>
                    </Button>
                </VStack>
                
                <Modal
                    animationType="slide"
                    presentationStyle="pageSheet"
                    visible={modalvisible} onRequestClose={() => setModalVisible(false)}>
                    <Box className='p-12 rounded-lg bg-white gap-5 items-center flex-1 justify-center'>
                        <Text className="text-foreground">This is a modal</Text>
                        <Button variant='outline' onPress={() => setModalVisible(false)}>
                            <ButtonText>Close Modal</ButtonText>
                        </Button>
                    </Box>
                </Modal>
            </Center>
        </Box>
    )
}
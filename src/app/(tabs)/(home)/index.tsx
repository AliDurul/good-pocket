import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { Link, Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { authClient } from '@/lib/auth-client';

export default function HomePage() {
  const router = useRouter();


  const logout = async () => {
    await authClient.signOut();
  };

  return (
    <Box className="flex-1 bg-background">

      <Center className="flex-1 gap-5">
        <Text className="font-semibold">
          Home Page
        </Text>
        <Button variant='default' onPress={() => {
          router.push('/home-nested');
        }}>
          <ButtonText>Go to nested home</ButtonText>
        </Button>


        <Link href="/modal" asChild>
          <Button variant='secondary'>
            <ButtonText>Go to modal</ButtonText>
          </Button>
        </Link>

        <Link href="/categories" asChild>
          <Button variant='outline'>
            <ButtonText>Go to Categories</ButtonText>
          </Button>
        </Link>

        <Link href="/users" asChild>
          <Button variant='outline'>
            <ButtonText>Go to Users</ButtonText>
          </Button>
        </Link>

        <Button variant='outline' onPress={() => {
          logout();
        }}>
          <ButtonText>Logout </ButtonText>
        </Button>

      </Center>
    </Box>
  );
}
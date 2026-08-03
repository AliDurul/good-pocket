import { Fab, FabIcon } from '@/components/ui/fab';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { EditIcon, Icon, MoonIcon, SunIcon } from '@/components/ui/icon';
import './global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  PlayfairDisplay_700Bold,
  PlayfairDisplay_800ExtraBold,
} from '@expo-google-fonts/playfair-display';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Slot, Stack, Tabs, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider, } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client';
import { setupReactQuery } from '@/lib/react-query';
import { ChartBarStacked, Home } from 'lucide-react-native';
import { authClient } from '@/lib/auth-client';
import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import useAppStore from '@/stores/appStore';
import BrandedSplashScreen from '@/components/SplashScreen';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  
  return <RootLayoutNav />;
}


function RootLayoutNav() {
  const { onboardingCompleted } = useAppStore();

  const [colorMode, setColorMode] = useState<'light' | 'dark' | 'system'>('light');

  const { data: session, isPending } = authClient.useSession();

  const [hasHydrated, setHasHydrated] = useState(useAppStore.persist.hasHydrated());

  useEffect(() => {
    if (useAppStore.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }
    return useAppStore.persist.onFinishHydration(() => setHasHydrated(true));
  }, []);

  const isReady = hasHydrated && !isPending;

  // useEffect(() => {
  //   setupReactQuery();
  // }, []);

  return (
    <ThemeProvider value={colorMode === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GluestackUIProvider mode={colorMode}>

          <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} />

          <QueryClientProvider client={queryClient}>

            {isReady ? (
              <Stack>
                <Stack.Protected guard={!!session}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom' }} />
                </Stack.Protected>

                <Stack.Protected guard={!session && onboardingCompleted}>
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                  <Stack.Screen name="register" options={{ headerShown: false }} />
                  <Stack.Screen name="location-picker" options={{ presentation: 'modal', headerShown: false }} />
                </Stack.Protected>

                <Stack.Protected guard={!onboardingCompleted}>
                  <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                </Stack.Protected>
              </Stack>
            ) : (
              <BrandedSplashScreen />
            )}

          </QueryClientProvider>

        </GluestackUIProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

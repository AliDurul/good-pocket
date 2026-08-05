import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { AuthButton } from '@/features/auth';
import { ScanErrorCard, ScanTextLink } from '@/features/scan/components/ScanErrorCard';
import { ScannerFrame } from '@/features/scan/components/ScannerFrame';
import { ValidatingOverlay } from '@/features/scan/components/ValidatingOverlay';
import { describeScanError, scanErrorCode, type ScanErrorCopy } from '@/features/scan/errors';
import { parseScanPayload } from '@/features/scan/payload';
import type { ScanErrorCode } from '@/features/scan/types';
import { useConfirmScan } from '@/features/scan/useConfirmScan';
import { authClient } from '@/lib/auth-client';
import useScanResultStore from '@/stores/scanResultStore';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

/** How long a recoverable failure holds the scanner before it listens again. */
const REARM_MS = 2000;

export default function ScannerScreen() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const setResult = useScanResultStore((state) => state.setResult);
  const confirm = useConfirmScan();

  const [permission, requestPermission] = useCameraPermissions();
  const [isPaused, setIsPaused] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<ScanErrorCopy | null>(null);
  const [orderRef, setOrderRef] = useState<string | null>(null);

  /**
   * Shadows `isPaused` as a ref because `onBarcodeScanned` fires many times a second
   * and can fire again before a `setState` has been applied — the state drives the
   * prop, the ref is what actually stops a second confirmation for the same code.
   */
  const isLocked = useRef(false);
  /** The last code acted on, so a rejected code left in frame doesn't loop. */
  const lastScanned = useRef<string | null>(null);
  const rearmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userId = session?.user?.id ?? '';

  // Eagerly, so the customer isn't looking at a black rectangle wondering what to do.
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      void requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    return () => {
      if (rearmTimer.current) clearTimeout(rearmTimer.current);
    };
  }, []);

  const lock = useCallback(() => {
    isLocked.current = true;
    setIsPaused(true);
  }, []);

  const fail = useCallback(
    (code: ScanErrorCode) => {
      const copy = describeScanError(code);
      setIsValidating(false);
      setError(copy);

      // Not recoverable: stay locked. The card carries a way out.
      if (!copy.recoverable) return;

      // Re-arm, but leave the message up — it stays until the next code is read, so a
      // customer who looked away doesn't miss why the last attempt failed.
      rearmTimer.current = setTimeout(() => {
        isLocked.current = false;
        setIsPaused(false);
      }, REARM_MS);
    },
    [],
  );

  const handleBarcode = useCallback(
    ({ data }: { data: string }) => {
      if (isLocked.current) return;
      if (data === lastScanned.current) return;
      console.log('scanned', data);
      lock();
      lastScanned.current = data;
      setError(null);
      // ! get the payload from qr code and make api call with the data from qr
      const parsed = parseScanPayload(data, new Date(), userId);
      if (!parsed.ok) {
        fail(parsed.code);
        return;
      }

      setOrderRef(parsed.payload.orderRef);
      setIsValidating(true);

      confirm.mutate(parsed.payload, {
        onSuccess: (confirmation) => {
          setResult(confirmation);
          // `replace`, so Back from the celebration never lands on a live camera
          // pointed at a code that has already been redeemed.
          router.replace('/scan-confirmed');
        },
        onError: (mutationError) => fail(scanErrorCode(mutationError)),
      });
    },
    [confirm, fail, lock, router, setResult, userId],
  );

  if (!permission) {
    // Permission state is still resolving; nothing useful to show yet.
    return <Box className="flex-1 bg-secondary" />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background">
        <Box className="flex-1 items-center justify-center px-8">
          <VStack className="w-full items-center gap-4">
            <Box className="h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Camera size={35} color="#7A5540" strokeWidth={1.8} />
            </Box>

            <Text className="text-center font-poppins-semibold text-lg text-foreground">
              Camera access needed
            </Text>
            <Text className="text-center font-poppins text-[13.5px] leading-[20px] text-muted-foreground">
              Good Pocket uses the camera only to read your agent&apos;s QR code and confirm you
              received your order.
            </Text>

            <Box className="mt-2 w-full">
              <AuthButton
                label={permission.canAskAgain ? 'Allow camera' : 'Open settings'}
                onPress={() => {
                  if (permission.canAskAgain) void requestPermission();
                  else void Linking.openSettings();
                }}
              />
            </Box>

            <ScanTextLink label="Go back" onPress={() => router.back()} />
          </VStack>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        // Detaching the handler is how expo-camera pauses scanning.
        onBarcodeScanned={isPaused ? undefined : handleBarcode}
      />

      <ScannerFrame isActive={!isPaused} />

      <SafeAreaView edges={['top', 'bottom']} style={StyleSheet.absoluteFill}>
        <HStack className="items-start justify-between px-5 pt-2">
          <Box className="flex-1 pr-4">
            <Text className="font-poppins-medium text-[11px] uppercase tracking-[1.2px] text-primary">
              {orderRef ? 'Confirming receipt for' : 'Scan to confirm'}
            </Text>
            <Text className="mt-0.5 font-poppins-semibold text-[17px] text-white">
              {orderRef ?? 'Your delivery'}
            </Text>
          </Box>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel scanning"
            onPress={() => router.back()}
            className="rounded-full border border-white/25 px-4 py-2"
          >
            <Text className="font-poppins-medium text-[13px] text-white">Cancel</Text>
          </Pressable>
        </HStack>

        <Box className="flex-1" pointerEvents="none" />

        <VStack className="px-5 pb-4">
          {error ? (
            <ScanErrorCard copy={error} onDismiss={() => router.back()} />
          ) : (
            <Text className="pb-6 text-center font-poppins-medium text-[13px] text-white/90">
              Point your camera at the agent&apos;s QR code
            </Text>
          )}
        </VStack>
      </SafeAreaView>

      {isValidating ? <ValidatingOverlay /> : null}
    </View>
  );
}

import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { onlineManager, focusManager } from '@tanstack/react-query';
import * as Network from 'expo-network';

/* -----------------------------
   1. App Focus (foreground/background)
------------------------------ */
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

/* -----------------------------
   2. Online / Offline state
------------------------------ */
function setupOnlineManager() {
  onlineManager.setEventListener((setOnline) => {
    let initialized = false;

    const subscription = Network.addNetworkStateListener((state) => {
      initialized = true;

      setOnline(
        state.isConnected === true &&
        state.isInternetReachable !== false
      );
    });

    Network.getNetworkStateAsync()
      .then((state) => {
        if (!initialized) {
          setOnline(
            state.isConnected === true &&
            state.isInternetReachable !== false
          );
        }
      })
      .catch(() => {});

    return subscription.remove;
  });
}

/* -----------------------------
   3. Main setup function
------------------------------ */
export function setupReactQuery() {
  setupOnlineManager();

  AppState.addEventListener('change', onAppStateChange);
}
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 8000;
const API_BASE_PATH = '/api/v1';

/**
 * In dev, reuse the LAN IP Metro is already serving from so the API host follows
 * this machine instead of a pinned address that dies on the next DHCP lease.
 */
function devOrigin(): string | null {
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (!host) return null;

  // Android emulators reach the host machine through 10.0.2.2, never localhost.
  const resolved =
    Platform.OS === 'android' && (host === 'localhost' || host === '127.0.0.1')
      ? '10.0.2.2'
      : host;

  return `http://${resolved}:${API_PORT}`;
}

const fromEnv = process.env.EXPO_PUBLIC_API_URL ?? '';
// Better Auth wants a bare origin; it appends its own basePath.
const envOrigin = fromEnv.match(/^https?:\/\/[^/]+/)?.[0] ?? fromEnv;

const origin = (__DEV__ ? devOrigin() : null) ?? envOrigin;

export const ENV = {
  API_ORIGIN: origin,
  API_URL: `${origin}${API_BASE_PATH}`,
  API_KEY: process.env.EXPO_PUBLIC_API_KEY!,
};

import { useCallback, useState } from 'react'
import * as Location from 'expo-location'

export type Coords = { latitude: number; longitude: number }

/**
 * Wraps the expo-location permission + GPS + reverse-geocoding flow so screens
 * stay thin and the logic is shared between the register form and the map picker.
 *
 * @example
 * const { getCurrentLocation, reverseGeocode, locating, error } = useLocation()
 * const coords = await getCurrentLocation()
 * if (coords) setAddress(await reverseGeocode(coords))
 */
export function useLocation() {
    const [locating, setLocating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /**
     * Requests foreground permission and resolves the device's current coords.
     * Returns `null` (and sets `error`) when permission is denied or GPS fails.
     */
    const getCurrentLocation = useCallback(async (): Promise<Coords | null> => {
        setError(null)
        setLocating(true)
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            console.log('Location permission status:', status);
            if (status !== 'granted') {
                setError('Location permission denied. Please enable it in settings.')
                return null
            }
            const pos = await Location.getCurrentPositionAsync({})
            console.log('Current position:', pos);
            return { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
        } catch {
            setError('Could not get your location. Please try again.')
            return null
        } finally {
            setLocating(false)
        }
    }, [])

    /**
     * Best-effort reverse geocode into a single readable address line.
     * Returns `null` if the lookup yields nothing or fails.
     */
    const reverseGeocode = useCallback(async (coords: Coords): Promise<string | null> => {
        try {
            const [place] = await Location.reverseGeocodeAsync(coords)
            if (!place) return null
            const formatted = [place.name, place.street, place.city, place.country]
                .filter(Boolean)
                .join(', ')
            return formatted || null
        } catch {
            return null
        }
    }, [])

    return { locating, error, getCurrentLocation, reverseGeocode }
}

export default useLocation

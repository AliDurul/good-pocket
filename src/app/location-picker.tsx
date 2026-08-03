import React, { useEffect, useRef, useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE, type Region } from 'react-native-maps'
import * as Location from 'expo-location'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, Check, MapPin, Search } from 'lucide-react-native'

import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button'
import { Pressable } from '@/components/ui/pressable'
import { Spinner } from '@/components/ui/spinner'
import { useLocation, type Coords } from '@/hooks/useLocation'
import useLocationPickerStore from '@/stores/locationPickerStore'
import useAppToast from '@/hooks/useAppToast'

// Street-level zoom and a sensible fallback (Lusaka) when GPS is unavailable.
const ZOOM = { latitudeDelta: 0.01, longitudeDelta: 0.01 }
const FALLBACK: Coords = { latitude: -15.4167, longitude: 28.2833 }

export default function LocationPicker() {
    const router = useRouter()
    const toast = useAppToast()
    const insets = useSafeAreaInsets()
    const params = useLocalSearchParams<{ lat?: string; lng?: string }>()
    const { getCurrentLocation, reverseGeocode } = useLocation()
    const setPicked = useLocationPickerStore((s) => s.setPicked)

    const mapRef = useRef<MapView>(null)
    const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const [region, setRegion] = useState<Region | null>(null)
    const [center, setCenter] = useState<Coords | null>(null)
    const [address, setAddress] = useState<string | null>(null)
    const [loadingAddress, setLoadingAddress] = useState(false)
    const [query, setQuery] = useState('')
    const [searching, setSearching] = useState(false)

    // Resolve the initial region: param coords (from an existing form value),
    // else the device's current location, else the fallback.
    useEffect(() => {
        let active = true
        const init = async () => {
            const lat = params.lat ? Number(params.lat) : NaN
            const lng = params.lng ? Number(params.lng) : NaN
            const start =
                Number.isFinite(lat) && Number.isFinite(lng)
                    ? { latitude: lat, longitude: lng }
                    : (await getCurrentLocation()) ?? FALLBACK
            if (!active) return
            setRegion({ ...start, ...ZOOM })
            setCenter(start)
            void runReverseGeocode(start)
        }
        void init()
        return () => {
            active = false
            if (geocodeTimer.current) clearTimeout(geocodeTimer.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const runReverseGeocode = async (coords: Coords) => {
        setLoadingAddress(true)
        const result = await reverseGeocode(coords)
        setAddress(result)
        setLoadingAddress(false)
    }

    // Map settled under the fixed center pin → capture center, debounce the lookup.
    const handleRegionChangeComplete = (next: Region) => {
        const coords = { latitude: next.latitude, longitude: next.longitude }
        setCenter(coords)
        if (geocodeTimer.current) clearTimeout(geocodeTimer.current)
        geocodeTimer.current = setTimeout(() => void runReverseGeocode(coords), 400)
    }

    const handleSearch = async () => {
        const q = query.trim()
        if (!q) return
        setSearching(true)
        try {
            const [hit] = await Location.geocodeAsync(q)
            if (!hit) {
                toast.warning('No match for that address. Try being more specific.', {
                    title: 'Not found',
                })
                return
            }
            const next: Region = { latitude: hit.latitude, longitude: hit.longitude, ...ZOOM }
            mapRef.current?.animateToRegion(next, 500)
        } catch {
            toast.error('Could not search that address. Check your connection.')
        } finally {
            setSearching(false)
        }
    }

    const handleConfirm = () => {
        if (!center) return
        setPicked({ ...center, address: address ?? undefined })
        router.back()
    }

    if (!region) {
        return (
            <Box className="flex-1 items-center justify-center bg-[#022e1f] gap-3">
                <Spinner size="large" color="white" />
                <Text className="text-secondary-foreground/70">Finding your location…</Text>
            </Box>
        )
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                style={StyleSheet.absoluteFill}
                initialRegion={region}
                onRegionChangeComplete={handleRegionChangeComplete}
                showsUserLocation
                showsMyLocationButton={false}
            />

            {/* Fixed center pin — stays put while the map pans beneath it.
                Tip of the pin points at the map center, so offset up by its height. */}
            <View pointerEvents="none" style={styles.pinWrap}>
                <MapPin size={40} color="#022e1f" fill="#16a34a" strokeWidth={2} />
            </View>

            {/* Top: back button + address search */}
            <Box
                className="absolute left-0 right-0 px-4 gap-2"
                style={{ top: insets.top + 8 }}
            >
                <Box className="flex-row items-center gap-2">
                    <Pressable
                        onPress={() => router.back()}
                        className="h-11 w-11 items-center justify-center rounded-full bg-secondary-foreground shadow"
                    >
                        <ArrowLeft size={22} color="#022e1f" />
                    </Pressable>
                    <Input className="flex-1 bg-secondary-foreground shadow">
                        <InputSlot className="pl-3">
                            <InputIcon as={Search} className="text-muted-foreground" />
                        </InputSlot>
                        <InputField
                            placeholder="Search an address…"
                            value={query}
                            onChangeText={setQuery}
                            returnKeyType="search"
                            onSubmitEditing={handleSearch}
                            autoCapitalize="none"
                        />
                        {searching ? (
                            <InputSlot className="pr-3">
                                <Spinner size="small" />
                            </InputSlot>
                        ) : null}
                    </Input>
                </Box>
            </Box>

            {/* Bottom: resolved address + confirm */}
            <Box
                className="absolute left-0 right-0 px-4 gap-3"
                style={{ bottom: insets.bottom + 16 }}
            >
                <Box className="rounded-xl bg-secondary-foreground px-4 py-3 shadow gap-0.5">
                    <Text size="xs" className="text-muted-foreground uppercase tracking-wide">
                        Selected location
                    </Text>
                    {loadingAddress ? (
                        <Text className="text-foreground">Locating address…</Text>
                    ) : (
                        <Text className="text-foreground font-medium" numberOfLines={2}>
                            {address ?? 'Move the map to drop the pin'}
                        </Text>
                    )}
                    {center ? (
                        <Text size="xs" className="text-muted-foreground">
                            {center.latitude.toFixed(6)}, {center.longitude.toFixed(6)}
                        </Text>
                    ) : null}
                </Box>

                <Button className="w-full py-3 bg-primary" size="lg" onPress={handleConfirm}>
                    {loadingAddress ? (
                        <ButtonSpinner color="white" />
                    ) : (
                        <ButtonIcon as={Check} className="text-secondary-foreground" />
                    )}
                    <ButtonText className="text-secondary-foreground text-lg">
                        Confirm location
                    </ButtonText>
                </Button>
            </Box>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    pinWrap: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -40,
    },
})

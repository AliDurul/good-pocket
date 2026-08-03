import { create } from 'zustand'

export type PickedLocation = {
    latitude: number
    longitude: number
    address?: string
}

interface LocationPickerState {
    /** Set by the map picker on confirm; consumed (and cleared) by the form. */
    picked: PickedLocation | null
    setPicked: (location: PickedLocation) => void
    clear: () => void
}

/**
 * Transient (non-persisted) handoff store so the full-screen map picker route
 * can return the chosen point back to the register form, which lives on a
 * different screen. The form reads `picked` once, applies it, then `clear()`s.
 */
const useLocationPickerStore = create<LocationPickerState>((set) => ({
    picked: null,
    setPicked: (location) => set({ picked: location }),
    clear: () => set({ picked: null }),
}))

export default useLocationPickerStore

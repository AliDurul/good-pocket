import { create } from 'zustand'
import type { ScanConfirmation } from '@/features/scan/types'

interface ScanResultState {
    /** Set by the scanner on a successful confirmation; consumed (and cleared) by the confirmation screen. */
    result: ScanConfirmation | null
    setResult: (result: ScanConfirmation) => void
    clear: () => void
}

/**
 * Transient (non-persisted) handoff store, mirroring `locationPickerStore`. The
 * confirmation payload carries the whole receipt, which is far too much to push
 * through a query string, so the scanner sets it here and the confirmation screen
 * reads it once and `clear()`s on unmount.
 *
 * Not persisted on purpose: a celebration replayed on next launch would be wrong.
 */
const useScanResultStore = create<ScanResultState>((set) => ({
    result: null,
    setResult: (result) => set({ result }),
    clear: () => set({ result: null }),
}))

export default useScanResultStore

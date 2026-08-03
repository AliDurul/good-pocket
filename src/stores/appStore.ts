import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getItem, setItem, deleteItemAsync } from 'expo-secure-store';

interface AppState {
    onboardingCompleted: boolean;
    setOnboardingCompleted: (completed: boolean) => void;
}

const useAppStore = create(
    persist<AppState>(
        (set) => ({
            onboardingCompleted: false,
            setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
        }),
        {
            name: 'app-store',
            storage: createJSONStorage(() => ({
                getItem,
                setItem,
                removeItem: deleteItemAsync,
            })),
        }
    )
);

export default useAppStore;
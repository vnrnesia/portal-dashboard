import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OnboardingData {
    program?: string;
    country?: string;
    city?: string;
    budget?: string;
    language?: string;
    startDate?: string;
    gpa?: string;
    rawInput?: string;
}

interface OnboardingState {
    currentStep: number;
    data: OnboardingData;
    setStep: (step: number) => void;
    setData: (data: Partial<OnboardingData>) => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            currentStep: 0,
            data: {},
            setStep: (step) => set({ currentStep: step }),
            setData: (updates) =>
                set((state) => ({ data: { ...state.data, ...updates } })),
            nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
            prevStep: () =>
                set((state) => ({
                    currentStep: Math.max(0, state.currentStep - 1),
                })),
            reset: () => set({ currentStep: 0, data: {} }),
        }),
        {
            name: 'onboarding-storage',
        }
    )
);

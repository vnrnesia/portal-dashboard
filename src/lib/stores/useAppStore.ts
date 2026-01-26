import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Program } from '../data/programs';

interface AppState {
    selectedProgram: Program | null;
    compareList: Program[];
    selectProgram: (program: Program) => void;
    addToCompare: (program: Program) => void;
    removeFromCompare: (programId: string) => void;
    clearSelection: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            selectedProgram: null,
            compareList: [],
            selectProgram: (program) => set({ selectedProgram: program }),
            addToCompare: (program) =>
                set((state) => {
                    if (state.compareList.find((p) => p.id === program.id)) return state;
                    if (state.compareList.length >= 3) return state; // Max 3
                    return { compareList: [...state.compareList, program] };
                }),
            removeFromCompare: (programId) =>
                set((state) => ({
                    compareList: state.compareList.filter((p) => p.id !== programId),
                })),
            clearSelection: () => set({ selectedProgram: null }),
        }),
        {
            name: 'app-storage',
        }
    )
);

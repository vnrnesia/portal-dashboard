import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum FunnelStep {
    REGISTER = 1,
    PROGRAM_SELECTION = 2,
    DOCUMENTS_UPLOAD = 3,
    CONTRACT_APPROVAL = 4,
    TRANSLATION_DOCS = 5,
    UNIVERSITY_APPLICATION = 6,
    INVITATION_LETTER = 7,
    VISA_PROCESS = 8,
    FLIGHT_TICKET = 9,
}

interface FunnelState {
    currentStep: FunnelStep;
    setStep: (step: FunnelStep) => void;
    completeStep: () => void;
    resetFunnel: () => void;
}

export const useFunnelStore = create<FunnelState>()(
    persist(
        (set, get) => ({
            currentStep: FunnelStep.PROGRAM_SELECTION, // Default start point for demo
            setStep: (step) => set({ currentStep: step }),
            completeStep: () => {
                const current = get().currentStep;
                if (current < FunnelStep.FLIGHT_TICKET) {
                    set({ currentStep: current + 1 });
                }
            },
            resetFunnel: () => set({ currentStep: FunnelStep.REGISTER }),
        }),
        {
            name: 'funnel-storage',
        }
    )
);

export const FUNNEL_STEPS = [
    { id: FunnelStep.REGISTER, label: "Kayıt Ol", path: "/register" },
    { id: FunnelStep.PROGRAM_SELECTION, label: "Program Seçimi", path: "/programs" },
    { id: FunnelStep.DOCUMENTS_UPLOAD, label: "Evrak Yükleme", path: "/documents" },
    { id: FunnelStep.CONTRACT_APPROVAL, label: "Sözleşme", path: "/contract" },
    { id: FunnelStep.TRANSLATION_DOCS, label: "Tercüme Evrakları", path: "/translation" },
    { id: FunnelStep.UNIVERSITY_APPLICATION, label: "Başvuru Durumu", path: "/application-status" },
    { id: FunnelStep.INVITATION_LETTER, label: "Kabul Mektubu", path: "/invitation" },
    { id: FunnelStep.VISA_PROCESS, label: "Vize & Adres", path: "/visa" },
    { id: FunnelStep.FLIGHT_TICKET, label: "Uçak Bileti", path: "/flight" },
];

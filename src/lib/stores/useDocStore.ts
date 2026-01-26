import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DocStatus = 'pending' | 'uploaded' | 'reviewing' | 'approved' | 'rejected';

export interface Document {
    id: string;
    type: string;
    label: string;
    status: DocStatus;
    fileName?: string;
    fileUrl?: string; // Mock URL
    rejectionReason?: string;
    validationError?: boolean; // New field for red ring
}

interface DocState {
    documents: Document[];
    updateStatus: (id: string, status: DocStatus, fileName?: string, fileUrl?: string) => void;
    removeDocument: (id: string) => void;
    setValidationError: (id: string, hasError: boolean) => void;
    initializeDocs: () => void;
}

const INITIAL_DOCS: Document[] = [
    { id: '1', type: 'passport', label: 'Pasaport / Kimlik', status: 'pending' },
    { id: '2', type: 'diploma', label: 'Lise Diploması', status: 'pending' },
    { id: '3', type: 'transcript', label: 'Transkript (Not Dökümü)', status: 'pending' },
    { id: '4', type: 'photo', label: 'Biometrik Fotoğraf', status: 'pending' },
    { id: '5', type: 'language', label: 'Dil Yeterlilik Belgesi', status: 'pending' },
];

export const useDocStore = create<DocState>()(
    persist(
        (set, get) => ({
            documents: INITIAL_DOCS,
            updateStatus: (id, status, fileName, fileUrl) =>
                set((state) => ({
                    documents: state.documents.map((doc) =>
                        doc.id === id ? { ...doc, status, fileName, fileUrl, validationError: false } : doc
                    ),
                })),
            removeDocument: (id) =>
                set((state) => ({
                    documents: state.documents.map((doc) =>
                        doc.id === id ? { ...doc, status: 'pending', fileName: undefined, fileUrl: undefined, validationError: false } : doc
                    ),
                })),
            setValidationError: (id, hasError) =>
                set((state) => ({
                    documents: state.documents.map((doc) =>
                        doc.id === id ? { ...doc, validationError: hasError } : doc
                    ),
                })),
            initializeDocs: () => {
                // Reset or init if empty
                const state = get();
                if (state.documents.length === 0) set({ documents: INITIAL_DOCS });
            }
        }),
        {
            name: 'doc-storage',
        }
    )
);

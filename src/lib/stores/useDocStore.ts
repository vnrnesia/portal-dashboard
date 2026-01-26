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
    { id: '6', type: 'signed_contract', label: 'İmzalı Sözleşme', status: 'pending' },
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
                const state = get();
                // 1. If empty, just set valid defaults
                if (state.documents.length === 0) {
                    set({ documents: INITIAL_DOCS });
                    return;
                }

                // 2. If not empty, check if we are missing any new required docs (like signed_contract)
                const existingIds = new Set(state.documents.map(d => d.id));
                const missingDocs = INITIAL_DOCS.filter(d => !existingIds.has(d.id));

                if (missingDocs.length > 0) {
                    set((state) => ({
                        documents: [...state.documents, ...missingDocs]
                    }));
                }
            }
        }),
        {
            name: 'doc-storage',
        }
    )
);

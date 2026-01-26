import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
    id: string;
    sender: 'student' | 'admin';
    text: string;
    timestamp: string;
}

interface MessageState {
    messages: Message[];
    sendMessage: (text: string) => void;
}

const INITIAL_MESSAGES: Message[] = [
    { id: '1', sender: 'admin', text: 'Merhaba! Başvurunuzla ilgili bir sorunuz varsa ben buradayım.', timestamp: '10:00' },
    { id: '2', sender: 'admin', text: 'Evraklarınızı inceledim, pasaportunuzun süresine dikkat edin lütfen.', timestamp: '10:05' },
];

export const useMessageStore = create<MessageState>()(
    persist(
        (set) => ({
            messages: INITIAL_MESSAGES,
            sendMessage: (text) =>
                set((state) => ({
                    messages: [
                        ...state.messages,
                        {
                            id: Date.now().toString(),
                            sender: 'student',
                            text,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        },
                    ],
                })),
        }),
        {
            name: 'message-storage',
        }
    )
);

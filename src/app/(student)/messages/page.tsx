"use client";

import { ChatWindow } from "@/components/messaging/ChatWindow";

export default function MessagesPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Mesajlarım</h1>
                <p className="text-gray-500">Danışmanınızla buradan iletişime geçebilirsiniz.</p>
            </div>
            <ChatWindow />
        </div>
    );
}

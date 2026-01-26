"use client";

import { useState, useRef, useEffect } from "react";
import { useMessageStore } from "@/lib/stores/useMessageStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatWindow() {
    const { messages, sendMessage } = useMessageStore();
    const [text, setText] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = () => {
        if (!text.trim()) return;
        sendMessage(text);
        setText("");
    };

    return (
        <div className="flex flex-col h-[600px] border rounded-xl bg-gray-50 overflow-hidden shadow-sm">
            <div className="bg-white p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-primary font-bold">
                        A
                    </div>
                    <div>
                        <h3 className="font-bold">Öğrenci İşleri</h3>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 block"></span>
                            Çevrimiçi
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex flex-col max-w-[80%]",
                            msg.sender === "student" ? "ml-auto items-end" : "mr-auto items-start"
                        )}
                    >
                        <div
                            className={cn(
                                "p-3 rounded-2xl text-sm",
                                msg.sender === "student"
                                    ? "bg-primary text-white rounded-tr-none"
                                    : "bg-white border text-gray-800 rounded-tl-none"
                            )}
                        >
                            {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                            {msg.timestamp}
                        </span>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-white border-t flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-400">
                    <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 border-gray-200"
                />
                <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-primary/90">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

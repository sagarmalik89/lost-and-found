// src/components/chat/Chat.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

// Adjust these env vars in .env
const PUSHER_APP_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY as string;
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string;

type Message = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
};

export default function Chat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // Initialise Pusher client (browser SDK)
  useEffect(() => {
    // Lazy‑load the pusher-js library to avoid SSR issues
    import("pusher-js").then((Pusher) => {
      const pusher = new Pusher.default(PUSHER_APP_KEY, {
        cluster: PUSHER_CLUSTER,
        forceTLS: true,
      });
      const channel = pusher.subscribe(`presence-room-${roomId}`);
      channel.bind("new-message", (data: Message) => {
        setMessages((prev) => [...prev, data]);
      });
      return () => {
        channel.unbind_all();
        pusher.unsubscribe(`presence-room-${roomId}`);
        pusher.disconnect();
      };
    });
  }, [roomId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, content: input.trim() }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setInput("");
    } catch (err) {
      toast({ title: "Error", description: "Could not send message" });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Room {roomId}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto border rounded p-2 mb-4 bg-muted">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <span className="font-medium">{msg.userId}:</span> {msg.content}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="Type a message…"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}

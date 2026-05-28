// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { pusherServer } from "@/src/lib/pusher";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { roomId, content } = await request.json() as { roomId: string; content: string };
    if (!roomId || !content?.trim()) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Get sender's ID
    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true },
    });

    if (!sender) {
      return NextResponse.json({ error: "Sender user not found" }, { status: 404 });
    }

    // Design: roomId represents the receiver's user ID for 1-to-1 chat.
    // Let's verify if the receiver exists.
    const receiver = await prisma.user.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    let savedMessage = null;

    if (receiver) {
      // If the roomId corresponds to an existing user, save message to DB
      savedMessage = await prisma.message.create({
        data: {
          senderId: sender.id,
          receiverId: receiver.id,
          content: content.trim(),
        },
      });
    }

    const eventData = {
      id: savedMessage?.id || Math.random().toString(36).substring(7),
      userId: sender.name || session.user.email,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    // Broadcast the message via Pusher to the channel
    await pusherServer.trigger(`presence-room-${roomId}`, "new-message", eventData);

    return NextResponse.json({ success: true, message: eventData });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { authOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/src/lib/prisma";

type UserRole = "USER" | "MODERATOR" | "ADMIN";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const role = (session.user as any).role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const role = (session.user as any).role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, newRole } = await request.json() as { userId: string; newRole: UserRole };
  if (!userId || !newRole) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: { id: true, email: true, role: true },
  });

  return NextResponse.json(updated);
}

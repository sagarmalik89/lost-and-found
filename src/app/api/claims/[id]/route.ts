// src/app/api/claims/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { pusherServer } from "@/src/lib/pusher";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Role-based Access Control
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || (user.role !== "MODERATOR" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await request.json() as { status: "APPROVED" | "REJECTED" };
    if (!status || (status !== "APPROVED" && status !== "REJECTED")) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    // Retrieve the claim
    const claim = await prisma.claim.findUnique({
      where: { id },
      include: { document: true },
    });

    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    // Update claim status
    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: { status },
    });

    // If claim is approved, mark the related document as CLAIMED
    if (status === "APPROVED") {
      await prisma.document.update({
        where: { id: claim.documentId },
        data: { status: "CLAIMED" },
      });
    }

    // Trigger Pusher notification to the claimant channel
    await pusherServer.trigger(`private-user-${claim.claimantId}`, "claim-updated", {
      claimId: claim.id,
      status,
      documentType: claim.document.type,
    });

    return NextResponse.json({ success: true, claim: updatedClaim });
  } catch (error: any) {
    console.error("Claim update error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

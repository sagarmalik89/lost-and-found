// src/app/api/claims/route.ts
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { uploadImage } from "@/src/lib/cloudinary";
import { z } from "zod";

// Validation schema for claim submission
const claimSchema = z.object({
  documentId: z.string().cuid(),
  proofFile: z.instanceof(File), // multipart form file
  verificationAnswers: z.record(z.string(), z.string()) // arbitrary Q&A
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const form = await req.formData();
  const documentId = form.get("documentId") as string;
  const proofFile = form.get("proof") as File;
  const verificationAnswersJson = form.get("verificationAnswers") as string;

  // Basic field validation
  const parsed = claimSchema.safeParse({
    documentId,
    proofFile,
    verificationAnswers: JSON.parse(verificationAnswersJson || "{}")
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
  }

  // Upload proof image to Cloudinary
  const proofBuffer = Buffer.from(await proofFile.arrayBuffer());
  const proofUrl = await uploadImage(proofBuffer, "lost-found/claims/proof");

  // Create claim record
  const claim = await prisma.claim.create({
    data: {
      documentId,
      claimantId: (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id ?? "",
      proofUrl,
      status: "PENDING",
    },
  });

  // Store verification answers as a JSON string in a separate table if needed (omitted for brevity)

  return NextResponse.json({ success: true, claim });
}

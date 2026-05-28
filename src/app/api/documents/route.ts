// src/app/api/documents/route.ts
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { uploadImage } from "@/src/lib/cloudinary";
import { extractAndMask } from "@/src/lib/ocr";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { z } from "zod";

// Input validation schema for the textual fields
const documentSchema = z.object({
  type: z.string().min(1),
  holderPartial: z.string().optional(),
  lastFourDigits: z.string().length(4).optional(),
  locationFound: z.string().optional(),
  dateFound: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  // Ensure the user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  // Parse multipart/form-data
  const form = await req.formData();
  const file = form.get("image") as File;
  if (!file) {
    return NextResponse.json({ error: "Image file is required" }, { status: 400 });
  }

  // Validate textual fields
  const parsed = documentSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
  }
  const data = parsed.data;

  // Convert the uploaded file to a Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // 1️⃣ Upload the original image (kept for audit purposes)
  const originalUrl = await uploadImage(buffer, "lost-found/original");

  // 2️⃣ Run OCR and mask sensitive data
  const { text: ocrText, maskedImageUrl } = await extractAndMask(buffer, false);

  // 3️⃣ Find the uploader user record
  const uploader = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!uploader) {
    return NextResponse.json({ error: "Uploader not found" }, { status: 404 });
  }

  // 4️⃣ Persist the document record
  const document = await prisma.document.create({
    data: {
      type: data.type,
      holderPartial: data.holderPartial,
      lastFourDigits: data.lastFourDigits,
      locationFound: data.locationFound,
      dateFound: data.dateFound ? new Date(data.dateFound) : undefined,
      description: data.description,
      originalImageUrl: originalUrl,
      maskedImageUrl,
      ocrText,
      uploaderId: uploader.id,
    },
  });

  return NextResponse.json({ success: true, document });
}

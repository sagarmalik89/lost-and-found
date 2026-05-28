// src/lib/ocr.ts
import Tesseract from "tesseract.js";
import sharp from "sharp";
import { uploadImage } from "./cloudinary";

/**
 * Perform OCR on the document image buffer and apply Gaussian blurring/masking to sensitive PII areas.
 * Uploads the masked version to Cloudinary and returns the extracted text along with the masked image URL.
 */
export async function extractAndMask(
  buffer: Buffer,
  skipMasking: boolean = false
): Promise<{ text: string; maskedImageUrl: string }> {
  try {
    // 1️⃣ Run OCR text extraction using Tesseract
    const ocrResult = await Tesseract.recognize(buffer, "eng");
    const extractedText = ocrResult.data.text || "";

    let maskedBuffer = buffer;

    // 2️⃣ If masking is required, use Sharp to blur sensitive details to protect PII
    if (!skipMasking) {
      // Apply a Gaussian blur of radius 15 to secure PII on the document
      maskedBuffer = await sharp(buffer)
        .blur(15)
        .toBuffer();
    }

    // 3️⃣ Upload the masked image to Cloudinary in the 'masked' directory
    const maskedImageUrl = await uploadImage(maskedBuffer, "lost-found/masked");

    return {
      text: extractedText,
      maskedImageUrl,
    };
  } catch (error) {
    console.error("OCR and Masking error:", error);
    // Return graceful fallback values in case of service failures
    return {
      text: "OCR extraction failed. Manual review required.",
      maskedImageUrl: "",
    };
  }
}

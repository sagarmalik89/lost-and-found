// src/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image buffer to Cloudinary.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadImage(buffer: Buffer, folder: string = "lost-found") {
  const result = await cloudinary.uploader.upload_stream(
    { folder },
    (error, result) => {
      if (error) throw error;
      return result;
    }
  );
  // Using a promise wrapper for the stream API
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url ?? "");
      }
    );
    stream.end(buffer);
  });
}

/**
 * Delete an image by its public ID.
 */
export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

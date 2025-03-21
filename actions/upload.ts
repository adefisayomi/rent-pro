"use server";

import {bucket} from '@/utils/firebaseAdmin'

type ImageResponse = {
  success: boolean;
  data: any;
  message: string | null;
};


/**
 * Upload a single image using Firebase Admin SDK.
 */
export async function uploadSingleImage(file: File, userId: string): Promise<ImageResponse> {
  try {
    if (!file) throw new Error("Image file not found");
    if (!userId) throw new Error("Login to continue");

    const fileName = `profile_images/${userId}/${Date.now()}_${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    const uploadedFile = bucket.file(fileName);
    await uploadedFile.save(Buffer.from(fileBuffer), { contentType: file.type });

    // Generate a signed URL for access
    const [url] = await uploadedFile.getSignedUrl({ action: "read", expires: "03-01-2030" });

    return { success: true, data: url, message: "Upload successful" };
  } catch (error: any) {
    return { success: false, message: error.message, data: null };
  }
}

/**
 * Upload multiple images using Firebase Admin SDK.
 */
export async function uploadMultipleImages(files: File[], userId: string): Promise<ImageResponse> {
  try {
    if (!files || files.length === 0) throw new Error("No image files found");
    if (!userId) throw new Error("Login to continue");

    const uploadPromises = files.map(async (file, index) => {
      const fileName = `property_images/${userId}/${Date.now()}_${index}_${file.name}`;
      const fileBuffer = await file.arrayBuffer();

      const uploadedFile = bucket.file(fileName);
      await uploadedFile.save(Buffer.from(fileBuffer), { contentType: file.type });

      // Generate signed URL
      const [url] = await uploadedFile.getSignedUrl({ action: "read", expires: "03-01-2030" });
      return url;
    });

    const downloadURLs = await Promise.all(uploadPromises);

    return { success: true, data: downloadURLs, message: "Upload successful" };
  } catch (error: any) {
    return { success: false, message: error.message, data: null };
  }
}

/**
 * Delete an image from Firebase Storage using Firebase Admin SDK.
 */
export async function deleteSingleImage(filePath: string): Promise<ImageResponse> {
  try {
    if (!filePath) throw new Error("No image file provided");

    const file = bucket.file(filePath);
    await file.delete();

    return { success: true, message: "Image successfully deleted", data: null };
  } catch (error: any) {
    return { success: false, message: error.message, data: null };
  }
}

/**
 * Upload an image from a URL using Firebase Admin SDK.
 */
export async function uploadSingleImageFromUrl(imageUrl: string, userId: string): Promise<ImageResponse> {
  try {
    if (!imageUrl) throw new Error("No image file URL provided");
    if (!userId) throw new Error("Login to continue");

    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();

    const fileName = `property_images/${userId}/${Date.now()}_uploaded.jpg`;
    const uploadedFile = bucket.file(fileName);
    await uploadedFile.save(Buffer.from(imageBuffer), { contentType: "image/jpeg" });

    // Generate signed URL
    const [url] = await uploadedFile.getSignedUrl({ action: "read", expires: "03-01-2030" });

    return { success: true, data: url, message: "Upload successful" };
  } catch (error: any) {
    return { success: false, message: error.message, data: null };
  }
}

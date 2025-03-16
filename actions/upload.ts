"use server";

import { adminAuth } from "@/utils/firebaseAdmin";
import { storage, images_key } from "../config";
import { errorMessage } from "../constants";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';



type ImageResponse = {
  success: boolean;
  data: File | string | null;
  message: string | null;
}
// ------------------------------

export async function uploadSingleImage(file: File, userId: string) {
  try {
    if (!file) throw new Error("Image file not found");
    if (!userId) throw new Error("Login to continue");

    const storageRef = ref(storage, `profile_images/${userId}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Wait for the upload to complete and get the download URL
    const downloadURL = await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null, // Progress tracking (optional)
        (error) => reject(new Error(error.message)), // Handle errors
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (error) {
            reject(new Error("Failed to get download URL"));
          }
        }
      );
    });
    return {
      success: true,
      data: downloadURL,
      message: "Upload successful",
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}


export async function deleteSingleImage(url: string): Promise<ImageResponse> {
  try {
    if (!url) throw new Error('No image file.');
    const desertRef = ref(storage, url);

    await deleteObject(desertRef);
    return {
      success: true,
      message: 'Image successfully deleted',
      data: null
    };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

export async function uploadSingleImageFromUrl(url: string, userId: string): Promise<ImageResponse> {
  try {
    if (!url) throw new Error('No image file.');
    if (!userId) throw new Error("Login to continue");

    const response = await fetch(url);
    const imageBlob = await response.blob();

    const storageRef = ref(storage, `${images_key}/${userId}`);
    const uploadTask = uploadBytesResumable(storageRef, imageBlob);

    const downloadURL = await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(new Error(error.message));
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (error) {
            reject(new Error("Failed to get download URL"));
          }
        }
      );
    });

    return {
      success: true,
      data: downloadURL,
      message: "Upload successful"
    };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

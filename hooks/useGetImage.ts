import { storage, images_key } from "../config";
import { errorMessage } from "../constants";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

// Improved TypeScript Types
type ImageResponse = {
  success: boolean;
  data: File | string | null;
  message: string | null;
}

// Improved error handling and type safety for image upload and deletion functions
export function getSingleImage(e: React.ChangeEvent<HTMLInputElement>) {
  try {
    const imageData = e.target.files?.[0];
    if (imageData && imageData.type.startsWith('image/')) {
      return {
        success: true,
        data: imageData,
        message: null
      };
    } else {
      throw new Error('Only images are supported');
    }
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

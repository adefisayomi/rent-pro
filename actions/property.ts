"use server";


import { errorMessage, propertyKey } from "@/constants";
import { adminDB } from "@/utils/firebaseAdmin";
import { newPropertyKeys, NewPropertySchemaType } from "@/sections/dashboard/formSchemas";
import { extractAllowedKeys } from "@/utils/extractAllowedKeys";
import { currUser } from "./auth";
import { uploadMultipleImages } from "./upload";
import { revalidatePath } from "next/cache";
import Routes from "@/Routes";
import _ from "lodash";
import sharp from 'sharp'
import path from "path";


export async function updateProperty(propertyId: string, payload: Partial<NewPropertySchemaType>) {
  try {
    if (!propertyId || typeof propertyId !== "string") {
      throw new Error("Invalid property ID");
    }

    const { data: user, message, success } = await currUser();
    if (!success || !user?.uid) throw new Error(message || "Unauthorized request");

    // Reference to the property document
    const propertyRef = adminDB.collection(propertyKey).doc(propertyId);
    const propertySnap = await propertyRef.get();

    if (!propertySnap.exists) {
      throw new Error("Property not found");
    }

    const existingProperty = propertySnap.data();

    // Ensure the current user owns the property
    if (existingProperty?.userId !== user.uid) {
      throw new Error("Unauthorized to update this property");
    }

    // Extract only allowed fields
    const data = extractAllowedKeys<Partial<NewPropertySchemaType>>(payload, newPropertyKeys);

    let updatedImages: string[] = existingProperty.images || [];

    if (Array.isArray(data.images) && data.images.length > 0) {
      const newImageFiles = data.images.filter((img): img is File => img instanceof File);
      const existingImageUrls = data.images.filter((img): img is string => typeof img === "string");

      if (newImageFiles.length > 0) {
        const res = await uploadMultipleImages(newImageFiles, user.uid);
        if (!res.success) throw new Error(res?.message!);
        updatedImages = [...existingImageUrls, ...res.data]; // Keep existing URLs and add new ones
      } else {
        updatedImages = existingImageUrls; // No new files, keep existing URLs
      }
    }

    // Update the property document
    await propertyRef.update({
      ...data,
      updatedAt: new Date(),
      images: updatedImages, // Preserve and update images
    });

    return { success: true, message: "Property updated successfully" };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}




export async function createNewProperty(payload: NewPropertySchemaType) {
    try {
      const { data: user, message, success } = await currUser();
      if (!success || !user?.uid) throw new Error(message || "Unauthorized request");
  
      // Reference to the properties collection
      const propertiesRef = adminDB.collection(propertyKey);
  
      // Extract only allowed fields
      const data = extractAllowedKeys<NewPropertySchemaType>(payload, newPropertyKeys);
  
      let uploadedImages: string[] = [];
  
      if (Array.isArray(data.images) && data.images.length > 0) {
        const imageFiles = data.images.filter((img) => img instanceof File) as File[];
  
        if (imageFiles.length > 0) {
          const res = await uploadMultipleImages(imageFiles, user.uid);
          if (!res.success) throw new Error(res?.message!);
          uploadedImages = res.data ?? []; // Ensure it's always an array
        }
      }
  
      // Create a new document with an auto-generated ID
      const newPropertyRef = propertiesRef.doc();
  
      // Save property data
      await newPropertyRef.set({
        ...data,
        createdAt: new Date(),
        images: uploadedImages, // Now guaranteed to be an array
        userId: user.uid,
      });
  
      return { success: true, message: "Property created successfully", data: { id: newPropertyRef.id } };
    } catch (err: any) {
      return errorMessage(err.message);
    }
    finally {
      revalidatePath("/")
    }
  }
  
  export async function getPropertyById(propertyId: string) {
    try {
      const propertyRef = adminDB.collection(propertyKey).doc(propertyId);
      const propertySnapshot = await propertyRef.get();
  
      if (!propertySnapshot.exists) {
        throw new Error("Property not found");
      }
  
      let propertyData = propertySnapshot.data();
  
      // Convert Firestore timestamps to ISO strings
      if (propertyData) {
        propertyData = JSON.parse(
          JSON.stringify(propertyData, (key, value) => {
            return value?._seconds !== undefined && value?._nanoseconds !== undefined
              ? new Date(value._seconds * 1000).toISOString()
              : value;
          })
        );
      }
  
      return { success: true, data: propertyData };
    } catch (err: any) {
      return errorMessage(err.message);
    }
  }
  

export async function getPropertyByUserId(userId: string) {
    try {
      const propertiesRef = adminDB.collection(propertyKey);
      const querySnapshot = await propertiesRef.where("userId", "==", userId).get();
  
      if (querySnapshot.empty) {
        return { success: false, message: "No properties found for this user" };
      }
  
      const properties = querySnapshot.docs.map(doc => doc.data());
      return { success: true, data: properties };
    } catch (err: any) {
      return errorMessage(err.message);
    }
  }

  export async function getCurrentUserProperties() {
    try {
      const { data: user, message, success } = await currUser();
      if (!success || !user?.uid) throw new Error(message || "Unauthorized request");
  
      const propertiesRef = adminDB.collection(propertyKey);
      const querySnapshot = await propertiesRef.where("userId", "==", user.uid).get();
  
      if (querySnapshot.empty) {
        return { success: false, message: "No properties found for this user" };
      }
  
      const properties = querySnapshot.docs.map((doc) => {
        const data = doc.data();
  
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || null,
          updatedAt: data.updatedAt?.toDate().toISOString() || null,
        };
      });
  
      return { success: true, data: properties };
    } catch (err: any) {
      return errorMessage(err.message);
    }
  }
  
  
  

export async function deleteProperty(propertyId: string) {
    try {
      const { data: user, message, success } = await currUser();
      if (!success || !user?.uid) throw new Error(message || "Unauthorized request");
  
      const propertyRef = adminDB.collection(propertyKey).doc(propertyId);
      const propertySnapshot = await propertyRef.get();
  
      if (!propertySnapshot.exists) {
        throw new Error("Property not found");
      }
  
      // Ensure the user is the owner of the property
      if (propertySnapshot.data()?.userId !== user.uid) {
        throw new Error("You are not authorized to delete this property");
      }
  
      // Delete the property document
      await propertyRef.delete();
      return { success: true, message: "Property deleted successfully" };
    } catch (err: any) {
      return errorMessage(err.message);
    }
    finally{
      revalidatePath(Routes.dashboard["professional tools"]["my properties"])
    }
  }


  export async function getAllProperties() {
    try {
      const propertiesRef = adminDB.collection(propertyKey).orderBy("createdAt", "desc");
      const querySnapshot = await propertiesRef.get();
  
      if (querySnapshot.empty) {
        return { success: false, message: "No properties found" };
      }
  
      const properties = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
          updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
        };
      });
  
      return { success: true, data: properties };
    } catch (err: any) {
      return errorMessage(err.message);
    }
  }
  



  export async function getFilteredProperties(filters: Record<string, string | undefined>) {
    try {
      let query: FirebaseFirestore.Query = adminDB.collection(propertyKey).orderBy("createdAt", "desc");
  
      // Fetch all properties from Firestore
      const querySnapshot = await query.get();
      let finalProperties: {
        id: string;
        createdAt: string | null;
        updatedAt: string | null;
        country: string;
        state: string;
        city: string;
        address: string;
        price: number;
        [key: string]: any; // Allow extra properties
      }[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
  
        return {
          id: doc.id,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
          country: data.country ?? "",
          state: data.state ?? "",
          city: data.city ?? "",
          address: data.address ?? "",
          price: Number(data.price) || 0, // Ensure price is always a number
          ...data,
        };
      });
  
      // ✅ Ensure the array is correctly structured
      if (!Array.isArray(finalProperties) || finalProperties.some((item) => typeof item !== "object")) {
        throw new Error("finalProperties is not a valid array of objects");
      }
  
      // ✅ Ensure _.filter() returns only valid objects
      finalProperties = _.filter(finalProperties, (property): property is typeof finalProperties[number] => {
        if (!property || typeof property !== "object") return false;
  
        const propertyPrice = Number(property.price);
        const minPrice = filters.min && Number(filters.min) > 0 ? Number(filters.min) : undefined;
        const maxPrice = filters.max && Number(filters.max) > 0  ? Number(filters.max) : undefined;
  
        return (
          (!filters.country || property.country?.toLowerCase().includes(filters.country!.toLowerCase())) &&
          (!filters.state || property.state?.toLowerCase().includes(filters.state!.toLowerCase())) &&
          (!filters.city || property.city?.toLowerCase().includes(filters.city!.toLowerCase())) &&
          (!filters.address || property.address?.toLowerCase().includes(filters.address!.toLowerCase())) &&
          (minPrice === undefined || propertyPrice >= minPrice) &&
          (maxPrice === undefined || propertyPrice <= maxPrice)
        );
      });
  
      return finalProperties.length > 0
        ? { success: true, data: JSON.parse(JSON.stringify(finalProperties)) }
        : { success: false, message: "No properties found" };
    } catch (err: any) {
      console.error("Error fetching filtered properties:", err);
      return { success: false, message: err.message || "An unexpected error occurred" };
    }
  }
  

  const addWatermarkToImage = async (imageBuffer: Buffer): Promise<Buffer> => {
    // Define the path to the logo inside the 'public' folder
    const logoPath = path.join(process.cwd(), 'public', 'logo-light.svg');

    // Load the watermark logo and resize it (you can adjust this as needed)
    const watermark = await sharp(logoPath)
        .resize(100, 100) // Adjust the size of the logo
        .toBuffer();

    // Apply the watermark to the original image
    return await sharp(imageBuffer)
        .composite([
            {
                input: watermark,
                gravity: 'southeast', // Position the watermark at the bottom-right corner
                blend: 'overlay', // Overlay blend for better visibility
            },
        ])
        .toBuffer();
};
"use server";


import { errorMessage, propertyKey } from "@/constants";
import { adminDB } from "@/utils/firebaseAdmin";
import { newPropertyKeys, NewPropertySchemaType } from "@/sections/dashboard/formSchemas";
import { extractAllowedKeys } from "@/utils/extractAllowedKeys";
import { currUser } from "./auth";
import { uploadMultipleImages } from "./upload";


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
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null, // Convert Timestamp
        };
      });
  
      return { success: true, data: properties };
    } catch (err: any) {
      return errorMessage(err.message);
    }
  }
  

  
  export async function getFilteredProperties(filters: Record<string, string | undefined>) {
    try {
      let propertiesRef = adminDB.collection(propertyKey).orderBy("createdAt", "desc");
  
      const conditions: [string, FirebaseFirestore.WhereFilterOp, any][] = [];
  
      if (filters.min) conditions.push(["price", ">=", Number(filters.min)]);
      if (filters.max) conditions.push(["price", "<=", Number(filters.max)]);
      if (filters.type) conditions.push(["listedIn", "==", filters.type]);
      if (filters.country) conditions.push(["country", "==", filters.country]);
      if (filters.state) conditions.push(["state", "==", filters.state]);
      if (filters.city) conditions.push(["city", "==", filters.city]);
      if (filters.bedrooms && !isNaN(Number(filters.bedrooms))) {
        conditions.push(["bedrooms", "==", Number(filters.bedrooms)]);
      }
      if (filters.propertyType) conditions.push(["type", "==", filters.propertyType]);
  
      let finalProperties: any[] = [];
  
      if (conditions.length === 0) {
        // If no filters are provided, return all properties sorted by latest
        const querySnapshot = await propertiesRef.get();
        finalProperties = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().toISOString() : null,
        }));
      } else {
        // If filters are provided, apply OR filtering logic
        let resultsSet = new Set(); // To store unique property IDs
  
        for (const [field, op, value] of conditions) {
          let querySnapshot = await propertiesRef.where(field, op, value).get();
  
          querySnapshot.forEach((doc) => {
            if (!resultsSet.has(doc.id)) {
              resultsSet.add(doc.id);
              finalProperties.push({
                ...doc.data(),
                id: doc.id,
                createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().toISOString() : null,
              });
            }
          });
        }
      }
  
      if (finalProperties.length === 0) {
        return { success: false, message: "No properties found" };
      }
  
      return { success: true, data: finalProperties };
    } catch (err: any) {
      console.error("Error fetching filtered properties:", err);
      return { success: false, message: err.message };
    }
  }
  
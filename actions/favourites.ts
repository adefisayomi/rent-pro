"use server"

import { errorMessage, favouritesKey, propertyKey } from "@/constants";
import admin, { adminDB } from "@/utils/firebaseAdmin";
import { currUser } from "./auth";
import { revalidatePath } from 'next/cache'
import Routes from "@/Routes";


export const addToFavourites = async (
    propertyId: string
  ): Promise<{ success: boolean; data: boolean }> => {
    try {
      const { data: user, message, success } = await currUser();
      if (!success || !user?.uid) throw new Error(message || "Unauthorized request");
  
      const favouritesRef = adminDB.collection(favouritesKey).doc(user.uid);
      const docSnapshot = await favouritesRef.get();
  
      if (!docSnapshot.exists) {
        // Create a new document with the propertyId
        await favouritesRef.set({ properties: [propertyId] });
        return {
          success: true,
          data: true, // Property successfully added to favourites
        };
      }
  
      const currentFavourites = docSnapshot.data()?.properties || [];
  
      if (currentFavourites.includes(propertyId)) {
        // Remove property if it already exists
        await favouritesRef.update({
          properties: admin.firestore.FieldValue.arrayRemove(propertyId),
        });
        return {
          success: true,
          data: false, // Property removed from favourites
        };
      } else {
        // Add property if it's not already a favourite
        await favouritesRef.update({
          properties: admin.firestore.FieldValue.arrayUnion(propertyId),
        });

        return {
          success: true,
          data: true, // Property added to favourites
        };
      }
    } catch (err: any) {
      console.error("Error in addToFavourites:", err.message);
      return {
        success: false,
        data: false, // Failed to add or remove property
      };
    }
    finally {
      console.log('revalidating---------')
      revalidatePath(Routes.dashboard.engagement.favourites)
    }
  };



  
  export const getUserFavourites = async () => {
    try {
      const { data: user, message, success } = await currUser();
      if (!success || !user?.uid) throw new Error(message || "Unauthorized request");
  
      const favouritesRef = adminDB.collection(favouritesKey).doc(user.uid);
      const docSnapshot = await favouritesRef.get();
  
      if (!docSnapshot.exists) {
        return {
          success: true,
          data: [],
        };
      }
  
      const propertyIds = docSnapshot.data()?.properties || [];
  
      // Fetch all property details and serialize data
      const propertyPromises = propertyIds.map(async (id: string) => {
        const propertyDoc = await adminDB.collection(propertyKey).doc(id).get();
        if (!propertyDoc.exists) return null;
  
        const propertyData = propertyDoc.data();
  
        // Attach the property ID and serialize timestamps
        const serializedData = {
          id,
          ...JSON.parse(
            JSON.stringify(propertyData, (key, value) =>
              value?.toDate ? value.toDate().toISOString() : value
            )
          ),
        };
  
        return serializedData;
      });
  
      const properties = (await Promise.all(propertyPromises)).filter(Boolean);
  
      return {
        success: true,
        data: properties,
      };
    } catch (err: any) {
      return {
        success: false,
        data: [],
        message: err.message,
      };
    }
  }
  
  
  

  export const isPropertyLoved = async (propertyId: string): Promise<boolean> => {
    try {
      const { data: user, message, success } = await currUser();
      if (!success || !user?.uid) throw new Error(message || "Unauthorized request");
  
      const favouritesRef = adminDB.collection(favouritesKey).doc(user.uid);
      const docSnapshot = await favouritesRef.get();
  
      if (!docSnapshot.exists) return false;
  
      const allFavouriteIds = docSnapshot.data()?.properties || [];
      return allFavouriteIds.includes(propertyId);
    } catch (err: any) {
      console.error("Error checking if property is loved:", err.message);
      return false;
    }
  };
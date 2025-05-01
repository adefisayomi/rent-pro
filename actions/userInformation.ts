"use server"

import { errorMessage, userKey } from "@/constants";
import { adminDB } from "@/utils/firebaseAdmin";
import { AccountinformationType } from "@/sections/dashboard/formSchemas";
import { extractAllowedKeys } from "@/utils/extractAllowedKeys";
import { currUser } from "./auth";


export async function updateUserDetails (payload: Partial<AccountinformationType>) {
   try {
     const { data: user, message, success } = await currUser();
     if (!success || !user?.uid) throw new Error(message || "Unauthorized request");
 
     const userRef = adminDB.collection(userKey).doc(user.uid);
 
     // Extract only allowed fields
     const data = extractAllowedKeys<AccountinformationType>(payload as any, ["gender", "phone", "whatsapp", "username"]);
 
     // Check if the document exists
     const doc = await userRef.get();
 
     if (doc.exists) {
       // If the document exists, update it
       await userRef.update(data);
     } else {
       // If the document doesn't exist, create it with merge
       await userRef.set({ ...data, createdAt: new Date() }, { merge: true });
     }
 
     return { success: true, message: null, data: null };
   } catch (err: any) {
     return errorMessage(err.message);
   }
}

export async function getUserDetails () {
  
      try {
        const { data: user, message, success } = await currUser();
        if (!success || !user?.uid) throw new Error(message || "Unauthorized request");
    
        const userRef = adminDB.collection(userKey).doc(user.uid);
        const doc = await userRef.get();
    
        if (!doc.exists) {
          return { success: false, message: "No data found", data: null };
        }
    
        // Convert Firestore Timestamps to JSON-friendly format
        const profession = doc.data();
        if (profession?.createdAt) {
          profession.createdAt = profession.createdAt.toDate().toISOString(); // Convert Firestore Timestamp to string
        }
    
        return { success: true, message: null, data: profession };
      } catch (err: any) {
        return errorMessage(err.message);
      }
  }
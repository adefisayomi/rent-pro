"use server"

import { errorMessage, userKey } from "@/constants";
import { adminAuth, adminDB } from "@/utils/firebaseAdmin";
import { AccountinformationType } from "@/sections/dashboard/formSchemas";
import { extractAllowedKeys } from "@/utils/extractAllowedKeys";
import { currUser } from "./auth";
import { revalidatePath } from "next/cache";
import Routes from "@/Routes";


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
   finally {
    revalidatePath(Routes.dashboard["account management"]["account information"], 'page')
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

  const REQUIRED_FIELDS = {
  auth: ["displayName", "email", "photoURL", "phoneNumber", "emailVerified"],
  firestore: ["gender", "phone", "whatsapp", "username"],
};

export async function getUserProfileCompletion() {
  try {
    const { data: user, message, success } = await currUser();
    if (!success || !user?.uid) throw new Error(message || "Unauthorized");

    const uid = user.uid;

    // 🔐 Get Firebase Auth user object
    const authUser = await adminAuth.getUser(uid);

    // 📄 Get Firestore user document
    const userSnap = await adminDB.collection(userKey).doc(uid).get();
    const firestoreUser = userSnap.exists ? userSnap.data() || {} : {};

    // 🧮 Count filled fields
    let filled = 0;
    let total = 0;

    // ✅ Check Auth fields
    for (const field of REQUIRED_FIELDS.auth) {
      total++;
      const value = (authUser as any)[field];
      if (field === "emailVerified") {
        if (value === true) filled++;
      } else if (value !== null && value !== undefined && value !== "") {
        filled++;
      }
    }

    // ✅ Check Firestore fields
    for (const field of REQUIRED_FIELDS.firestore) {
      total++;
      const value = firestoreUser[field];
      if (value !== null && value !== undefined && value !== "") {
        filled++;
      }
    }

    const completion = Math.round((filled / total) * 100);

    return {
      success: true,
      data: {
        completion,
        filledFields: filled,
        totalFields: total,
        authFields: REQUIRED_FIELDS.auth.length,
        firestoreFields: REQUIRED_FIELDS.firestore.length,
      },
      message: null,
    };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}
"use server"

import { errorMessage } from "@/constants";
import admin, { adminDB } from "@/utils/firebaseAdmin";
import { currUser } from "./auth";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { NotificationLogKey } from "@/config";


export const logUserSignIn = onCall(async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User not authenticated");
    }
    await logNotification("User Signed In");
  });


async function logNotification(activity: string) {
    try {
        const { data: user, message, success } = await currUser();
        if (!success || !user?.uid) throw new Error(message || "Unauthorized request");
            // 

        const notificationRef = adminDB.collection(NotificationLogKey).doc(user.uid);
        await notificationRef.set({
          activity,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          userId: user.uid,
        });
    }
    catch(err: any) {
        return errorMessage(err.message)
    }
}
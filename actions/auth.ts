"use server"

import { auth_token, errorMessage } from "@/constants";
import { cookies } from 'next/headers'
import { adminAuth } from "@/utils/firebaseAdmin";
import { extractAllowedKeys } from "@/utils/extractAllowedKeys";
import { revalidatePath } from "next/cache";
import Routes from "@/Routes";


export const currUser = async () => {
  try {
    const cookieStore = await cookies(); // ✅ Await the cookies
    const token = cookieStore.get(auth_token)?.value; // ✅ Extract token safely
    if (!token) throw new Error('unauthorized request!')
      // 
    const user = await adminAuth.verifySessionCookie(token); // ✅ Verify ID token
    return ({
      success: true,
      data: user,
      message: null
    })
  } catch (err: any) {
    return errorMessage(err.message)
  }
};

export async function createSessionCookie(idToken: string) {
  try {
    const expiresIn = 14 * 24 * 60 * 60 * 1000;

    // Create session cookie using Firebase Admin SDK
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set the session cookie in the user's browser
    const cookieStore = await cookies()
    cookieStore.set(auth_token, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn / 1000, // Convert to seconds
      path: "/",
    });

    return { success: true, message: "Session cookie set successfully." };
  } catch (err: any) {
    console.error("Error creating session cookie:", err.message);
    return { success: false, message: err.message };
  }
}

export async function deleteSessionCookie() {
  try {
    // Get the cookie store
    const cookieStore = await cookies();

    // Remove the session cookie
    cookieStore.set(auth_token, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    return { success: true, message: "Session cookie deleted successfully." };
  } catch (err: any) {
    console.error("Error deleting session cookie:", err.message);
    return { success: false, message: err.message };
  }
}

export const setCustomUserClaims = async (claims: {accountType: 'renter'  | 'agent'}) => {
  try {
    const { data: user, message, success } = await currUser();
    if (!success || !user?.uid) throw new Error(message || "Unauthorized request");
    // 
    const data = extractAllowedKeys<typeof claims>(claims, ["accountType"]);
    await adminAuth.setCustomUserClaims(user.uid, data);

    revalidatePath(Routes.dashboard["account management"]["account information"])
    return ({
      success: true,
      message: 'claims set',
      data: null
    }) 
  } catch (error: any) {
    return errorMessage(error.message)
  }
};

export const getCustomClaims = async () => {
  try {
    const { data: user, message, success } = await currUser();
    if (!success || !user?.uid) throw new Error(message || "Unauthorized request");
    //
    const claim = await adminAuth.getUser(user.uid);
    return ({
      success: true,
      message: 'claims set',
      data: claim.customClaims
    }) 
  } catch (error: any) {
    return errorMessage(error.message)
  }
};
"use server"

import { auth_token, errorMessage } from "@/constants";
import { cookies } from "next/headers";
import { adminAuth } from "@/utils/firebaseAdmin";
import { extractAllowedKeys } from "@/utils/extractAllowedKeys";
import { revalidatePath } from "next/cache";

export const currUser = async () => {
  try {
    const cookieStore = await cookies(); // No need for `await`
    const token = cookieStore.get(auth_token)?.value;

    if (!token) throw new Error("Unauthorized request: No session token found.");

    const user = await adminAuth.verifySessionCookie(token);
    return {
      success: true,
      data: user,
      message: null,
    };
  } catch (error) {
    return errorMessage(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
};

export const setCustomUserClaims = async (claims: { accountType: "renter" | "agent" }) => {
  try {
    const { data: user, message, success } = await currUser();
    if (!success || !user?.uid) throw new Error(message || "Unauthorized request");

    const allowedClaims = extractAllowedKeys<typeof claims>(claims, ["accountType"]);
    await adminAuth.setCustomUserClaims(user.uid, allowedClaims);

    revalidatePath("/");
    return {
      success: true,
      message: "Claims set successfully.",
      data: null,
    };
  } catch (error) {
    return errorMessage(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
};

export const getCustomClaims = async () => {
  try {
    const { data: user, message, success } = await currUser();
    if (!success || !user?.uid) throw new Error(message || "Unauthorized request");

    const userRecord = await adminAuth.getUser(user.uid);
    return {
      success: true,
      message: "Custom claims retrieved successfully.",
      data: userRecord.customClaims || {},
    };
  } catch (error) {
    return errorMessage(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
};

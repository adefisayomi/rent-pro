"use server"

import { errorMessage } from "@/constants";
import { auth, signIn, signOut } from "../auth";
import { AuthError } from "next-auth";
import Routes from "@/Routes";

export type AuthType = 'google' | 'linkedin' | 'twitter' | 'facebook';
export async function handleSocialAuth(type: AuthType) {
  try {
    await signIn(type);
  } catch (error: any) {
    if (error instanceof AuthError) {
      return errorMessage(error.message)
    }
    throw error;
  }
}


export async function authenticateWithEmail (
  prevState: string | undefined,
  formData: {email: string, password: string},
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export const currUser = async () => {
  return await auth().then(res => res?.user)
}


export async function handleSignOut() {
  try {
    await signOut({redirect: true, redirectTo: Routes.login});
  } catch (error: any) {
    if (error instanceof AuthError) {
      return errorMessage(error.message)
    }
    throw error;
  }
}

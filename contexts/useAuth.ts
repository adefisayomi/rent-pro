import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  auth,
  googleProvider,
  facebookProvider
} from "@/config";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  User as FirebaseUser,
  getAdditionalUserInfo
} from "firebase/auth";
import { auth_token } from "@/constants";
import { createSessionCookie, deleteSessionCookie } from "@/actions/auth";
import { getFirebaseError } from "@/utils/firebaseErrors";
import Routes from "@/Routes";
import useAlert from "../hooks/useAlert";

type AuthProps = {
  redirectUrl?: string | null | undefined,
  success?: boolean
}

interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  initialize: () => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<AuthProps>;
  signinWithEmail: (email: string, password: string) => Promise<AuthProps>;
  googleLogin: () => Promise<AuthProps>;
  facebookLogin: () => Promise<AuthProps>;
  sendResetPasswordLink: (email: string) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get): AuthState => {
      const { setAlert } = useAlert();

      return {
        user: null,
        loading: true,
        error: null,

        initialize: () => {
          set({ loading: true });
        },

        refreshUser: async () => {
          const user = auth.currentUser;
          if (user) {
            await user.reload(); // 🔄 Reload latest user data
            const updatedUser = auth.currentUser; // Get updated user object

            if (updatedUser) {
              set({ user: updatedUser, loading: false });
            }
          }
        },

        signinWithEmail: async (email, password) => {
          try {
            set({ loading: true, error: null });

            let userCredential;
            let isNewUser = false;

            try {
              userCredential = await signInWithEmailAndPassword(auth, email, password);
            } catch (error: any) {
              if (error.code === "auth/user-not-found") {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                isNewUser = true;
              } else {
                throw error;
              }
            }

            const user = userCredential.user;
            set({ user, loading: false });

            const token = await user.getIdToken();
            const sessionCreate = await createSessionCookie(token);
            if (!sessionCreate.success) throw new Error(sessionCreate.message);

            setAlert(isNewUser ? "Welcome to Rent-House!" : `Welcome back, ${user.displayName?.split(" ")[0] || ""}!`, "success");
            return { success: true, redirectUrl: isNewUser ? Routes.dashboard["account management"]["account information"] : "/" };

          } catch (error: any) {
            set({ user: null, loading: false, error: error.message });
            setAlert(getFirebaseError(error.code) || error.message, "error");
            return { success: false };
          }
        },

        logout: async () => {
          try {
            set({ loading: true });

            const sessionDeleted = await deleteSessionCookie();
            if (!sessionDeleted.success) throw new Error(sessionDeleted.message);

            await auth.signOut();
            set({ user: null, loading: false });

            setAlert("Have a great day.");
            return { success: true, redirectUrl: Routes.login };

          } catch (error: any) {
            set({ loading: false, error: error.message });
            setAlert(getFirebaseError(error.code) || error.message, "error");
            return { success: false };
          }
        },

        googleLogin: async () => {
          try {
            const result = await signInWithPopup(auth, googleProvider);
            const isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false;

            set({ user: result.user, error: null });

            const token = await result.user.getIdToken();
            const sessionCreate = await createSessionCookie(token);
            if (!sessionCreate.success) throw new Error(sessionCreate.message);

            setAlert(isNewUser ? "Welcome to Rent-House!" : `Welcome back, ${result.user.displayName?.split(" ")[0] || ""}!`, "success");
            return { success: true, redirectUrl: isNewUser ? Routes.dashboard["account management"]["account information"] : "/" };

          } catch (error: any) {
            set({ user: null, error: error.message });
            setAlert(getFirebaseError(error.code) || error.message, "error");
            return { success: false };
          }
        },

        facebookLogin: async () => {
          try {
            const result = await signInWithPopup(auth, facebookProvider);
            const isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false;

            set({ user: result.user, error: null });

            const token = await result.user.getIdToken();
            const sessionCreate = await createSessionCookie(token);
            if (!sessionCreate.success) throw new Error(sessionCreate.message);

            setAlert(isNewUser ? "Welcome to Rent-House!" : `Welcome back, ${result.user.displayName?.split(" ")[0] || ""}!`, "success");
            return { success: true, redirectUrl: isNewUser ? Routes.dashboard["account management"]["account information"] : "/" };

          } catch (error: any) {
            set({ user: null, error: error.message });
            setAlert(getFirebaseError(error.code) || error.message, "error");
            return { success: false };
          }
        },

        sendResetPasswordLink: async (email) => {
          try {
            await sendPasswordResetEmail(auth, email);
            setAlert(`Password reset link sent to ${email}.`, "info");
          } catch (error: any) {
            set({ error: error.message });
            setAlert(getFirebaseError(error.code) || error.message, "error");
          }
        }
      };
    },
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage), // 🔥 Optimized storage for Next.js
    }
  )
);

// ✅ Automatically update user state when Firebase auth changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await user.reload(); // 🔄 Ensure updated user data
    const updatedUser = auth.currentUser; // Get latest user object

    if (updatedUser) {
      const token = await updatedUser.getIdToken();
      await createSessionCookie(token);

      useAuthStore.setState({ user: updatedUser, loading: false, error: null });
    }
  } else {
    useAuthStore.setState({ user: null, loading: false, error: null });
    await deleteSessionCookie();
  }
});

export default useAuthStore;

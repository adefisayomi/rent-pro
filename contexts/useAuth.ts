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
import { getFirebaseError } from "@/utils/firebaseErrors";
import Routes from "@/Routes";
import useAlert from "../hooks/useAlert";
import axiosInstance from "@/utils/axiosInstance";
import { ToastType } from "@/components/CustomToast";
import Cookies from "js-cookie";


// Async session handlers
async function deleteSession() {
  return (await axiosInstance.delete("/api/auth/session", { withCredentials: true })).data as ({success: boolean, message: string, data: {}})
}

async function createSession(idToken: string) {
    return await (await axiosInstance.post(
      "/api/auth/session",
      { idToken },
      { withCredentials: true }
    )).data as ({success: boolean, message: string, data: {}})
}

async function getUserClaims() {
  try {
    const response = await axiosInstance.get("/api/auth/session", { withCredentials: true });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user claims:", error);
    return null;  // Return null to prevent crashes
  }
}

// ------------------------------------

type AuthProps = {
  redirectUrl?: string | null | undefined,
  success?: boolean
}

interface Claims extends Record<string, any> {
  accountType?: string;
}

interface AuthState {
  user: FirebaseUser | null;
  claims: Claims | null;
  loading: boolean;
  error: string | null;
  initialize: () => void;
  refreshUser: () => Promise<void>;
  logout: (setAlert: (message: string, type: ToastType) => void) => Promise<AuthProps>;
  signinWithEmail: (email: string, password: string, setAlert: (message: string, type: ToastType) => void) => Promise<AuthProps>;
  googleLogin: (setAlert: (message: string, type: ToastType) => void) => Promise<AuthProps>;
  facebookLogin: (setAlert: (message: string, type: ToastType) => void) => Promise<AuthProps>;
  sendResetPasswordLink: (email: string, setAlert: (message: string, type: ToastType) => void) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get): AuthState => {

      return {
        user: null,
        claims: null,
        loading: true,
        error: null,

        initialize: () => {
          set({ loading: true });
        },

        refreshUser: async () => {
          const user = auth.currentUser;
          if (user) {
            await user.reload();
            const updatedUser = auth.currentUser;
            if (updatedUser) {
              const claims = await getUserClaims();
              set({ user: updatedUser, claims, loading: false });
              
              if (claims?.accountType) {
                Cookies.set("accountType", claims.accountType as string, { path: "/" });
              } else {
                Cookies.remove("accountType");
              }
            }
          }
        },

        logout: async (setAlert) => {
          try {
            set({ loading: true });
            const sessionDeleted = await deleteSession();
            if (!sessionDeleted.success) throw new Error(sessionDeleted.message);
            await auth.signOut();
            set({ user: null, claims: null, loading: false });
            Cookies.remove("accountType");
            setAlert("Have a great day.", 'info');
            return { success: true, redirectUrl: Routes.login };
          } catch (error: any) {
            set({ loading: false, error: error.message });
            setAlert(getFirebaseError(error.code) || error.message, "error");
            return { success: false };
          }
        },

        signinWithEmail: async (email, password, setAlert) => {
          try {
            set({ loading: true, error: null });

            let userCredential;
            let isNewUser = false;

            try {
              userCredential = await signInWithEmailAndPassword(auth, email, password);
            } 
            catch (error: any) {
              if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                isNewUser = true;
              } else {
                throw error;
              }
            }

            const user = userCredential.user;
            set({ user, loading: false });

            const token = await user.getIdToken();
            const sessionCreate = await createSession(token);
            if (!sessionCreate.success) throw new Error(sessionCreate.message);

            setAlert(isNewUser ? "Welcome to Rent-House!" : `Welcome back, ${user.displayName?.split(" ")[0] || ""}!`, "success");
            return { success: true, redirectUrl: isNewUser ? Routes.dashboard["account management"]["account information"] : "/" };

          } catch (error: any) {
            set({ user: null, loading: false, error: error.message });
            setAlert(getFirebaseError(error.code) || error.message, "error");
            return { success: false };
          }
        },

        googleLogin: async (setAlert) => {
          try {
            const result = await signInWithPopup(auth, googleProvider);
            const isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false;

            set({ user: result.user, error: null });

            const token = await result.user.getIdToken();
            const sessionCreate = await createSession(token);
            if (!sessionCreate.success) throw new Error(sessionCreate.message);

            setAlert(isNewUser ? "Welcome to Rent-House!" : `Welcome back, ${result.user.displayName?.split(" ")[0] || ""}!`, "success");
            return { success: true, redirectUrl: isNewUser ? Routes.dashboard["account management"]["account information"] : "/" };

          } catch (error: any) {
            set({ user: null, error: error.message });
            setAlert(getFirebaseError(error.code) || error.message, "error");
            return { success: false };
          }
        },

        facebookLogin: async (setAlert) => {
          try {
            const result = await signInWithPopup(auth, facebookProvider);
            const isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false;

            set({ user: result.user, error: null });

            const token = await result.user.getIdToken();
            const sessionCreate = await createSession(token);
            if (!sessionCreate.success) throw new Error(sessionCreate.message);

            setAlert(isNewUser ? "Welcome to Rent-House!" : `Welcome back, ${result.user.displayName?.split(" ")[0] || ""}!`, "success");
            return { success: true, redirectUrl: isNewUser ? Routes.dashboard["account management"]["account information"] : "/" };

          } catch (error: any) {
            set({ user: null, error: error.message });
            setAlert(getFirebaseError(error.code) || error.message, "error");
            return { success: false };
          }
        },

        sendResetPasswordLink: async (email, setAlert) => {
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
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      await user.reload();
      const updatedUser = auth.currentUser;

      if (updatedUser) {
        const token = await updatedUser.getIdToken();
        const claims = await getUserClaims();
        await createSession(token);

        useAuthStore.setState({ user: updatedUser, claims, loading: false, error: null });

        if (claims?.accountType) {
          Cookies.set("accountType", claims.accountType as string, { path: "/" });
        } else {
          Cookies.remove("accountType");
        }
      }
    } catch (error) {
      useAuthStore.setState({ user: null, claims: null, loading: false, error: "Session error." });
      Cookies.remove("accountType");
      try { await deleteSession(); } catch (err) { console.error("Error deleting session:", err); }
    }
  } else {
    useAuthStore.setState({ user: null, claims: null, loading: false, error: null });
    Cookies.remove("accountType");
    try { await deleteSession(); } catch (err) { console.error("Error deleting session:", err); }
  }
});


export default useAuthStore;

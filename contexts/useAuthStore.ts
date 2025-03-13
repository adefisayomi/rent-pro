import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { signIn, signOut, getSession } from "next-auth/react";
import { ToastType } from "@/components/CustomToast";
import useAlert from "@/hooks/useAlert";

interface User {
  name?: string;
  email?: string;
  image?: string;
  isNewUser?: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setAlert: (message: string, type?: ToastType) => void;
  initialize: () => void;
  authenticateWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendResetPasswordLink: (email: string) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get): AuthState => {
      const { setAlert } = useAlert();

      const initialize = async () => {
        set({ loading: true });
        const session = await getSession();
        if (session?.user) {
          set({ user: session.user as User, loading: false, error: null });
        } else {
          set({ user: null, loading: false, error: null });
        }
      };

      // Run initialize automatically on store creation
      initialize();

      return {
        user: null,
        loading: true,
        error: null,
        setAlert,
        initialize,

        authenticateWithEmail: async (email, password) => {
          set({ loading: true, error: null });
          try {
            const res = await signIn("credentials", { email, password, redirect: false });
            if (res?.error) throw new Error(res.error);
            setAlert("Login successful!", "success");
            get().initialize();
          } catch (error: any) {
            set({ user: null, loading: false, error: error.message });
            setAlert(error.message, "error");
          }
        },

        logout: async () => {
          try {
            set({ loading: true });
            await signOut();
            set({ user: null, loading: false, error: null });
            window.location.href = "/signin";
          } catch (error: any) {
            set({ loading: false, error: error.message });
            setAlert(error.message, "error");
          }
        },

        loginWithGoogle: async () => {
          try {
            set({ loading: true, error: null });
            const res = await signIn("google", { redirect: false });
            if (res?.error) throw new Error(res.error);
            setAlert("Login successful!", "success");
            get().initialize();
          } catch (error: any) {
            set({ user: null, loading: false, error: error.message });
            setAlert(error.message, "error");
          }
        },

        sendResetPasswordLink: async (email) => {
          try {
            await fetch("/api/auth/reset-password", {
              method: "POST",
              body: JSON.stringify({ email }),
              headers: { "Content-Type": "application/json" },
            });
            get().setAlert(`Password reset link sent to ${email}.`, "info");
          } catch (error: any) {
            set({ loading: false, error: error.message });
            setAlert(error.message, "error");
          }
        },
      };
    },
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;

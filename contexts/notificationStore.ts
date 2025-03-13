import { create } from "zustand";
import Cookies from "js-cookie";

export type NotificationType = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  timestamp: string; // Store as string for JSON serialization
};

interface NotificationState {
  notifications: NotificationType[];
  addNotification: (message: string, type: NotificationType["type"]) => void;
  removeNotification: (id: string) => void;
}

const COOKIE_NAME = "notifications";

export const useNotificationStore = create<NotificationState>((set) => {
  // Load notifications from cookies on initialization
  const loadNotifications = () => {
    const cookieData = Cookies.get(COOKIE_NAME);
    return cookieData ? JSON.parse(cookieData) : [];
  };

  return {
    notifications: loadNotifications(),

    addNotification: (message, type) => {
      const newNotification: NotificationType = {
        id: crypto.randomUUID(),
        message,
        type,
        timestamp: new Date().toISOString(), // Store as ISO string
      };

      set((state) => {
        const updatedNotifications = [...state.notifications, newNotification];

        // Persist in cookie
        Cookies.set(COOKIE_NAME, JSON.stringify(updatedNotifications), {
          expires: 7, // Keep for 7 days
          secure: true,
          sameSite: "strict",
        });

        return { notifications: updatedNotifications };
      });
    },

    removeNotification: (id) => {
      set((state) => {
        const updatedNotifications = state.notifications.filter((n) => n.id !== id);

        // Update cookie after removal
        Cookies.set(COOKIE_NAME, JSON.stringify(updatedNotifications), {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        return { notifications: updatedNotifications };
      });
    },
  };
});

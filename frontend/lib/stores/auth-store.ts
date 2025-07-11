import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "Scrum Master" | "Developer" | "Product Owner";
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAuthChecked: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          try {
            localStorage.clear();
            sessionStorage.clear();

            document.cookie.split(";").forEach((c) => {
              const eqPos = c.indexOf("=");
              const name = eqPos > -1 ? c.substring(0, eqPos) : c;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            });

            if (window.indexedDB?.databases) {
              window.indexedDB.databases().then((databases) => {
                databases.forEach((db) => {
                  if (db.name) {
                    window.indexedDB.deleteDatabase(db.name);
                  }
                });
              });
            }

            if ("caches" in window) {
              caches.keys().then((names) => {
                names.forEach((name) => caches.delete(name));
              });
            }

            console.log("✅ All storage cleared successfully");
            window.location.href = "/login";
          } catch (error) {
            console.error("Error clearing storage:", error);
            window.location.href = "/login";
          }
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAuthChecked: true,
        });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      checkAuth: async () => {
        try {
          const response = await api.get("/me", {
            withCredentials: true,
          });

          const user = response.data;
          set({
            user,
            isAuthenticated: true,
            isAuthChecked: true,
          });
        } catch (err) {
          console.warn("❌ Not authenticated:", err);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAuthChecked: true,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/lib/api/auth";

export type UserRole =
  | "Admin"
  | "Scrum Master"
  | "Product Owner"
  | "Developer"
  | "Designer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAuthChecked: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAuthChecked: true,
        });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      checkAuth: async () => {
        const token = get().token;
        console.log("🧪 Checking token:", token);

        if (!token) {
          set({ isAuthChecked: true });
          return;
        }

        try {
          const user = await authApi.me();
          set({ user, isAuthenticated: true, isAuthChecked: true });
          console.log("✅ Token valid. Logged in as:", user.name);
        } catch (err) {
          console.error("❌ Token invalid or expired");
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
      name: "auth-storage", // key in localStorage
    }
  )
);

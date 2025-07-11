import { create } from "zustand";
import { persist } from "zustand/middleware";

// ✅ Definisi tipe peran pengguna
export type UserRole =
  | "Admin"
  | "Scrum Master"
  | "Product Owner"
  | "Developer"
  | "Designer";

// ✅ Struktur data User
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// ✅ Struktur data AuthState untuk Zustand
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => Promise<boolean>; // ✅ Tambahkan fungsi checkAuth
}

// ✅ Store untuk autentikasi dengan persist (disimpan di localStorage)
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // ✅ Fungsi login: menyimpan user dan token
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      // ✅ Fungsi logout: membersihkan semua storage dan reset state
      logout: () => {
        if (typeof window !== "undefined") {
          try {
            // 🔄 Hapus localStorage terkait aplikasi
            localStorage.removeItem("auth-storage");
            localStorage.removeItem("agileflow-app");
            localStorage.removeItem("agileflow-auth");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("token");
            localStorage.removeItem("pinnedTasks");
            localStorage.removeItem("theme");

            // 🔄 Hapus sessionStorage
            sessionStorage.clear();

            // 🔄 Hapus IndexedDB jika pakai cache (misalnya PWA)
            if (window.indexedDB) {
              indexedDB.databases?.().then((databases) => {
                databases.forEach((db) => {
                  if (db.name?.includes("sprintflow")) {
                    indexedDB.deleteDatabase(db.name);
                  }
                });
              });
            }

            // 🔄 Hapus semua cache PWA
            if ("caches" in window) {
              caches.keys().then((cacheNames) => {
                cacheNames.forEach((cacheName) => {
                  caches.delete(cacheName);
                });
              });
            }

            console.log("🧹 Semua penyimpanan berhasil dibersihkan");
          } catch (error) {
            console.error("❌ Gagal membersihkan storage:", error);
          }
        }

        // 🧼 Reset state store
        set(() => ({
          user: null,
          token: null,
          isAuthenticated: false,
        }));
      },

      // ✅ Update sebagian informasi user
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      // ✅ Fungsi checkAuth untuk memvalidasi status login
      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return false;
        }

        // 🔐 (Opsional) Validasi token ke backend bisa dilakukan di sini

        set({ isAuthenticated: true });
        return true;
      },
    }),
    {
      name: "auth-storage", // 🔐 Key di localStorage

      // ✅ (Opsional) Hook saat store direstore dari localStorage
      // onRehydrateStorage: () => (state) => {
      //   console.log("🔁 Store direstore dari localStorage:", state);
      // },
    }
  )
);

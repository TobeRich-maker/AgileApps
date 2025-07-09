"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authApi } from "../api"

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await authApi.login(email, password)
          const { user, token } = response.data

          localStorage.setItem("auth_token", token)

          set({
            user,
            token,
            isAuthenticated: true,
          })

          return true
        } catch (error) {
          console.error("Login failed:", error)
          return false
        }
      },

      register: async (name: string, email: string, password: string, role: string) => {
        try {
          const response = await authApi.register(name, email, password, role)
          const { user, token } = response.data

          localStorage.setItem("auth_token", token)

          set({
            user,
            token,
            isAuthenticated: true,
          })

          return true
        } catch (error) {
          console.error("Registration failed:", error)
          return false
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } catch (error) {
          console.error("Logout error:", error)
        } finally {
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user")

          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null })
          return
        }

        try {
          const response = await authApi.me()
          set({
            user: response.data,
            token,
            isAuthenticated: true,
          })
        } catch (error) {
          localStorage.removeItem("auth_token")
          set({ isAuthenticated: false, user: null, token: null })
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
    },
  ),
)

"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Sidebar } from "./sidebar"
import { CommandPalette, useCommandPalette } from "@/components/ui/command-palette"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const { open, setOpen } = useCommandPalette()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="py-6 px-4 lg:px-8">{children}</main>
      </div>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </div>
  )
}

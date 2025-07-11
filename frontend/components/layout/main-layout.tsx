"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Sidebar } from "./sidebar";
import {
  CommandPalette,
  useCommandPalette,
} from "@/components/ui/command-palette";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated, isAuthChecked, user } = useAuthStore();
  const router = useRouter();
  const { open, setOpen } = useCommandPalette();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Redirect only after auth check completed
    if (isAuthChecked && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isAuthChecked, router]);

  // Show loading or redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">SF</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">SF</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // 🚫 If already checked and not authenticated
  if (!isAuthenticated || !user) {
    return null; // biarkan router.push menghandle
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="py-6 px-4 lg:px-8">{children}</main>
      </div>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </div>
  );
}

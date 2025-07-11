// lib/hoc/withAuthProtection.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export function withAuthProtection<P extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, checkAuth } = useAuthStore();
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const router = useRouter();

    useEffect(() => {
      checkAuth().finally(() => setIsAuthChecked(true));
    }, [checkAuth]);

    useEffect(() => {
      if (isAuthChecked && !isAuthenticated) {
        router.push("/auth/login");
      }
    }, [isAuthChecked, isAuthenticated, router]);

    if (!isAuthChecked) return null;

    return <Component {...props} />;
  };
}

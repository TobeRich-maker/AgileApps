"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { EnhancedDashboard } from "@/components/dashboard/enhanced-dashboard";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, KanbanSquare, BarChart3, LogOut } from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: true,
    },
    {
      name: "Kanban Board",
      href: "/dashboard/kanban",
      icon: KanbanSquare,
      current: false,
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
      current: false,
    },
  ];

  if (!isAuthenticated || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-blue-600">
                SprintFlow
              </h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.current
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <span className="text-sm text-gray-500 capitalize">
                ({user.role.replace("_", " ")})
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <EnhancedDashboard />
        </div>
      </main>
    </div>
  );
}

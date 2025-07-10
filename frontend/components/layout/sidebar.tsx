"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { NotificationBell } from "@/components/ui/notification-bell"
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Target,
  MessageSquare,
  Clock,
  Globe,
  Tag,
  FileIcon as FileTemplate,
  Activity,
  Search,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/stores/auth-store"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Work", href: "/my-work", icon: Target },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Kanban", href: "/kanban", icon: FolderKanban },
  { name: "Sprints", href: "/sprints", icon: Target },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Chat", href: "/chat", icon: MessageSquare, badge: "3" },
  { name: "Templates", href: "/templates", icon: FileTemplate },
  { name: "Tags", href: "/tags", icon: Tag },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Audit Log", href: "/audit-log", icon: Clock },
  { name: "Retrospective", href: "/retrospective", icon: MessageSquare },
]

const adminNavigation = [
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Roles", href: "/dashboard/roles", icon: Settings },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const isAdmin = user?.role === "Admin"

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-navy-600 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-navy-900 dark:text-navy-100">SprintFlow</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-300">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.role || "Member"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* Search */}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
            collapsed ? "px-2" : "px-3",
          )}
        >
          <Search className="h-4 w-4" />
          {!collapsed && <span className="ml-3">Search (⌘K)</span>}
        </Button>

        <div className="pt-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start mb-1",
                    collapsed ? "px-2" : "px-3",
                    isActive
                      ? "bg-navy-100 text-navy-900 dark:bg-navy-800 dark:text-navy-100"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && (
                    <>
                      <span className="ml-3">{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-auto bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="pt-4">
            {!collapsed && (
              <p className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Administration
              </p>
            )}
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start mb-1",
                      collapsed ? "px-2" : "px-3",
                      isActive
                        ? "bg-navy-100 text-navy-900 dark:bg-navy-800 dark:text-navy-100"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </Button>
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationBell />
          {!collapsed && (
            <Button variant="ghost" size="icon" className="ml-auto">
              <Globe className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full justify-start text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400",
            collapsed ? "px-2" : "px-3",
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>
    </div>
  )
}

"use client";

import * as React from "react";
import { LogOut, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils";

interface LogoutButtonProps extends React.ComponentProps<typeof Button> {
  showConfirmDialog?: boolean;
}

export function LogoutButton({
  showConfirmDialog = true,
  className,
  children,
  ...props
}: LogoutButtonProps) {
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      logout();
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  };

  const LogoutButtonContent = (
    <Button
      {...props}
      className={cn("gap-2", className)}
      onClick={showConfirmDialog ? undefined : handleLogout}
      disabled={isLoading}
      variant="outline"
    >
      <LogOut className="h-4 w-4" />
      {children || (isLoading ? "Signing out..." : "Sign Out")}
    </Button>
  );

  if (!showConfirmDialog) {
    return LogoutButtonContent;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{LogoutButtonContent}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md animate-in fade-in slide-in-from-top-6 duration-300">
        <AlertDialogHeader className="text-center">
          <div className="flex justify-center mb-2">
            <AlertTriangle className="text-red-500 h-8 w-8" />
          </div>
          <AlertDialogTitle className=" flex justify-center text-lg font-semibold text-red-600">
            Are you sure you want to log out?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Signing out..." : "Yes, Sign Out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

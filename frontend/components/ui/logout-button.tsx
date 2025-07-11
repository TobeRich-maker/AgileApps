"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
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
      // Call the logout function which handles all storage clearing
      logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if there's an error
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  };

  const LogoutButtonContent = (
    <Button
      {...props}
      className={cn("", className)}
      onClick={showConfirmDialog ? undefined : handleLogout}
      disabled={isLoading}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {children || (isLoading ? "Signing out..." : "Sign Out")}
    </Button>
  );

  if (!showConfirmDialog) {
    return LogoutButtonContent;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{LogoutButtonContent}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to sign out?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out of your account and redirected to the login
            page. All local data will be cleared.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Signing out..." : "Sign Out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

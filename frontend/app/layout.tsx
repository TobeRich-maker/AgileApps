import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "SprintFlow",
  description: "Agile project management platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}

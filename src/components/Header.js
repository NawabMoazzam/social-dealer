"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "react-toastify";
import { Moon, Sun, LogOutIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Header() {
  const { setTheme } = useTheme();
  const pathname = usePathname();
  const userID = pathname.split("/")[2]; // Extract user ID from the URL
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userID ? { userId: userID } : {}),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        router.push("/join-room");
        return;
      } else {
        toast.error(result.error || "Failed to log out");
        return;
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred while logging out");
      return;
    }
  };
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-6">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Social Dealer
          </h1>
        </Link>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {(pathname.startsWith("/buyer-panel") ||
            pathname.startsWith("/seller-panel")) && (
            <Button
              onClick={() => {
                handleLogout();
              }}
              variant="destructive"
              className="dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 active:bg-red-800 dark:active:bg-red-800 transition-colors cursor-pointer"
            >
              <LogOutIcon />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

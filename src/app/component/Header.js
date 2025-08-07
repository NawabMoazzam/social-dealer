"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { toast } from "react-toastify";

export default function Header() {
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
      <div className="flex max-w-7xl mx-auto px-4 py-6">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Social Dealer
          </h1>
        </Link>
        {(pathname.startsWith("/buyer-panel") ||
          pathname.startsWith("/seller-panel")) && (
          <button
            className="ml-auto px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 active:bg-red-800 transition-colors cursor-pointer"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

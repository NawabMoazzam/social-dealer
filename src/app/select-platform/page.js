"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function SelectPlatformPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Select a <span className="text-blue-600">Platform</span>
      </h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400">
        Choose the platform for which you want to negotiate a deal.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/facebook/create-room" passHref>
          <Image
            className="w-40 h-w-40 rounded-full cursor-pointer hover:scale-105 transition-transform"
            src="/facebook.svg"
            alt="Facebook"
            width={160}
            height={160}
            priority
          />
        </Link>
        <Link href="/insta/create-room" passHref>
          <Image
            className="w-40 h-w-40 rounded-full cursor-pointer hover:scale-105 transition-transform"
            src="/insta.svg"
            alt="Instagram"
            width={160}
            height={160}
            priority
          />
        </Link>
        <Link href="/youtube/create-room" passHref>
          <Image
            className="w-40 h-w-40 rounded-full cursor-pointer hover:scale-105 transition-transform"
            src="/youtube.svg"
            alt="YouTube"
            width={160}
            height={160}
            priority
          />
        </Link>
        <Link href="/tiktok/create-room" passHref>
          <Image
            className="w-40 h-w-40 rounded-full cursor-pointer hover:scale-105 transition-transform"
            src="/tiktok.svg"
            alt="TikTok"
            width={160}
            height={160}
            priority
          />
        </Link>
      </div>
    </div>
  );
}

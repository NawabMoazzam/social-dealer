"use client";
import Image from "next/image";
import { useRouter } from "next-nprogress-bar";

export default function Home() {
  const router = useRouter();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Let's make a <span className="text-blue-600">Social Dealer App</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          This is a simple app to create a room for a buyer and seller to chat
          and negotiate on social media acccounts.
        </p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
          onClick={() => router.push("/create-room")}
        >
          Create Room
        </button>
        <button
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-800 transition-colors cursor-pointer"
          onClick={() => router.push("/join-room")}
        >
          Join Room
        </button>
      </main>
    </div>
  );
}

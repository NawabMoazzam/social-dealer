"use client";

export default function BuyerPanel() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Buyer Panel
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          This is the buyer panel where you can manage your room and chat with the seller.
        </p>
      </main>
    </div>
  );
}
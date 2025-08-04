"use client";

export default function SellerPanel() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Seller Panel
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          This is the seller panel where you can manage your room and chat with
          the buyer.
        </p>
        <div className="flex gap-4 mt-8">
          <input
            type="text"
            placeholder="Enter your account username"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Enter your account password"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer">
            Submit
          </button>
        </div>
      </main>
    </div>
  );
}

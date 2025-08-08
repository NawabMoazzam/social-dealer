"use client";

export default function SellerPanel() {
  return (
    <div className="font-sans flex min-h-screen">
      <aside className="max-w-1/4 p-8 w-full max-h-screen flex flex-col items-center justify-center border-r border-gray-800 overflow-auto">
        <h1 className="text-3xl font-semibold">Seller Panel</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          This is the seller panel where you can manage your room and chat with
          the buyer.
        </p>
        <div className="flex flex-col gap-4 mt-8">
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
      </aside>
      <main className="flex flex-col items-center w-full p-4 max-h-screen">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to the Seller Panel
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Here you can manage your rooms and chat with buyers.
        </p>
        <div className="w-full max-w-5/6 h-full max-h-9/12">
          <div className="flex flex-col gap-1 border-2 border-gray-800 p-4 h-full rounded-lg shadow-lg overflow-y-auto">
            {/* Chat messages will be displayed here */}
            <p className="self-end text-sm text-gray-200 bg-blue-700 dark:bg-blue-600 p-4 rounded-full max-w-fit max-h-fit">
              Hello, how can I help you today?
            </p>
            <p className="self-start text-sm text-gray-200 bg-gray-500 dark:bg-gray-700 p-4 rounded-full max-w-fit max-h-fit">
              I would like to know more about your products.
            </p>
          </div>
          <div className="mt-2 px-2 flex items-center gap-4">
            <input
              type="text"
              placeholder="Type your message here..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer">
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

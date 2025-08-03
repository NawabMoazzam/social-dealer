"use client";
import React from "react";

export default function CreateRoomPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Let's create a <span className="text-blue-600">Room</span>
      </h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400">
        Enter email address of both Buyer and Seller.
        <br />
        <span className="text-sm">
          An email will be sent to both parties containing room id and password
          to join the room.
        </span>
      </p>
      <form className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="email"
          placeholder="Buyer Email"
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <input
          type="email"
          placeholder="Seller Email"
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
        >
          Create Room
        </button>
      </form>
    </div>
  );
}

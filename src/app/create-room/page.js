"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import shortid from "shortid";
import { useRouter } from "next-nprogress-bar";

export default function CreateRoomPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const roomId = shortid.generate();
    const buyerId = shortid.generate();
    const sellerId = shortid.generate();
    const buyerPassword = shortid.generate();
    const sellerPassword = shortid.generate();
    const roomData = {
      roomId,
      buyerId,
      buyerEmail: data.buyerEmail,
      buyerPassword,
      sellerId,
      sellerEmail: data.sellerEmail,
      sellerPassword,
    };
    // Here you would typically send roomData to your backend to save it in the database
    console.log("Room created:", roomData);
    const response = await fetch(`/api/createRoom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    });
    if (response.ok) {
      const result = await response.json();
      toast.success(result.message);
      router.push(`/join-room`);
    } else {
      const error = await response.json();
      toast.error(error.message || "Failed to create room");
    }
  };
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="email"
          placeholder="Buyer Email"
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          {...register("buyerEmail", { required: true })}
          required
        />
        <input
          type="email"
          placeholder="Seller Email"
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          {...register("sellerEmail", { required: true })}
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

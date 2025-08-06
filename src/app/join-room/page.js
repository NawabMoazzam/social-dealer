"use client";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next-nprogress-bar";

export default function JoinRoomPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const response = await fetch(`/api/joinRoom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      toast.success(result.message);
      if (result.isBuyer) {
        router.push(`/buyer-panel/${result.buyerId}`);
      } else {
        router.push(`/seller-panel/${result.sellerId}`);
      }
    } else {
      toast.error(result.error || "Failed to join room");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Let's join a <span className="text-blue-600">Room</span>
      </h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400">
        Enter the room ID and password to join the room.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Room ID"
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          {...register("roomId", { required: true })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          {...register("password", { required: true })}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
        >
          Join Room
        </button>
      </form>
    </div>
  );
}

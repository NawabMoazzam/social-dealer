"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

export default function SellerPanel() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const pathname = usePathname();
  const [userToken, setUserToken] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [channel, setChannel] = useState(null);
  const userId = pathname.split("/")[2];
  const streamApi = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // Get token from backend
  useEffect(() => {
    async function getUserData() {
      const response = await fetch("/api/getToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const { token, roomId } = await response.json();
      setUserToken(token);
      setRoomId(roomId);
    }
    getUserData();
  }, [userId]);

  const client = useCreateChatClient({
    apiKey: streamApi,
    tokenOrProvider: userToken,
    userData: { id: userId },
  });

  // Watch channel once client is ready
  useEffect(() => {
    if (!client || !roomId) return;
    const channelInstance = client.channel("messaging", roomId, {
      members: [userId], // 👈 make sure members are set
    });
    setChannel(channelInstance);
  }, [client, roomId, userId]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/accountData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          accountEmail: data.accountEmail,
          accountPassword: data.accountPassword,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setIsSubmitted(true);
      } else {
        toast.error(result.error);
        setIsSubmitted(false);
      }
    } catch (error) {
      console.error("Error submitting account data:", error);
      toast.error("Failed to submit account data. Please try again.");
      setIsSubmitted(false);
    }

  };

  return (
    <div className="font-sans flex min-h-[85vh] max-h-[85vh]">
      <aside className="max-w-1/4 p-8 w-full max-h-screen md:flex flex-col gap-4 items-center justify-center overflow-auto hidden">
        <h1 className="text-3xl font-semibold">Seller Panel</h1>
        <p className="text-xs text-gray-500 text-center">
          Submit your account details, and make sure you take screenshots of your account for future proof of ownership.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full max-w-md text-sm"
        >
          <input
            type="email"
            placeholder="Account Email"
            {...register("accountEmail", { required: "Email is required" })}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Account Password"
            {...register("accountPassword", { required: "Password is required" })}
            className="p-2 border border-gray-300 rounded"
          />
          {!isSubmitting && !isSubmitted && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer">
              Submit
            </button>
          )}
          {isSubmitting && (
            <button
              disabled
              className="px-4 py-2 bg-blue-900 text-white rounded cursor-wait opacity-50 flex items-center justify-center gap-2"
            >
              <Loader2Icon className="animate-spin" /> Submitting...
            </button>
          )}
          {isSubmitted && (
            <button
              disabled
              className="px-4 py-2 bg-blue-900 text-white rounded cursor-wait opacity-50"
            >
              Data Submitted!
            </button>
          )}
        </form>
      </aside>

      <main className="flex flex-col items-center w-full max-h-full">
        <div className="w-full max-w-full h-full max-h-full">
          {!userToken && <div>Loading....</div>}
          {client && channel && userToken && (
            <Chat
              client={client}
              theme={
                currentTheme === "dark"
                  ? "str-chat__theme-dark"
                  : "str-chat__theme-light"
              }
            >
              <Channel channel={channel}>
                <Window>
                  <ChannelHeader />
                  <div className="overflow-y-hidden max-h-full h-full">
                    <MessageList />
                  </div>
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            </Chat>
          )}
        </div>
      </main>
    </div>
  );
}

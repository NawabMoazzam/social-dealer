"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
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

export default function BuyerPanel() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const pathname = usePathname();
  const [userToken, setUserToken] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [channel, setChannel] = useState(null);
  const userId = pathname.split("/")[2];
  const streamApi = process.env.NEXT_PUBLIC_STREAM_API_KEY; // 👈 make sure it's NEXT_PUBLIC_

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

  return (
    <div className="font-sans flex min-h-[85vh] max-h-[80vh]">
      <aside className="max-w-1/4 p-8 w-full max-h-screen md:flex flex-col gap-4 items-center justify-center border-r border-gray-800 overflow-auto hidden">
        <h1 className="text-3xl font-semibold">Buyer Panel</h1>
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

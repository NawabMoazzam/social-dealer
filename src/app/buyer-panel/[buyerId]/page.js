"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Clipboard, Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";

export default function BuyerPanel() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const pathname = usePathname();
  const [userToken, setUserToken] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isAccDataAvail, setIsAccDataAvail] = useState(false);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [accEmail, setAccEmail] = useState("");
  const [accPassword, setAccPassword] = useState("");
  const userId = pathname.split("/")[2];
  const streamApi = process.env.NEXT_PUBLIC_STREAM_API_KEY; // 👈 make sure it's NEXT_PUBLIC_

  // 🔴 Real-time stream listener
  useEffect(() => {
    async function getRoom() {
      const response = await fetch("/api/getRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.room.seller.accountEmail && data.room.seller.accountPassword) {
        setIsAccDataAvail(true);
        setAccEmail(data.room.seller.accountEmail);
        setAccPassword(data.room.seller.accountPassword);
      } else {
        setIsAccDataAvail(false);
      }
    }
    getRoom();
    const eventSource = new EventSource("/api/stream");

    eventSource.onmessage = (event) => {
      const room = JSON.parse(event.data);
      if (room.seller.accountEmail && room.seller.accountPassword) {
        setIsAccDataAvail(true);
        setAccEmail(room.seller.accountEmail);
        setAccPassword(room.seller.accountPassword);
      }
    };

    return () => eventSource.close();
  }, []);

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
    <div className="font-sans flex min-h-[85vh] max-h-[85vh]">
      <aside className="max-w-[30vw] p-8 w-full max-h-screen md:flex flex-col gap-4 items-center justify-center border-r border-gray-800 overflow-auto hidden">
        <h1 className="text-3xl font-semibold">Buyer Panel</h1>
        {!isAccDataAvail && (
          <blockquote className="flex items-center gap-4 border-l-2 pl-3 italic text-xs font-semibold">
            Waiting for seller to send account details...
          </blockquote>
        )}
        {isAccDataAvail && !paymentReceived && (
          <div className="flex flex-col gap-2 items-center text-center">
            <p className="text-xs text-neutral-500">
              Seller has submitted the account details.
              <br />
              Please make payment in order to receive credentials.
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              onClick={() => setPaymentReceived(true)}
            >
              Send Payment
            </button>
          </div>
        )}
        {paymentReceived && (
          <div className="flex flex-col gap-3 items-center">
            <p className="text-xs text-center text-neutral-500">
              Payment received: Rs.50,000/✅
              <br />
              Make sure you verify everything in account and secure it before
              clicking on Release Payment, Here are your account details:
            </p>
            <blockquote className="flex items-center gap-4 border-l-2 pl-3 italic text-xs font-semibold">
              <div className="flex flex-col gap-2">
                <p>Email:</p>
                <p>Password:</p>
              </div>
              <div className="flex flex-col gap-2">
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono flex items-center justify-between gap-2">
                  <p>{accEmail}</p>
                  <button
                    className="cursor-pointer p-0.5 rounded hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(accEmail);
                    }}
                  >
                    <Clipboard size={14} />
                  </button>
                </code>
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono flex items-center justify-between gap-2">
                  <p>{accPassword}</p>
                  <button
                    className="cursor-pointer p-0.5 rounded hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(accPassword);
                    }}
                  >
                    <Clipboard size={14} />
                  </button>
                </code>
              </div>
            </blockquote>
            <Button className="cursor-pointer">Release Payment</Button>
          </div>
        )}
      </aside>

      <main className="flex flex-col items-center w-full max-h-full">
        <div className="w-full max-w-full h-full max-h-full">
          {!userToken && (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={100} className="animate-spin" />
            </div>
          )}
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

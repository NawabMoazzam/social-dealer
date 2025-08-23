"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Loader2, Loader2Icon, Clipboard } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SellerPanel() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const pathname = usePathname();
  const [userToken, setUserToken] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isAccDataAvail, setIsAccDataAvail] = useState(false);
  const [accEmail, setAccEmail] = useState("");
  const [accPassword, setAccPassword] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankNumber, setBankNumber] = useState("");
  const userId = pathname.split("/")[2];
  const streamApi = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      bankName: "jazzcash",
    },
  });

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
        setBankName(data.room.seller.bankName);
        setBankNumber(data.room.seller.bankNumber);
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

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/accountData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          accountEmail: data.accountEmail,
          accountPassword: data.accountPassword,
          bankName: data.bankName,
          bankNumber: data.bankNumber,
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
        {!isAccDataAvail && (
          <div>
            <p className="text-xs mb-3 text-gray-500 text-center">
              Submit your account details, and make sure you take screenshots of
              your account for future proof of ownership.
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full max-w-md text-sm"
            >
              <Input
                type="email"
                placeholder="Account Email"
                {...register("accountEmail", { required: "Email is required" })}
                className="p-2 border border-gray-300 rounded"
              />
              <Input
                type="password"
                placeholder="Account Password"
                {...register("accountPassword", {
                  required: "Password is required",
                })}
                className="p-2 border border-gray-300 rounded"
              />
              <Controller
                name="bankName"
                control={control}
                rules={{ required: "Bank Name is required" }}
                render={({ field }) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {field.value.toUpperCase()}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Select Bank</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <DropdownMenuRadioItem value="jazzcash">
                          JazzCash
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="easypaisa">
                          EasyPaisa
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="nayapay">
                          NayaPay
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              />
              <Input
                type="tel"
                maxLength={11}
                minLength={11}
                placeholder="Bank Account Number"
                {...register("bankNumber", {
                  required: "Bank Account Number is required",
                })}
                className="p-2 border border-gray-300 rounded"
              />
              {!isSubmitting && !isSubmitted && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
                >
                  Submit
                </button>
              )}
              {isSubmitting && (
                <Button
                  disabled
                  className="px-4 py-2 bg-blue-900 text-white rounded cursor-wait opacity-50 flex items-center justify-center gap-2"
                >
                  <Loader2Icon className="animate-spin" /> Submitting...
                </Button>
              )}
              {isSubmitted && (
                <Button
                  disabled
                  className="px-4 py-2 bg-blue-900 text-white rounded cursor-wait opacity-50"
                >
                  Data Submitted!
                </Button>
              )}
            </form>
          </div>
        )}
        {isAccDataAvail && (
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
            <blockquote className="flex items-center gap-4 border-l-2 pl-3 italic text-xs font-semibold">
              <div className="flex flex-col gap-2">
                <p>Bank Name:</p>
                <p>Bank AccNo:</p>
              </div>
              <div className="flex flex-col gap-2">
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono flex items-center justify-between gap-2">
                  <p>{bankName}</p>
                  <button
                    className="cursor-pointer p-0.5 rounded hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(bankName);
                    }}
                  >
                    <Clipboard size={14} />
                  </button>
                </code>
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono flex items-center justify-between gap-2">
                  <p>{bankNumber}</p>
                  <button
                    className="cursor-pointer p-0.5 rounded hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(bankNumber);
                    }}
                  >
                    <Clipboard size={14} />
                  </button>
                </code>
              </div>
            </blockquote>
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

import connectToDatabase from "@/lib/mongodb";
import Room from "@/model/RoomSchema";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  // 🔴 Change Stream start karo
  const changeStream = Room.watch([], { fullDocument: "updateLookup" });

  // 🟢 Encoder taake data stream me bhej saken
  const encoder = new TextEncoder();

  // 🔴 SSE response return karte hain
  return new NextResponse(
    new ReadableStream({
      start(controller) {
        // 🔔 Jab bhi MongoDB me koi change ho
        changeStream.on("change", (change) => {
          // Data ko SSE format me bhej do
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(change.fullDocument)}\n\n`)
          );
        });
      },
      cancel() {
        // 🔴 Agar client disconnect kare to band kar do
        changeStream.close();
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream", // SSE format
        "Cache-Control": "no-cache", // Cache disable
        Connection: "keep-alive", // Connection open rakho
      },
    }
  );
}

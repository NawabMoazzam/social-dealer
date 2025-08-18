import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import connectToDatabase from "@/lib/mongodb";
import Room from "@/model/RoomSchema";

export async function POST(request) {
  try {
    const { userId } = await request.json();
    const streamApi = process.env.STREAM_API_KEY;
    const streamSecret = process.env.STREAM_API_SECRET;

    const serverClient = StreamChat.getInstance(streamApi, streamSecret);
    const token = serverClient.createToken(userId);

    // Connect to the database
    await connectToDatabase();

    // Find the room in the database
    const room = await Room.findOne({
      $or: [{ "buyer.buyerId": userId }, { "seller.sellerId": userId }],
    });
    if (!room) {
      return NextResponse.json(
        { error: "User not found in any room" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        token,
        roomId: room.roomId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating user token:", error);
    return NextResponse.json(
      { error: "Failed to generate user token" },
      { status: 500 }
    );
  }
}

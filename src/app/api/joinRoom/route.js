import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Room from "@/model/RoomSchema";
import { StreamChat } from "stream-chat";

export async function POST(request) {
  try {
    const data = await request.json();
    const { roomId, password } = data;
    const streamApi = process.env.STREAM_API_KEY;
    const streamSecret = process.env.STREAM_API_SECRET;

    // Validate required fields
    if (!roomId || !password) {
      return new NextResponse(
        JSON.stringify({ error: "Room ID and password are required" }),
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the room in the database
    const room = await Room.findOne({ roomId });
    if (!room) {
      return new NextResponse(JSON.stringify({ error: "Room not found" }), {
        status: 404,
      });
    }

    if (room.buyer.password !== password && room.seller.password !== password) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid room ID or password" }),
        { status: 404 }
      );
    }

    const serverClient = StreamChat.getInstance(streamApi, streamSecret);
    await serverClient.upsertUsers([
      {
        id: room.buyer.buyerId,
        name: "Buyer",
        image: `https://getstream.io/random_png/?name=Buyer`,
      },
      {
        id: room.seller.sellerId,
        name: "Seller",
        image: `https://getstream.io/random_png/?name=Seller`,
      },
    ]);

    // Create or get the channel
    const channel = serverClient.channel("messaging", room.roomId, {
      image: "https://getstream.io/random_png/?name=Social-Dealer",
      name: "Dealing Room",
      members: [room.buyer.buyerId, room.seller.sellerId], // 👈 multiple members here
      created_by_id: "nawabmoazzam",
    });

    await channel.create();

    if (room.buyer.password === password) {
      const response = new NextResponse(
        JSON.stringify({
          message: "Successfully joined the room as Buyer",
          isBuyer: true,
          roomId: room.roomId,
          buyerId: room.buyer.buyerId,
        }),
        { status: 200 }
      );
      response.cookies.set("buyerId", room.buyer.buyerId, {
        httpOnly: true, // Optional: Makes the cookie only accessible on the server
        secure: process.env.NODE_ENV === "production", // Optional: Only send over HTTPS in production
        maxAge: 60 * 60 * 12, // Optional: Cookie expires in 12 hours
        path: "/", // Optional: Cookie is available on all paths
      });
      return response;
    } else if (room.seller.password === password) {
      const response = new NextResponse(
        JSON.stringify({
          message: "Successfully joined the room as Seller",
          isBuyer: false,
          roomId: room.roomId,
          sellerId: room.seller.sellerId,
        }),
        { status: 200 }
      );
      response.cookies.set("sellerId", room.seller.sellerId, {
        httpOnly: true, // Optional: Makes the cookie only accessible on the server
        secure: process.env.NODE_ENV === "production", // Optional: Only send over HTTPS in production
        maxAge: 60 * 60 * 12, // Optional: Cookie expires in 12 hours
        path: "/", // Optional: Cookie is available on all paths
      });
      return response;
    }
  } catch (error) {
    console.error("Error joining room:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to join room" }), {
      status: 500,
    });
  }
}

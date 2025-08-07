import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Room from "@/model/RoomSchema";

export async function POST(request) {
  try {
    const data = await request.json();
    const { roomId, password } = data;

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

    if (room.buyer.password === password) {
      //reditect to buyer's panel
      room.buyer.isJoined = true;
      await room.save();
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
      //reditect to seller's panel
      room.seller.isJoined = true;
      await room.save();
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

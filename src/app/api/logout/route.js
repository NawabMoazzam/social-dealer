import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Room from "@/model/RoomSchema";

export async function POST(request) {
  const { userId } = await request.json();
  try {
    await connectToDatabase();
    const room = await Room.findOne({
      $or: [{ "buyer.buyerId": userId }, { "seller.sellerId": userId }],
    });
    if (!room) {
      return NextResponse.json(
        { error: "User not found in any room" },
        { status: 404 }
      );
    }
    if (room.buyer.buyerId === userId) {
      room.buyer.isJoined = false;
    } else if (room.seller.sellerId === userId) {
      room.seller.isJoined = false;
    }
    await room.save();
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("buyerId", "", { maxAge: -1 });
    response.cookies.set("sellerId", "", { maxAge: -1 });
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}

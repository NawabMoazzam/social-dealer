import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Room from "@/model/RoomSchema";

export async function POST(request) {
  const { roomId, accountEmail, accountPassword } = await request.json();

  try {
    await connectToDatabase();
    const room = await Room.findOne({ roomId });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    // Update account data
    if (!accountEmail || !accountPassword) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    room.seller.accountEmail = accountEmail;
    room.seller.accountPassword = accountPassword;
    await room.save();

    return NextResponse.json(
      { message: "Account data updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating account data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

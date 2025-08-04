import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Room from "@/model/RoomSchema";

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      roomId,
      platform,
      buyerEmail,
      buyerPassword,
      sellerEmail,
      sellerPassword,
    } = data;

    // Validate required fields
    if (
      !roomId ||
      !platform ||
      !buyerEmail ||
      !buyerPassword ||
      !sellerEmail ||
      !sellerPassword
    ) {
      return new NextResponse(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    const newRoom = new Room({
      roomId,
      platform,
      buyerEmail,
      buyerPassword,
      sellerEmail,
      sellerPassword,
    });

    // Save the room to the database
    await newRoom.save();
    // automatically delete the room after 24 hours
    setTimeout(async () => {
      await Room.deleteOne({ roomId });
    }, 24 * 60 * 60 * 1000);

    return new NextResponse(
      JSON.stringify({ message: `Room created successfully for 24 Hours!` }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating room:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create room" }),
      {
        status: 500,
      }
    );
  }
}

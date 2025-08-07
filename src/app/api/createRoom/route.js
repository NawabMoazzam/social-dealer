import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Room from "@/model/RoomSchema";

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      roomId,
      buyerId,
      buyerEmail,
      buyerPassword,
      sellerId,
      sellerEmail,
      sellerPassword,
    } = data;

    // Validate required fields
    if (
      !roomId ||
      !buyerId ||
      !buyerEmail ||
      !buyerPassword ||
      !sellerId ||
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
      buyer: {
        buyerId,
        email: buyerEmail,
        password: buyerPassword,
      },
      seller: {
        sellerId,
        email: sellerEmail,
        password: sellerPassword,
      },
    });

    // Save the room to the database
    await newRoom.save();
    // automatically delete the room after 12 hours
    setTimeout(async () => {
      await Room.deleteOne({ roomId });
    }, 12 * 60 * 60 * 1000);

    return new NextResponse(
      JSON.stringify({ message: `Room created successfully for 12 Hours!` }),
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

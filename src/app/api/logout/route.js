import { NextResponse } from "next/server";

export async function POST(request) {
  const { userId } = await request.json();
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("buyerId", "", { maxAge: -1 });
    response.cookies.set("sellerId", "", { maxAge: -1 });
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}

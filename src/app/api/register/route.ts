// app/api/user/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Forward the request to your backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Forward the response back to the client
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error calling backend API:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

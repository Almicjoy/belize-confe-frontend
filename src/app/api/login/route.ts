import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Call your backend API that handles bcrypt + DB lookup
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // optional, if using cookies
    });

    const data = await res.json();

    if (!res.ok) {
      // Forward backend error
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data); // returns user object
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

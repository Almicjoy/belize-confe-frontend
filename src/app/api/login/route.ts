import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  // TODO: Check DB (validate credentials)
  console.log("Logging in:", email, password);

  if (email === "test@example.com" && password === "password") {
    return NextResponse.json({ message: "Login successful!", token: "fake-jwt-token" });
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
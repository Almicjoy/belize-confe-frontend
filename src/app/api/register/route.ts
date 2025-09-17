import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  // TODO: Save to DB (hashed password, validation, etc.)
  console.log("Registering:", email, password);

  return NextResponse.json({ message: "User registered successfully!" });
}
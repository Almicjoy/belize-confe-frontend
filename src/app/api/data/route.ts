import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "lib/data.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  return new Response(jsonData, { status: 200 });
}
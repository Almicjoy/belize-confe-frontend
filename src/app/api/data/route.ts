import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function GET() {
  try {
    const filePath = path.join(__dirname, "../../../lib/data.json"); // relative from route.ts
    const jsonData = await fs.readFile(filePath, "utf-8");

    return new Response(jsonData, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error reading data.json:", err);

    return new Response(
      JSON.stringify({ countries: [], clubs: [] }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

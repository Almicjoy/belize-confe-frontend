import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    // Use path.join to safely resolve the file
    const filePath = path.resolve(process.cwd(), "src/lib/data.json");
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

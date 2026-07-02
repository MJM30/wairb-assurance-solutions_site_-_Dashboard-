import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { handleOptions, jsonWithCors } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

// GET /api/visitors - Fetch all visitor records
export async function GET() {
  try {
    const visitors = await query<any[]>(
      "SELECT * FROM (SELECT * FROM wairb_visitors ORDER BY date DESC LIMIT 30) v ORDER BY date ASC"
    );
    return jsonWithCors({
      visitors: visitors.map((visitor) => ({
        ...visitor,
        count: Number(visitor.count),
      })),
    });
  } catch (err) {
    console.error("DB error:", err);
    return jsonWithCors({ error: "Database error" }, { status: 500 });
  }
}

// POST /api/visitors - Increment visitor count for today
export async function POST(_req: NextRequest) {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    await query(
      `INSERT INTO wairb_visitors (date, count) VALUES (?, 1)
       ON DUPLICATE KEY UPDATE count = count + 1`,
      [today]
    );

    return jsonWithCors({ success: true });
  } catch (err) {
    console.error("DB error:", err);
    return jsonWithCors({ error: "Failed to update visitors" }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { getVisitors, incrementTodayVisitors } from "@/lib/visitorsStore";
import { handleOptions, jsonWithCors } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

// GET /api/visitors - Fetch all visitor records
export async function GET() {
  try {
    const visitors = await getVisitors();
    return jsonWithCors({ visitors });
  } catch (err) {
    console.error("Visitors GET error:", err);
    return jsonWithCors({ visitors: [] });
  }
}

// POST /api/visitors - Increment visitor count for today
export async function POST(_req: NextRequest) {
  try {
    await incrementTodayVisitors();
    return jsonWithCors({ success: true });
  } catch (err) {
    console.error("Visitors POST error:", err);
    return jsonWithCors({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

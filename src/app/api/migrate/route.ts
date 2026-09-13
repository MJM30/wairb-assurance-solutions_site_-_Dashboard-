import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { handleOptions, jsonWithCors } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

// POST /api/migrate - Apply database migration for payment fields
export async function POST(req: NextRequest) {
  try {
    const { initDb } = await import("@/lib/db");
    await initDb();

    return jsonWithCors({ 
      success: true, 
      message: 'Database initialized successfully',
    });
  } catch (err: any) {
    console.error("Migration error:", err);
    return jsonWithCors({ 
      error: "Migration failed", 
      details: err.message 
    }, { status: 500 });
  }
}

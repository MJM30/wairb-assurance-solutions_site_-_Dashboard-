import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/users - Fetch all admin users
export async function GET() {
  try {
    const users = await query("SELECT id, name, email, role, phone, address, avatar, createdAt FROM wairb_users");
    return NextResponse.json({ users });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST /api/users - Create a new admin user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, phone, address } = body;
    const id = `usr_${Date.now()}`;

    await query(
      `INSERT INTO wairb_users (id, name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, email, password, role, phone ?? null, address ?? null]
    );

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

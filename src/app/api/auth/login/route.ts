import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// POST /api/auth/login - Authenticate admin user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const rows = await query<any[]>(
      "SELECT id, name, email, role FROM wairb_users WHERE email = ? AND password = ? LIMIT 1",
      [email, password]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = rows[0];
    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

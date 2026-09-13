import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/expenses - Fetch all expenses
export async function GET() {
  try {
    const expenses = await query("SELECT * FROM wairb_expenses ORDER BY createdAt DESC");
    return NextResponse.json({ expenses });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST /api/expenses - Create new expense
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, amount, category, disburserName, recipientName, justification, attachment } = body;

    const id = `exp_${Date.now()}`;
    await query(
      `INSERT INTO wairb_expenses (id, date, amount, category, disburserName, recipientName, justification, attachmentName, attachmentType, attachmentData, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'effectue')`,
      [
        id, date, amount, category, disburserName, recipientName, justification,
        attachment?.name ?? null, attachment?.type ?? null, attachment?.data ?? null,
      ]
    );

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}

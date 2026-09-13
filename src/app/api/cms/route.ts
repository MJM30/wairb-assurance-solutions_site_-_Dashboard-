import { NextRequest } from "next/server";
import { getCmsData, saveCmsData } from "@/lib/cmsRepository";
import { handleOptions, jsonWithCors } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  try {
    const data = await getCmsData();
    return jsonWithCors(data);
  } catch (err) {
    console.error("CMS GET error:", err);
    return jsonWithCors({ error: "Failed to fetch CMS data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await saveCmsData(body);
    return jsonWithCors({ success: true });
  } catch (err) {
    console.error("CMS POST error:", err);
    return jsonWithCors({ error: "Failed to save CMS data" }, { status: 500 });
  }
}

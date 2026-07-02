import { NextRequest } from "next/server";
import { createClient, getAllClients } from "@/lib/clientsRepository";
import { handleOptions, jsonWithCors } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

// GET /api/clients - Fetch all clients
export async function GET() {
  try {
    const clients = await getAllClients();
    return jsonWithCors({ clients });
  } catch (err) {
    console.error("DB error:", err);
    return jsonWithCors({ error: "Database error" }, { status: 500 });
  }
}

// POST /api/clients - Create a new client
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nom, email, telephone, adressePhysique, adressePostale,
      domaineActivite, ville, pays, typeAssurance, typeAssuranceLabel,
      matricule, detailsAssurance,
    } = body;

    const result = await createClient({
      nom, email, telephone, adressePhysique, adressePostale,
      domaineActivite, ville, pays, typeAssurance, typeAssuranceLabel,
      matricule, detailsAssurance,
    });

    return jsonWithCors({ success: true, ...result });
  } catch (err) {
    console.error("DB error:", err);
    return jsonWithCors({ error: "Failed to save client" }, { status: 500 });
  }
}

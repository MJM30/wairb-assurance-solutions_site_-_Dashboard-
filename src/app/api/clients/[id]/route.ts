import { NextRequest } from "next/server";
import { deleteClient, updateClient, getAllClients } from "@/lib/clientsRepository";
import { handleOptions, jsonWithCors } from "@/lib/cors";
import { sendPaymentConfirmationEmail } from "@/lib/mailer";

export function OPTIONS() {
  return handleOptions();
}

// PATCH /api/clients/[id] - Update client (e.g. mark as paid)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const hasUpdates = Object.keys(body).length > 0;
    if (!hasUpdates) {
      return jsonWithCors({ error: "No fields to update" }, { status: 400 });
    }

    const ok = await updateClient(id, body);
    if (!ok) {
      return jsonWithCors({ error: "Client not found" }, { status: 404 });
    }

    if (body.statut === "paye") {
      const clients = await getAllClients();
      const client = clients.find(c => c.id === id);
      if (client && client.email) {
        console.log("📧 Tentative d'envoi d'email à:", client.email);
        const emailSent = await sendPaymentConfirmationEmail(
          client.email,
          client.nom,
          client.typeAssuranceLabel || client.typeAssurance
        );
        console.log("📧 Résultat envoi email:", emailSent ? "✅ Succès" : "❌ Échec");
      } else {
        console.warn("⚠️ Client introuvable ou sans email pour id:", id);
      }
    }

    return jsonWithCors({ success: true });
  } catch (err) {
    console.error("DB error:", err);
    return jsonWithCors({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE /api/clients/[id] - Delete a client
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ok = await deleteClient(id);
    if (!ok) {
      return jsonWithCors({ error: "Client not found" }, { status: 404 });
    }
    return jsonWithCors({ success: true });
  } catch (err) {
    console.error("DB error:", err);
    return jsonWithCors({ error: "Delete failed" }, { status: 500 });
  }
}

import type { VisitorRecord, WairbClient } from "./storage";

const NEXT_API_BASE_URL =
  import.meta.env.VITE_NEXT_API_BASE_URL || "http://localhost:3000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${NEXT_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Erreur API ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchClients(): Promise<WairbClient[]> {
  const data = await apiFetch<{ clients?: WairbClient[] }>("/api/clients", {
    method: "GET",
  });
  return data.clients || [];
}

export async function fetchVisitors(): Promise<VisitorRecord[]> {
  const data = await apiFetch<{ visitors?: VisitorRecord[] }>("/api/visitors", {
    method: "GET",
  });
  return data.visitors || [];
}

export async function createClient(client: Omit<WairbClient, "id" | "dateInscription" | "datePaiement" | "montantPaye"> & {
  detailsAssurance?: Record<string, unknown>;
}) {
  return apiFetch<{ success: boolean; id: string; matricule: string }>("/api/clients", {
    method: "POST",
    body: JSON.stringify(client),
  });
}

export async function updateClient(id: string, payload: Partial<WairbClient>) {
  return apiFetch<{ success: boolean }>(`/api/clients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updateClientPayment(id: string, paid: boolean, montantPaye?: number, modePaiement?: 'virement' | 'especes', preuvePaiementNom?: string, preuvePaiementType?: string, preuvePaiementData?: string) {
  return updateClient(id, {
    statut: paid ? "paye" : "en_attente",
    montantPaye: paid ? montantPaye : undefined,
    modePaiement: paid ? modePaiement : undefined,
    preuvePaiementNom: paid ? preuvePaiementNom : undefined,
    preuvePaiementType: paid ? preuvePaiementType : undefined,
    preuvePaiementData: paid ? preuvePaiementData : undefined,
  });
}

export async function deleteClient(id: string) {
  return apiFetch<{ success: boolean }>(`/api/clients/${id}`, {
    method: "DELETE",
  });
}

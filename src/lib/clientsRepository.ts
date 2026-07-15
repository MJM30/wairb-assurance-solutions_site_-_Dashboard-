import { query } from "@/lib/db";
import {
  fileCreateClient,
  fileDeleteClient,
  fileGetClients,
  fileUpdateClient,
  type StoredClient,
} from "@/lib/fileStore";

let useFileStore: boolean | null = null;

async function dbAvailable(): Promise<boolean> {
  if (useFileStore !== null) return !useFileStore;
  try {
    await query("SELECT 1");
    useFileStore = false;
    return true;
  } catch (err) {
    console.warn("MySQL unavailable, using file store:", (err as Error).message);
    useFileStore = true;
    return false;
  }
}

function normalizeClient(client: StoredClient | Record<string, unknown>) {
  const c = client as StoredClient;
  return {
    ...c,
    montantPaye:
      c.montantPaye === null || c.montantPaye === undefined ? null : Number(c.montantPaye),
    detailsAssurance:
      typeof c.detailsAssurance === "string"
        ? JSON.parse(c.detailsAssurance || "{}")
        : c.detailsAssurance || {},
  };
}

export async function getAllClients() {
  if (await dbAvailable()) {
    const clients = await query<StoredClient[]>(
      "SELECT * FROM wairb_clients ORDER BY dateInscription DESC"
    );
    return clients.map(normalizeClient);
  }
  const clients = await fileGetClients();
  return clients.map(normalizeClient);
}

export async function createClient(body: {
  nom: string;
  email: string;
  telephone: string;
  adressePhysique?: string;
  adressePostale?: string;
  domaineActivite?: string;
  ville?: string;
  pays?: string;
  typeAssurance: string;
  typeAssuranceLabel: string;
  matricule: string;
  detailsAssurance?: Record<string, unknown>;
}) {
  const id = `cli_${Date.now()}`;

  if (await dbAvailable()) {
    await query(
      `INSERT INTO wairb_clients
        (id, nom, email, telephone, adressePhysique, adressePostale, domaineActivite, ville, pays, typeAssurance, typeAssuranceLabel, matricule, statut, detailsAssurance)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente', ?)`,
      [
        id,
        body.nom,
        body.email,
        body.telephone,
        body.adressePhysique ?? null,
        body.adressePostale ?? null,
        body.domaineActivite ?? null,
        body.ville ?? null,
        body.pays ?? null,
        body.typeAssurance,
        body.typeAssuranceLabel,
        body.matricule,
        JSON.stringify(body.detailsAssurance || {}),
      ]
    );
    return { id, matricule: body.matricule };
  }

  await fileCreateClient({
    id,
    nom: body.nom,
    email: body.email,
    telephone: body.telephone,
    adressePhysique: body.adressePhysique ?? null,
    adressePostale: body.adressePostale ?? null,
    domaineActivite: body.domaineActivite ?? null,
    ville: body.ville ?? null,
    pays: body.pays ?? null,
    typeAssurance: body.typeAssurance,
    typeAssuranceLabel: body.typeAssuranceLabel,
    matricule: body.matricule,
    detailsAssurance: body.detailsAssurance || {},
  });
  return { id, matricule: body.matricule };
}

export async function updateClient(
  id: string,
  body: Record<string, unknown>
) {
  if (await dbAvailable()) {
    const SIMPLE_FIELDS = [
      "nom", "email", "telephone", "adressePhysique", "adressePostale",
      "domaineActivite", "ville", "pays", "typeAssurance", "typeAssuranceLabel", "matricule",
    ] as const;

    const updates: string[] = [];
    const values: unknown[] = [];

    for (const field of SIMPLE_FIELDS) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (body.detailsAssurance !== undefined) {
      updates.push("detailsAssurance = ?");
      values.push(JSON.stringify(body.detailsAssurance || {}));
    }

    if (body.statut !== undefined) {
      if (body.statut === "paye") {
        updates.push("statut = 'paye'");
        updates.push("datePaiement = NOW()");
        updates.push("montantPaye = ?");
        values.push(body.montantPaye ?? 0);
      } else {
        updates.push("statut = 'en_attente'");
        updates.push("datePaiement = NULL");
        updates.push("montantPaye = NULL");
      }
    }

    if (body.modePaiement !== undefined) {
      updates.push("modePaiement = ?");
      values.push(body.modePaiement);
    }

    if (body.preuvePaiementNom !== undefined) {
      updates.push("preuvePaiementNom = ?");
      values.push(body.preuvePaiementNom);
    }

    if (body.preuvePaiementType !== undefined) {
      updates.push("preuvePaiementType = ?");
      values.push(body.preuvePaiementType);
    }

    if (body.preuvePaiementData !== undefined) {
      updates.push("preuvePaiementData = ?");
      values.push(body.preuvePaiementData);
    }

    if (updates.length === 0) return false;
    await query(`UPDATE wairb_clients SET ${updates.join(", ")} WHERE id = ?`, [...values, id]);
    return true;
  }

  return fileUpdateClient(id, body as Partial<StoredClient>);
}

export async function deleteClient(id: string) {
  if (await dbAvailable()) {
    await query("DELETE FROM wairb_clients WHERE id = ?", [id]);
    return true;
  }
  return fileDeleteClient(id);
}

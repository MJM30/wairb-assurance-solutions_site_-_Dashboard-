import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CLIENTS_FILE = path.join(DATA_DIR, "clients.json");

export type StoredClient = {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  adressePhysique: string | null;
  adressePostale: string | null;
  domaineActivite: string | null;
  ville: string | null;
  pays: string | null;
  typeAssurance: string;
  typeAssuranceLabel: string;
  matricule: string;
  dateInscription: string;
  statut: string;
  datePaiement: string | null;
  montantPaye: number | null;
  modePaiement: string | null;
  preuvePaiementNom: string | null;
  preuvePaiementType: string | null;
  preuvePaiementData: string | null;
  detailsAssurance: Record<string, unknown>;
};

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(CLIENTS_FILE);
  } catch {
    await fs.writeFile(CLIENTS_FILE, "[]", "utf-8");
  }
}

async function readClients(): Promise<StoredClient[]> {
  await ensureDataFile();
  const raw = await fs.readFile(CLIENTS_FILE, "utf-8");
  return JSON.parse(raw) as StoredClient[];
}

async function writeClients(clients: StoredClient[]) {
  await ensureDataFile();
  await fs.writeFile(CLIENTS_FILE, JSON.stringify(clients, null, 2), "utf-8");
}

export async function fileGetClients(): Promise<StoredClient[]> {
  const clients = await readClients();
  return clients.sort(
    (a, b) => new Date(b.dateInscription).getTime() - new Date(a.dateInscription).getTime()
  );
}

export async function fileCreateClient(
  data: Omit<StoredClient, "dateInscription" | "statut" | "datePaiement" | "montantPaye">
): Promise<StoredClient> {
  const clients = await readClients();
  const client: StoredClient = {
    ...data,
    dateInscription: new Date().toISOString(),
    statut: "en_attente",
    datePaiement: null,
    montantPaye: null,
  };
  clients.push(client);
  await writeClients(clients);
  return client;
}

export async function fileUpdateClient(
  id: string,
  body: Partial<StoredClient> & { statut?: string; montantPaye?: number | null }
): Promise<boolean> {
  const clients = await readClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) return false;

  const current = clients[index];
  const updated: StoredClient = { ...current, ...body };

  if (body.statut === "paye") {
    updated.statut = "paye";
    updated.datePaiement = new Date().toISOString();
    updated.montantPaye = body.montantPaye ?? 0;
  } else if (body.statut === "en_attente") {
    updated.statut = "en_attente";
    updated.datePaiement = null;
    updated.montantPaye = null;
    updated.modePaiement = null;
    updated.preuvePaiementNom = null;
    updated.preuvePaiementType = null;
    updated.preuvePaiementData = null;
  }

  clients[index] = updated;
  await writeClients(clients);
  return true;
}

export async function fileDeleteClient(id: string): Promise<boolean> {
  const clients = await readClients();
  const filtered = clients.filter((c) => c.id !== id);
  if (filtered.length === clients.length) return false;
  await writeClients(filtered);
  return true;
}

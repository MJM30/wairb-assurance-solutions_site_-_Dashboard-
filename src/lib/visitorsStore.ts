import fs from "fs/promises";
import path from "path";
import { query } from "@/lib/db";

const DATA_DIR = path.join(process.cwd(), "data");
const VISITORS_FILE = path.join(DATA_DIR, "visitors.json");

export type VisitorRecord = {
  date: string; // YYYY-MM-DD
  count: number;
};

let useFileStore: boolean | null = null;

async function isDbAvailable(): Promise<boolean> {
  if (useFileStore !== null) return !useFileStore;
  try {
    const { initDb } = await import("@/lib/db");
    await initDb();
    useFileStore = false;
    return true;
  } catch (err) {
    console.warn("Visitors: DB unavailable, using file store:", (err as Error).message);
    useFileStore = true;
    return false;
  }
}

function getDefaultVisitors(): VisitorRecord[] {
  const records: VisitorRecord[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    records.push({
      date: dateStr,
      count: Math.floor(Math.random() * 60) + 15,
    });
  }
  return records;
}

async function ensureVisitorsFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(VISITORS_FILE);
  } catch {
    const defaults = getDefaultVisitors();
    await fs.writeFile(VISITORS_FILE, JSON.stringify(defaults, null, 2), "utf-8");
  }
}

async function readFileVisitors(): Promise<VisitorRecord[]> {
  await ensureVisitorsFile();
  try {
    const raw = await fs.readFile(VISITORS_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // fallback
  }
  const defaults = getDefaultVisitors();
  await fs.writeFile(VISITORS_FILE, JSON.stringify(defaults, null, 2), "utf-8");
  return defaults;
}

async function writeFileVisitors(records: VisitorRecord[]) {
  await ensureVisitorsFile();
  await fs.writeFile(VISITORS_FILE, JSON.stringify(records, null, 2), "utf-8");
}

export async function getVisitors(): Promise<VisitorRecord[]> {
  if (await isDbAvailable()) {
    try {
      const rows = await query<any[]>(
        "SELECT * FROM (SELECT * FROM wairb_visitors ORDER BY date DESC LIMIT 30) v ORDER BY date ASC"
      );
      if (rows && rows.length > 0) {
        return rows.map((v) => ({
          date: typeof v.date === "string" ? v.date.split("T")[0] : new Date(v.date).toISOString().split("T")[0],
          count: Number(v.count),
        }));
      }
    } catch (err) {
      console.warn("Error querying wairb_visitors from DB:", err);
    }
  }
  return readFileVisitors();
}

export async function incrementTodayVisitors(): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  if (await isDbAvailable()) {
    try {
      await query(
        `INSERT INTO wairb_visitors (date, count) VALUES (?, 1)
         ON DUPLICATE KEY UPDATE count = count + 1`,
        [today]
      );
      return;
    } catch (err) {
      console.warn("Error incrementing visitor in DB:", err);
    }
  }

  const records = await readFileVisitors();
  const idx = records.findIndex((r) => r.date === today);
  if (idx >= 0) {
    records[idx].count += 1;
  } else {
    records.push({ date: today, count: 1 });
  }
  if (records.length > 30) {
    records.splice(0, records.length - 30);
  }
  await writeFileVisitors(records);
}

import { query } from "@/lib/db";
import { fileGetCmsData, fileSaveCmsData, type CmsData } from "@/lib/cmsFileStore";

let useFileStore: boolean | null = null;

async function dbAvailable(): Promise<boolean> {
  if (useFileStore !== null) return !useFileStore;
  try {
    const { initDb } = await import("@/lib/db");
    await initDb();
    useFileStore = false;
    return true;
  } catch (err) {
    console.warn("DB unavailable or table creation failed, using file store:", (err as Error).message);
    useFileStore = true;
    return false;
  }
}

export async function getCmsData(): Promise<CmsData> {
  if (await dbAvailable()) {
    try {
      const rows = await query<{ data: string }[]>("SELECT data FROM wairb_cms_store WHERE id = 1");
      if (rows && rows.length > 0) {
        return typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      }
    } catch (err) {
      console.error("Failed to parse CMS data from DB", err);
    }
  }
  return fileGetCmsData();
}

export async function saveCmsData(data: CmsData): Promise<void> {
  if (await dbAvailable()) {
    const dataStr = JSON.stringify(data);
    await query(
      `INSERT INTO wairb_cms_store (id, data) VALUES (1, ?)
       ON DUPLICATE KEY UPDATE data = ?`,
      [dataStr, dataStr]
    );
    return;
  }
  return fileSaveCmsData(data);
}

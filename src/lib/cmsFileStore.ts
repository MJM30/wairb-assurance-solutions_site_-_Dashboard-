import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CMS_FILE = path.join(DATA_DIR, "cms.json");

export type CmsData = {
  pages: any[];
  sections: any[];
  articles: any[];
};

const DEFAULT_DATA: CmsData = {
  pages: [],
  sections: [],
  articles: [],
};

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(CMS_FILE);
  } catch {
    await fs.writeFile(CMS_FILE, JSON.stringify(DEFAULT_DATA, null, 2), "utf-8");
  }
}

export async function fileGetCmsData(): Promise<CmsData> {
  await ensureDataFile();
  const raw = await fs.readFile(CMS_FILE, "utf-8");
  try {
    return JSON.parse(raw) as CmsData;
  } catch (e) {
    return DEFAULT_DATA;
  }
}

export async function fileSaveCmsData(data: CmsData): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(CMS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

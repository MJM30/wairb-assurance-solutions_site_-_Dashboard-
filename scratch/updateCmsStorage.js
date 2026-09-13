const fs = require('fs');

const path = 'admin-dashboard/src/lib/cmsStorage.ts';
let content = fs.readFileSync(path, 'utf8');

// Add import
content = content.replace(
  "export type PageStatus",
  "import { apiFetch } from './api';\n\nexport type PageStatus"
);

// Add cache variables
const cacheVars = `
let cmsCache = {
  pages: [] as CmsPage[],
  sections: [] as CmsSection[],
  articles: [] as CmsArticle[],
  initialized: false
};

export async function initCmsStore() {
  try {
    const data = await apiFetch<any>('/api/cms');
    if (data && (data.pages?.length || data.sections?.length || data.articles?.length)) {
      cmsCache.pages = data.pages || [];
      cmsCache.sections = data.sections || [];
      cmsCache.articles = data.articles || [];
    } else {
      cmsCache.pages = getDefaultPages();
      cmsCache.sections = getDefaultSections();
      cmsCache.articles = getDefaultArticles();
      pushCmsToServer();
    }
  } catch (err) {
    console.error('Failed to init CMS store, using defaults', err);
    cmsCache.pages = getDefaultPages();
    cmsCache.sections = getDefaultSections();
    cmsCache.articles = getDefaultArticles();
  }
  cmsCache.initialized = true;
}

function pushCmsToServer() {
  if (!cmsCache.initialized) return;
  apiFetch('/api/cms', {
    method: 'POST',
    body: JSON.stringify({
      pages: cmsCache.pages,
      sections: cmsCache.sections,
      articles: cmsCache.articles
    })
  }).catch(e => console.error('Failed to push CMS data', e));
}
`;

content = content.replace("const CMS_PAGES_KEY = 'wairb_cms_pages';", cacheVars + "\nconst CMS_PAGES_KEY = 'wairb_cms_pages';");

// Replace getters
content = content.replace(
  /export function getCmsPages\(\): CmsPage\[\] \{[\s\S]*?\}/,
  "export function getCmsPages(): CmsPage[] { return cmsCache.pages; }"
);
content = content.replace(
  /export function getAllCmsSections\(\): CmsSection\[\] \{[\s\S]*?\}/,
  "export function getAllCmsSections(): CmsSection[] { return cmsCache.sections; }"
);
content = content.replace(
  /export function getCmsArticles\(\): CmsArticle\[\] \{[\s\S]*?\}/,
  "export function getCmsArticles(): CmsArticle[] { return cmsCache.articles; }"
);

// Replace setters (localStorage.setItem)
content = content.replace(/localStorage\.setItem\(CMS_PAGES_KEY, JSON\.stringify\(pages\)\);/g, "cmsCache.pages = pages;\n  pushCmsToServer();");
content = content.replace(/localStorage\.setItem\(CMS_SECTIONS_KEY, JSON\.stringify\(sections\)\);/g, "cmsCache.sections = sections;\n  pushCmsToServer();");
content = content.replace(/localStorage\.setItem\(CMS_SECTIONS_KEY, JSON\.stringify\(filtered\)\);/g, "cmsCache.sections = filtered;\n  pushCmsToServer();");
content = content.replace(/localStorage\.setItem\(CMS_ARTICLES_KEY, JSON\.stringify\(articles\)\);/g, "cmsCache.articles = articles;\n  pushCmsToServer();");

fs.writeFileSync(path, content);
console.log("Replaced cmsStorage.ts");

// ============================================================
// WAIRB CMS — Shared Content Management Storage & Utilities
// ============================================================

import { apiFetch } from './api';

export type PageStatus = 'published' | 'draft' | 'unpublished';
export type SectionType = 'hero' | 'stats' | 'process' | 'solutions' | 'articles' | 'faq' | 'about' | 'contact' | 'partners' | 'features' | 'timeline' | 'team' | 'banner' | 'custom';

export interface CmsImage {
  id: string;
  url: string;
  name: string;
  alt?: string;
}

export interface CmsSectionItem {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  badge?: string;
  imageUrl?: string;
  linkText?: string;
  linkUrl?: string;
  [key: string]: unknown;
}

export interface CmsSection {
  id: string;
  pageSlug: string;
  name: string;
  type: SectionType;
  order: number;
  visible: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  primaryBtnText?: string;
  primaryBtnUrl?: string;
  secondaryBtnText?: string;
  secondaryBtnUrl?: string;
  images?: CmsImage[];
  items?: CmsSectionItem[];
  extraFields?: Record<string, string>;
  updatedAt: string;
}

export interface CmsPage {
  slug: string;
  title: string;
  status: PageStatus;
  lastModified: string;
  sectionsCount: number;
}

export interface CmsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  imageUrl: string;
  author: string;
  status: PageStatus;
  createdAt: string;
  updatedAt: string;
}


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

const CMS_PAGES_KEY = 'wairb_cms_pages';
const CMS_SECTIONS_KEY = 'wairb_cms_sections';
const CMS_ARTICLES_KEY = 'wairb_cms_articles';

// ─── Pages Functions ─────────────────────────────────────────

export function getCmsPages(): CmsPage[] { return cmsCache.pages; }

export function saveCmsPage(page: CmsPage): void {
  const pages = getCmsPages();
  const idx = pages.findIndex(p => p.slug === page.slug);
  page.lastModified = new Date().toISOString();
  if (idx >= 0) pages[idx] = page;
  else pages.push(page);
  cmsCache.pages = pages;
  pushCmsToServer();
}

export function updatePageStatus(slug: string, status: PageStatus): void {
  const pages = getCmsPages();
  const page = pages.find(p => p.slug === slug);
  if (page) {
    page.status = status;
    page.lastModified = new Date().toISOString();
    cmsCache.pages = pages;
  pushCmsToServer();
  }
}

// ─── Sections Functions ──────────────────────────────────────

export function getAllCmsSections(): CmsSection[] { return cmsCache.sections; }

export function getCmsSections(pageSlug: string): CmsSection[] {
  const sections = getAllCmsSections().filter(s => s.pageSlug === pageSlug);
  return sections.sort((a, b) => a.order - b.order);
}

export function saveCmsSection(section: CmsSection): void {
  const sections = getAllCmsSections();
  section.updatedAt = new Date().toISOString();
  const idx = sections.findIndex(s => s.id === section.id);
  if (idx >= 0) {
    sections[idx] = section;
  } else {
    sections.push(section);
  }
  cmsCache.sections = sections;
  pushCmsToServer();

  // Update sections count and status on parent page
  const pageSections = sections.filter(s => s.pageSlug === section.pageSlug);
  const pages = getCmsPages();
  const pIdx = pages.findIndex(p => p.slug === section.pageSlug);
  if (pIdx >= 0) {
    pages[pIdx].sectionsCount = pageSections.length;
    pages[pIdx].status = 'draft';
    pages[pIdx].lastModified = new Date().toISOString();
    cmsCache.pages = pages;
  pushCmsToServer();
  }
}

export function deleteCmsSection(id: string): void {
  const sections = getAllCmsSections();
  const section = sections.find(s => s.id === id);
  if (!section) return;

  const filtered = sections.filter(s => s.id !== id);
  cmsCache.sections = filtered;
  pushCmsToServer();

  if (section) {
    const pageSections = filtered.filter(s => s.pageSlug === section.pageSlug);
    const pages = getCmsPages();
    const pIdx = pages.findIndex(p => p.slug === section.pageSlug);
    if (pIdx >= 0) {
      pages[pIdx].sectionsCount = pageSections.length;
      pages[pIdx].status = 'draft';
      pages[pIdx].lastModified = new Date().toISOString();
      cmsCache.pages = pages;
  pushCmsToServer();
    }
  }
}

export function toggleCmsSectionVisibility(id: string): void {
  const sections = getAllCmsSections();
  const section = sections.find(s => s.id === id);
  if (section) {
    section.visible = !section.visible;
    saveCmsSection(section);
  }
}

export function moveCmsSection(id: string, direction: 'up' | 'down'): void {
  const sections = getAllCmsSections();
  const section = sections.find(s => s.id === id);
  if (!section) return;

  const pageSections = sections
    .filter(s => s.pageSlug === section.pageSlug)
    .sort((a, b) => a.order - b.order);

  const idx = pageSections.findIndex(s => s.id === id);
  if (idx < 0) return;

  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= pageSections.length) return;

  // Swap order values
  const currentOrder = pageSections[idx].order;
  const targetOrder = pageSections[targetIdx].order;

  pageSections[idx].order = targetOrder;
  pageSections[targetIdx].order = currentOrder;

  // Persist updated orders
  pageSections.forEach(s => {
    const mainIdx = sections.findIndex(ms => ms.id === s.id);
    if (mainIdx >= 0) sections[mainIdx].order = s.order;
  });

  cmsCache.sections = sections;
  pushCmsToServer();
}

export function duplicateCmsSection(id: string): CmsSection | null {
  const sections = getAllCmsSections();
  const section = sections.find(s => s.id === id);
  if (!section) return null;

  const newSection: CmsSection = {
    ...JSON.parse(JSON.stringify(section)),
    id: `sec_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: `${section.name} (Copie)`,
    order: section.order + 1,
    updatedAt: new Date().toISOString(),
  };

  saveCmsSection(newSection);
  return newSection;
}

export function publishPageChanges(pageSlug: string): void {
  updatePageStatus(pageSlug, 'published');
}

// ─── Articles Functions ─────────────────────────────────────

export function getCmsArticles(): CmsArticle[] { return cmsCache.articles; }

export function saveCmsArticle(article: CmsArticle): void {
  const articles = getCmsArticles();
  article.updatedAt = new Date().toISOString();
  const idx = articles.findIndex(a => a.id === article.id);
  if (idx >= 0) {
    articles[idx] = article;
  } else {
    articles.unshift(article);
  }
  cmsCache.articles = articles;
  pushCmsToServer();
}

export function deleteCmsArticle(id: string): void {
  const articles = getCmsArticles().filter(a => a.id !== id);
  cmsCache.articles = articles;
  pushCmsToServer();
}

export function toggleArticlePublish(id: string): void {
  const articles = getCmsArticles();
  const article = articles.find(a => a.id === id);
  if (article) {
    article.status = article.status === 'published' ? 'draft' : 'published';
    saveCmsArticle(article);
  }
}

// ─── Defaults & Initializers ────────────────────────────────

function getDefaultPages(): CmsPage[] {
  const pages: CmsPage[] = [
    { slug: 'accueil', title: 'Accueil', status: 'published', lastModified: new Date().toISOString(), sectionsCount: 9 },
    { slug: 'nos-solutions', title: 'Nos Solutions', status: 'published', lastModified: new Date().toISOString(), sectionsCount: 4 },
    { slug: 'apropos', title: 'À Propos', status: 'published', lastModified: new Date().toISOString(), sectionsCount: 7 },
    { slug: 'contact', title: 'Contact', status: 'published', lastModified: new Date().toISOString(), sectionsCount: 4 },
    { slug: 'actualites', title: 'Actualités', status: 'published', lastModified: new Date().toISOString(), sectionsCount: 2 },
  ];
  cmsCache.pages = pages;
  pushCmsToServer();
  return pages;
}

function getDefaultSections(): CmsSection[] {
  const now = new Date().toISOString();

  const sections: CmsSection[] = [
    // ── ACCUEIL (/) ──
    {
      id: 'sec_acc_hero',
      pageSlug: 'accueil',
      name: 'Hero Principal',
      type: 'hero',
      order: 1,
      visible: true,
      title: 'Protégez ce qui compte le plus pour vous',
      subtitle: 'WAIRB DRC SAS',
      description: 'WAIRB DRC SAS, votre partenaire de confiance en courtage d\'assurance et réassurance. Des solutions sur mesure pour Tous.',
      badge: 'Garantie & Conseil',
      primaryBtnText: 'Soumettre une demande',
      primaryBtnUrl: '#demande',
      secondaryBtnText: 'Découvrir nos solutions',
      secondaryBtnUrl: '#solutions',
      images: [
        { id: 'img_01', url: '/images/img_15.jpg', name: 'Bannière 1 (Immeuble moderne)', alt: 'Immeuble moderne Kinshasa' },
        { id: 'img_02', url: '/images/img_09.jpg', name: 'Bannière 2 (Conférence)', alt: 'Conférence entreprise' }
      ],
      extraFields: {
        reassuranceText: 'Sachez que nous contacter ne vous fera pas payer plus que ce que vous deviez.'
      },
      updatedAt: now
    },
    {
      id: 'sec_acc_stats',
      pageSlug: 'accueil',
      name: 'Chiffres Clés & Satisfaction',
      type: 'stats',
      order: 2,
      visible: true,
      title: 'Nous assurons la meilleure Couverture de vos risques',
      badge: 'À propos de nous',
      description: 'WEST AFRICAN INSURANCE AND REINSURANCE BROKERS (WAIRB) est une société africaine spécialisée dans le courtage en assurances et en réassurance, intervenant en zone CIMA et hors CIMA.',
      items: [
        { id: 'stat_1', title: '98%', subtitle: 'Taux de satisfaction clients' },
        { id: 'stat_2', title: '24h', subtitle: 'Délai de réponse moyen' }
      ],
      images: [
        { id: 'img_st1', url: '/images/img_05.jpg', name: 'Image Expertise', alt: 'Expertise WAIRB' },
        { id: 'img_st2', url: '/images/img_06.jpg', name: 'Image Protection', alt: 'Protection WAIRB' }
      ],
      updatedAt: now
    },
    {
      id: 'sec_acc_process',
      pageSlug: 'accueil',
      name: 'Processus en 4 Étapes',
      type: 'process',
      order: 3,
      visible: true,
      title: 'Un processus simple, efficace en quatres étapes',
      badge: 'Notre champ d\'action',
      items: [
        { id: 'pr_1', title: '01. Évaluation de vos besoins', description: 'Nous analysons vos besoins assurantielles par rapport aux risques en cours.', imageUrl: '/images/img_03.jpg' },
        { id: 'pr_2', title: '02. Négociation & Sélection', description: 'Mise en concurrence de toutes les compagnies agréées en RDC.', imageUrl: '/images/img_02.jpg' },
        { id: 'pr_3', title: '03. Accompagnement sinistre', description: 'Suivi et respect des engagements contractuels de l\'assureur.', imageUrl: '/images/img_07.jpg' },
        { id: 'pr_4', title: '04. Sensibilisation & Suivi', description: 'Gestion quotidienne de vos contrats et formation de vos équipes.', imageUrl: '/images/img_11.jpg' }
      ],
      updatedAt: now
    },
    {
      id: 'sec_acc_solutions',
      pageSlug: 'accueil',
      name: 'Aperçu Nos Solutions',
      type: 'solutions',
      order: 4,
      visible: true,
      title: 'Nos solutions d\'assurances et de réassurance adaptées',
      badge: 'Nos Solutions',
      description: 'Sélectionnez le type d\'assurance ou réassurance qui vous convient.',
      items: [
        { id: 'sol_1', title: 'Risques Ordinaires', description: 'Automobile, Voyage, Santé, Incendie, Multirisque Habitation & Pro' },
        { id: 'sol_2', title: 'Assurance Vie', description: 'Rente éducation, Temporaire décès, Obsèques, Épargne retraite' },
        { id: 'sol_3', title: 'Risques Spéciaux', description: 'PVT, Cyber risques, RC Mandataires, RCD, Aviation, Cautions' }
      ],
      updatedAt: now
    },
    {
      id: 'sec_acc_articles',
      pageSlug: 'accueil',
      name: 'Services Spécialisés',
      type: 'articles',
      order: 5,
      visible: true,
      title: 'Assistance et Conseils sur la gestion des risques',
      badge: 'Services spécialisés',
      items: [
        { id: 'art_1', title: 'Check-up des risques en entreprise', description: 'Identifier et cartographier les risques pour éviter des pertes.' },
        { id: 'art_2', title: 'Audit du portefeuille assurance', description: 'Optimiser les contrats et réduire les coûts.' },
        { id: 'art_3', title: 'Sensibilisation & formation', description: 'Culture du risque et prévention des incidents.' }
      ],
      updatedAt: now
    },
    {
      id: 'sec_acc_faq',
      pageSlug: 'accueil',
      name: 'Foire Aux Questions (FAQ)',
      type: 'faq',
      order: 6,
      visible: true,
      title: 'Questions Fréquentes (FAQ)',
      badge: 'FAQ',
      items: [
        { id: 'faq_1', title: 'Quel est le rôle d’un courtier ?', description: 'Un courtier agit comme intermédiaire indépendant et conseille le client.' },
        { id: 'faq_2', title: 'Pourquoi passer par WAIRB ?', description: 'Pour bénéficier d’une expertise et de solutions optimisées.' },
        { id: 'faq_3', title: 'Intervenez-vous en cas de sinistre ?', description: 'Oui, WAIRB assure le suivi jusqu’au règlement effectif.' }
      ],
      updatedAt: now
    },
    {
      id: 'sec_acc_about',
      pageSlug: 'accueil',
      name: 'À Propos Synthétique',
      type: 'about',
      order: 7,
      visible: true,
      title: 'Votre courtier de confiance en RDC',
      badge: 'À Propos',
      description: 'WAIRB DRC SAS est une société de courtage en assurance basée à Kinshasa, RDC.',
      updatedAt: now
    },
    {
      id: 'sec_acc_contact',
      pageSlug: 'accueil',
      name: 'Section Contact & Formulaire',
      type: 'contact',
      order: 8,
      visible: true,
      title: 'Parlons de vos besoins en assurance et réassurance',
      badge: 'Contactez-nous',
      updatedAt: now
    },
    {
      id: 'sec_acc_partners',
      pageSlug: 'accueil',
      name: 'Carrousel des Partenaires',
      type: 'partners',
      order: 9,
      visible: true,
      title: 'Ceux qui nous font confiance',
      images: [
        { id: 'prt_1', url: '/images/prt_01.jpg', name: 'Partenaire 1' },
        { id: 'prt_2', url: '/images/prt_02.jpg', name: 'Partenaire 2' },
        { id: 'prt_3', url: '/images/prt_03.jpg', name: 'Partenaire 3' },
        { id: 'prt_4', url: '/images/prt_04.jpg', name: 'Partenaire 4' },
        { id: 'prt_5', url: '/images/prt_05.jpg', name: 'Partenaire 5' },
        { id: 'prt_6', url: '/images/prt_06.jpg', name: 'Partenaire 6' }
      ],
      updatedAt: now
    },

    // ── NOS SOLUTIONS (/nos-solutions) ──
    {
      id: 'sec_sol_hero',
      pageSlug: 'nos-solutions',
      name: 'Hero Nos Solutions',
      type: 'hero',
      order: 1,
      visible: true,
      title: 'Nos Solutions d\'Assurance et Réassurance sur Mesure',
      description: 'Découvrez notre gamme complète de produits conçus pour répondre aux défis uniques du marché congolais.',
      primaryBtnText: 'Obtenir un devis gratuit',
      images: [{ id: 'sol_hero_img', url: '/images/img_06.jpg', name: 'Bannière Solutions' }],
      updatedAt: now
    },
    {
      id: 'sec_sol_catalog',
      pageSlug: 'nos-solutions',
      name: 'Catalogue des Risques',
      type: 'features',
      order: 2,
      visible: true,
      title: 'Explorez Nos Solutions',
      badge: 'Notre Catalogue',
      description: 'Une gamme complète de produits d\'assurance et réassurance.',
      items: [
        { id: 'cat_ord', title: 'Risques Ordinaires', description: 'Automobile, Santé, Voyage, Facultés, Incendie, Transport' },
        { id: 'cat_spec', title: 'Risques Spéciaux', description: 'Risques techniques, Cyber, RCMS, RCD, Cautions, Aviation' }
      ],
      updatedAt: now
    },
    {
      id: 'sec_sol_list',
      pageSlug: 'nos-solutions',
      name: 'Liste des Solutions Détaillées',
      type: 'solutions',
      order: 3,
      visible: true,
      title: 'Solutions Détaillées',
      items: [
        { id: 'sol_auto', title: 'Assurance Automobile', description: 'Protégez votre véhicule et vous-même avec une couverture complète.', imageUrl: '/images/img_12.jpg' },
        { id: 'sol_sante', title: 'Assurance Santé', description: 'Honoraires médicaux, hospitalisation, soins dentaires.', imageUrl: '/images/img_32.jpg' },
        { id: 'sol_voyage', title: 'Assurance Voyage', description: 'Annulation, perte de bagages, assistance médicale.', imageUrl: '/images/img_33.jpg' },
        { id: 'sol_facultes', title: 'Assurance Facultés', description: 'Protection complète pour établissements d\'enseignement.', imageUrl: '/images/img_34.jpg' },
        { id: 'sol_multirisque', title: 'Multirisque Professionnelle & Habitation', description: 'Protection des biens et responsabilités.', imageUrl: '/images/img_10.jpg' },
        { id: 'sol_tech', title: 'Les Risques Techniques', description: 'Tous risques chantier, montage, installation.', imageUrl: '/images/img_35.jpg.jpg' }
      ],
      updatedAt: now
    },

    // ── À PROPOS (/apropos) ──
    {
      id: 'sec_ap_hero',
      pageSlug: 'apropos',
      name: 'Hero À Propos',
      type: 'hero',
      order: 1,
      visible: true,
      title: 'WAIRB DRC : Votre conseiller en assurance et réassurance',
      description: 'Forts d\'une présence solide en République Démocratique du Congo, nous redéfinissons le courtage en assurance.',
      primaryBtnText: 'Nos Valeurs',
      secondaryBtnText: 'Découvrir l\'équipe',
      images: [{ id: 'ap_hero_img', url: '/images/img_31.jpg', name: 'Fond À Propos' }],
      updatedAt: now
    },
    {
      id: 'sec_ap_timeline',
      pageSlug: 'apropos',
      name: 'Notre Histoire & Chronologie',
      type: 'timeline',
      order: 2,
      visible: true,
      title: 'Évolution & Croissance',
      badge: 'Notre Histoire',
      items: [
        { id: 'tm_2020', title: '2020 — Fondation d\'Origine', description: 'Création de WAIRB à Abidjan, Côte d\'Ivoire.' },
        { id: 'tm_2025', title: '2025 — Expansion en RDC', description: 'Création à Kinshasa (RDC) pour rapprocher nos services d\'Afrique centrale.' }
      ],
      updatedAt: now
    },
    {
      id: 'sec_ap_values',
      pageSlug: 'apropos',
      name: 'Mission, Vision & Valeurs',
      type: 'features',
      order: 3,
      visible: true,
      title: 'Nos Engagements',
      items: [
        { id: 'val_1', title: 'Mission', description: 'Accompagner l\'analyse et l\'optimisation des risques.' },
        { id: 'val_2', title: 'Vision', description: 'Créer une marque africaine de référence en courtage.' },
        { id: 'val_3', title: 'Valeurs', description: 'Professionnalisme, Réactivité, Excellence, Innovation.' }
      ],
      updatedAt: now
    },
    {
      id: 'sec_ap_gov',
      pageSlug: 'apropos',
      name: 'Gouvernance & Administration',
      type: 'about',
      order: 4,
      visible: true,
      title: 'Conseil d\'Administration',
      badge: 'Gouvernance',
      description: 'Une équipe de visionnaires guidant WAIRB DRC SAS vers l\'excellence.',
      images: [{ id: 'gov_img', url: '/images/madame_kone.jpg', name: 'Manager Général' }],
      updatedAt: now
    },
    {
      id: 'sec_ap_dg',
      pageSlug: 'apropos',
      name: 'Direction Générale',
      type: 'about',
      order: 5,
      visible: true,
      title: 'Un Leadership de Proximité et d\'Expertise',
      badge: 'Direction Générale',
      description: 'La direction de WAIRB DRC SAS s\'appuie sur plusieurs années d\'expérience.',
      images: [{ id: 'dg_img', url: '/images/img_president.png', name: 'Président WAIRB DRC' }],
      updatedAt: now
    },
    {
      id: 'sec_ap_team',
      pageSlug: 'apropos',
      name: 'Galerie Équipes',
      type: 'team',
      order: 6,
      visible: true,
      title: 'Le Cœur de notre Société',
      badge: 'Nos Équipes',
      images: [
        { id: 'tm_1', url: '/images/img_21.jpg', name: 'Équipe 1' },
        { id: 'tm_2', url: '/images/img_22.jpg', name: 'Équipe 2' },
        { id: 'tm_3', url: '/images/img_23.jpg', name: 'Équipe 3' },
        { id: 'tm_4', url: '/images/img_25.jpg', name: 'Équipe 4' }
      ],
      updatedAt: now
    },

    // ── CONTACT (/contact) ──
    {
      id: 'sec_ct_hero',
      pageSlug: 'contact',
      name: 'Bannière & Vidéo Contact',
      type: 'hero',
      order: 1,
      visible: true,
      title: 'Contactez WAIRB DRC',
      updatedAt: now
    },
    {
      id: 'sec_ct_coords',
      pageSlug: 'contact',
      name: 'Nos Coordonnées',
      type: 'contact',
      order: 2,
      visible: true,
      title: 'Nos Coordonnées Kinshasa & Abidjan',
      items: [
        { id: 'ct_email', title: 'E-mails', description: 'contact@wairb.com | fleury.ngoma@wairb.com' },
        { id: 'ct_phone', title: 'Téléphones', description: 'Kin: +243 962 778 967 | Abj: +225 27 22 40 03' },
        { id: 'ct_kin', title: 'Kinshasa (RDC)', description: 'M8X7+J82, Dongo, Kinshasa' },
        { id: 'ct_abj', title: 'Abidjan (RCI)', description: 'Cocody Riviera Palmeraie 3e étage' }
      ],
      updatedAt: now
    },

    // ── ACTUALITÉS (/actualites) ──
    {
      id: 'sec_act_hero',
      pageSlug: 'actualites',
      name: 'Hero Actualités',
      type: 'hero',
      order: 1,
      visible: true,
      title: 'Actualités & Insights',
      badge: 'Mises à jour',
      description: 'Restez informés des dernières tendances en matière d\'assurance et réassurance.',
      images: [{ id: 'act_hero_img', url: '/images/img_21.jpg', name: 'Fond Actualités' }],
      updatedAt: now
    }
  ];

  cmsCache.sections = sections;
  pushCmsToServer();
  return sections;
}

function getDefaultArticles(): CmsArticle[] {
  const now = new Date().toISOString();
  const articles: CmsArticle[] = [
    {
      id: 'art_001',
      title: 'Agrément ARCA obtenu : Une nouvelle ère pour WAIRB en RDC',
      slug: 'agrement-arca-wairb-rdc',
      category: 'Institutionnel',
      excerpt: 'WAIRB DRC SAS a officiellement obtenu son agrément sous le numéro 060/2025 pour opérer en courtage d\'assurance.',
      content: 'WAIRB DRC SAS poursuit son expansion stratégique en Afrique Centrale avec l\'obtention officielle de son agrément par l\'Autorité de Régulation et de Contrôle des Assurances (ARCA). Cet agrément renforce notre mission d\'apporter un conseil indépendant et transparent à nos clients.',
      date: '15 Mai 2025',
      imageUrl: '/images/img_15.jpg',
      author: 'Direction de la Communication',
      status: 'published',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'art_002',
      title: 'Gestion des risques d\'entreprises : Pourquoi réaliser un audit d\'assurance ?',
      slug: 'pourquoi-realiser-audit-assurance',
      category: 'Conseil & Prévention',
      excerpt: 'Identifier, analyser et cartographier les risques permet d’éviter des pertes majeures en cas de sinistre.',
      content: 'Un audit complet du portefeuille d\'assurance permet d\'identifier les doublons, d\'ajuster les franchises et d\'éliminer la sous-assurance. Nos experts analysent les contrats actuels pour garantir une couverture maximale au tarif le plus juste.',
      date: '28 Avril 2025',
      imageUrl: '/images/img_09.jpg',
      author: 'Équipe Technique WAIRB',
      status: 'published',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'art_003',
      title: 'Assurance Violence Politique & Terrorisme (PVT) : Ce qu\'il faut savoir',
      slug: 'assurance-pvt-explications',
      category: 'Risques Spéciaux',
      excerpt: 'Découvrez notre solution spécialisée pour protéger vos actifs contre les émeutes, grèves et mouvements sociaux.',
      content: 'Les risques politiques et émeutes requièrent des garanties spécifiques que les polices incendie classiques n\'accordent pas toujours. WAIRB négocie des couvertures PVT sur mesure auprès de réassureurs internationaux premier rang.',
      date: '10 Mars 2025',
      imageUrl: '/images/img_06.jpg',
      author: 'Département Réassurance',
      status: 'published',
      createdAt: now,
      updatedAt: now
    }
  ];

  cmsCache.articles = articles;
  pushCmsToServer();
  return articles;
}

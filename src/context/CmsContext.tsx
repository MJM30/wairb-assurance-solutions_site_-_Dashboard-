"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CmsData = {
  pages: any[];
  sections: any[];
  articles: any[];
};

const CmsContext = createContext<CmsData | null>(null);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CmsData | null>(null);

  useEffect(() => {
    fetch("/api/cms")
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          setData(json as CmsData);
        }
      })
      .catch((err) => console.error("Failed to load CMS data", err));
  }, []);

  return <CmsContext.Provider value={data}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const context = useContext(CmsContext);
  return context; // Can be null while loading, components must handle fallback
}

export function useCmsPage(pageSlug: string) {
  const context = useCms();
  if (!context) return { page: null, sections: [], loading: true };

  const page = context.pages.find((p: any) => p.slug === pageSlug) || null;
  const sections = context.sections
    .filter((s: any) => s.pageSlug === pageSlug && s.visible)
    .sort((a: any, b: any) => a.order - b.order);

  return { page, sections, loading: false };
}

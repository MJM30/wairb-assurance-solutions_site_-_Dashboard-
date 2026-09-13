"use client";

import { useState, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import AboutStatsSection from "@/components/AboutStatsSection";
import ProcessSection from "@/components/ProcessSection";
import ArticlesSection from "@/components/ArticlesSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import MultiStepForm from "@/components/MultiStepForm";
import PartnersMarquee from "@/components/PartnersMarquee";
import { useCmsPage } from "@/context/CmsContext";

export default function IndexPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [preselectedType, setPreselectedType] = useState("");
  const { sections, loading } = useCmsPage('accueil');

  const openForm = useCallback(() => {
    setPreselectedType("");
    setFormOpen(true);
  }, []);

  const openFormWithType = useCallback((type: string) => {
    setPreselectedType(type);
    setFormOpen(true);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const isVisible = (id: string) => {
    if (loading) return true; // Show by default while loading
    return sections.some((s: any) => s.id === id);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full max-w-full">
      <Navbar onRequestClick={openForm} />
      <main className="overflow-x-hidden w-full max-w-full">
        {isVisible('sec_acc_hero') && <HeroSection onRequestClick={openForm} />}
        {isVisible('sec_acc_stats') && <AboutStatsSection />}
        {isVisible('sec_acc_process') && <ProcessSection />}
        {isVisible('sec_acc_solutions') && <ServicesSection onSelectInsurance={openFormWithType} />}
        {isVisible('sec_acc_articles') && <ArticlesSection />}
        {isVisible('sec_acc_faq') && <FaqSection />}
        {isVisible('sec_acc_about') && <AboutSection />}
        {isVisible('sec_acc_contact') && <ContactSection />}
      </main>
      {isVisible('sec_acc_partners') && <PartnersMarquee />}
      <Footer />
      <MultiStepForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        preselectedType={preselectedType}
      />
    </div>
  );
}

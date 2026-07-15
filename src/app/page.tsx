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

export default function IndexPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [preselectedType, setPreselectedType] = useState("");

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar onRequestClick={openForm} />
      <main>
        <HeroSection onRequestClick={openForm} />
        <AboutStatsSection />
        <ProcessSection />
        <ServicesSection onSelectInsurance={openFormWithType} />
        <ArticlesSection />
        <FaqSection />
        <AboutSection />
        <ContactSection />
      </main>
      <PartnersMarquee />
      <Footer />
      <MultiStepForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        preselectedType={preselectedType}
      />
    </div>
  );
}

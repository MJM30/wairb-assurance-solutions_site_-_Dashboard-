"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const contactSlides = [
  {
    label: "E-mails",
    lines: ["contact@wairb.com", "fleury.ngoma@wairb.com"],
  },
  {
    label: "Téléphones",
    lines: ["Kin: +243 962 778 967", "Abj: +225 27 22 40 03"],
  },
  {
    label: "Localisations",
    lines: [
      "Kinshasa (RDC) : M8X7+J82, Dongo, Kinshasa",
      "Abidjan (RCI) : Cocody Riviera Palmeraie, 3e étage, face à la Sodéci"
    ],
  },
];

const ContactTicker = () => {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Hide the current slide (fade out)
      setVisible(false);

      // 2. Wait for fade out to finish, update active slide, then fade back in
      setTimeout(() => {
        setActive((prev) => (prev + 1) % contactSlides.length);
        setVisible(true);
      }, 500); // Match transition duration
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const slide = contactSlides[active];

  return (
    <div className="container px-4 mx-auto">
      <div 
        className={`transition-all duration-500 ease-in-out ${
          visible 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 -translate-y-2"
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <span className="badge-primary mb-3 text-xs font-bold uppercase tracking-wider bg-primary/20 backdrop-blur-sm border border-primary/50 text-white">
            {slide.label}
          </span>
          <div className="space-y-2">
            {slide.lines.map((line, j) => (
              <p key={j} className="text-white text-base md:text-lg font-bold leading-normal tracking-wide">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  const [formState, setFormState] = useState({
    nom: "",
    postNom: "",
    prenom: "",
    email: "",
    adresse: "",
    preoccupation: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Message envoyé avec succès !");
      setFormState({
        nom: "",
        postNom: "",
        prenom: "",
        email: "",
        adresse: "",
        preoccupation: ""
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onRequestClick={() => {}} />
      
      {/* Hero Header */}
      <section className="relative h-screen min-h-[600px] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/images/background_contact.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Ticker banner block aligned to the bottom margin */}
        <div className="relative z-10 w-full bg-black/60 backdrop-blur-sm py-8 border-t border-white/10">
          <ContactTicker />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Form Column */}
            <Reveal animation="reveal-left">
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-black/30 border border-primary/5">
                <h2 className="text-2xl font-bold mb-8">Envoyez-nous un message</h2>
                
                {isSuccess ? (
                  <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Merci !</h3>
                    <p className="text-muted-foreground mb-8">Votre message a été envoyé. Nous vous répondrons dans les plus brefs délais.</p>
                    <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-full px-8">Envoyer un autre message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Nom</label>
                        <Input 
                          name="nom" 
                          placeholder="Votre nom" 
                          required 
                          value={formState.nom}
                          onChange={handleChange}
                          className="bg-white/60 border border-white/80 transition-all h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Post-Nom</label>
                        <Input 
                          name="postNom" 
                          placeholder="Votre post-nom" 
                          required 
                          value={formState.postNom}
                          onChange={handleChange}
                          className="bg-white/60 border border-white/80 transition-all h-12"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Prénom</label>
                      <Input 
                        name="prenom" 
                        placeholder="Votre prénom" 
                        required 
                        value={formState.prenom}
                        onChange={handleChange}
                        className="bg-white/60 border border-white/80 transition-all h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Adresse Mail</label>
                      <Input 
                        name="email" 
                        type="email" 
                        placeholder="nom@exemple.com" 
                        required 
                        value={formState.email}
                        onChange={handleChange}
                        className="bg-white/60 border border-white/80 transition-all h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Adresse Physique</label>
                      <Input 
                        name="adresse" 
                        placeholder="Ex: Kinshasa, Gombe" 
                        required 
                        value={formState.adresse}
                        onChange={handleChange}
                        className="bg-white/60 border border-white/80 transition-all h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Votre Préoccupation</label>
                      <Textarea 
                        name="preoccupation" 
                        placeholder="Comment pouvons-nous vous aider ?" 
                        required 
                        rows={5}
                        value={formState.preoccupation}
                        onChange={handleChange}
                        className="bg-white/60 border border-white/80 transition-all resize-none"
                      />
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-xl font-bold text-lg group">
                      {isSubmitting ? "Envoi en cours..." : (
                        <>
                          Envoyer le message
                          <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </Reveal>

            {/* Info & Map Column */}
            <div className="space-y-10">
              <Reveal animation="reveal-right">
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold">Nos Coordonnées</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-6 bg-surface-sunken rounded-2xl border border-primary/5">
                      <a href="mailto:contact@wairb.com" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 hover:bg-primary/20 transition-colors cursor-pointer">
                        <Mail className="h-5 w-5 text-primary" />
                      </a>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">E-mails</p>
                        <a href="mailto:contact@wairb.com" className="font-semibold break-all text-sm mb-1 hover:text-primary transition-colors block">contact@wairb.com</a>
                        <a href="mailto:fleury.ngoma@wairb.com" className="font-semibold break-all text-sm hover:text-primary transition-colors block">fleury.ngoma@wairb.com</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-6 bg-surface-sunken rounded-2xl border border-primary/5">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                        <Phone className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Téléphones</p>
                        <p className="font-semibold text-sm mb-1">Kin: +243 962 778 967</p>
                        <p className="font-semibold text-sm">Abj: +225 27 22 40 03</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-6 bg-surface-sunken rounded-2xl border border-primary/5">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Kinshasa (RDC)</p>
                        <p className="font-semibold text-sm leading-relaxed">M8X7+J82, Dongo, Kinshasa</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Abidjan (RCI)</p>
                        <p className="font-semibold text-sm leading-relaxed">Cocody Riviera Palmeraie<br/>3e étage, face à la Sodéc</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal animation="reveal-scale" delay={200}>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Géo-localisation (Kinshasa)</h2>
                  <div className="rounded-3xl overflow-hidden h-[400px] shadow-2xl border-4 border-white bg-slate-50">
                    <iframe 
                      src="https://www.google.com/maps?q=M8X7%2BJ82,+Dongo,+Kinshasa&output=embed" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
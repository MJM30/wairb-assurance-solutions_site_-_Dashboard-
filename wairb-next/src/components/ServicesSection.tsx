import { Home, Building2, AlertTriangle, Car, ArrowRight, Target, Heart } from "lucide-react";
import Reveal from "./Reveal";

interface ServicesSectionProps {
  onSelectInsurance: (type: string) => void;
}

const services = [
  {
    id: "habitation",
    icon: Home,
    title: "Assurance Habitation",
    description: "Protection complète de votre résidence, mobilier et responsabilité civile familiale.",
    badge: "Particulier",
  },
  {
    id: "professionnelle",
    icon: Building2,
    title: "Multirisque Professionnelle",
    description: "Couverture intégrale pour vos locaux, équipements, stocks et responsabilité professionnelle.",
    badge: "Entreprise",
  },
  {
    id: "pvt",
    icon: AlertTriangle,
    title: "Violence Politique & Terrorisme",
    description: "Protection spécialisée contre les risques de violence politique, terrorisme et émeutes.",
    badge: "Spécialisé",
  },
  {
    id: "auto",
    icon: Car,
    title: "Assurance Automobile",
    description: "Couverture adaptée pour vos véhicules : RC, vol, incendie, dommages et assistance.",
    badge: "Véhicule",
  },
];

const ServicesSection = ({ onSelectInsurance }: ServicesSectionProps) => {
  return (
    <section id="solutions" className="py-20 bg-background overflow-hidden">
      <div className="container">
        <div className="max-w-xl mb-12">
          <Reveal animation="reveal">
            <span className="badge-primary mb-3 inline-block">Nos Solutions</span>
          </Reveal>
          <Reveal animation="reveal" delay={200}>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 tracking-tight">
              Des assurances et réassurances adaptées à vos besoins
            </h2>
          </Reveal>
          <Reveal animation="reveal" delay={400}>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sélectionnez le type d'assurance ou réassurance qui vous convient pour recevoir un devis personnalisé de notre équipe d'experts.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Risques Ordinaires */}
          <Reveal animation="reveal-left">
            <div className="group h-full bg-white border border-primary/5 rounded-[2rem] p-8 md:p-10 card-shadow hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Risques Ordinaires</h3>
                    <p className="text-xs text-muted-foreground">Solutions d'assurance et réassurance quotidiennes</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Automobile", "Voyage", "Santé", "Incendie", "Multirisque Habitation", 
                    "Multirisque Professionnelle", "Transport", "Risques techniques"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground font-medium">{item}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-primary text-xs font-bold mt-2">
                    Et bien plus encore...
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all cursor-pointer" onClick={() => onSelectInsurance("ordinaire")}>
                    Voir tout le catalogue
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Assurance Vie */}
          <Reveal animation="reveal-left" delay={200}>
            <div className="group h-full bg-green-900 border border-green-800 rounded-[2rem] p-8 md:p-10 card-shadow hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-green-800/30 rounded-full blur-2xl group-hover:bg-green-800/40 transition-colors" />

              <div className="relative z-10 text-white">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Assurance Vie</h3>
                    <p className="text-xs text-white/70">Protection pour vous et vos proches</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "La rente éducation", "Temporaire décès", "Obsèques", "Épargne retraite"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <span className="text-sm text-white/90 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Risques Spéciaux */}
          <Reveal animation="reveal-right">
            <div className="group h-full bg-white border border-primary/5 rounded-[2rem] p-8 md:p-10 card-shadow hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Risques Spéciaux</h3>
                    <p className="text-xs text-muted-foreground">Expertise technique &amp; haut de gamme</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Violence politique (PVT)", "Cyber risques", "RC Mandataires (RCMS)",
                    "RC Décennale (RCD)", "Aviation", "Crédits et cautions"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all cursor-pointer" onClick={() => onSelectInsurance("special")}>
                    Demander une expertise
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

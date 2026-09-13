"use client";

import { useState, useCallback } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StepProgress from "@/components/StepProgress";
import ClientInfoForm, { ClientInfo } from "@/components/ClientInfoForm";
import InsuranceTypeSelector from "@/components/InsuranceTypeSelector";
import HabitationForm from "@/components/forms/HabitationForm";
import ProfessionnelleForm from "@/components/forms/ProfessionnelleForm";
import PVTForm from "@/components/forms/PVTForm";
import AutoForm from "@/components/forms/AutoForm";
import CautionForm from "@/components/forms/CautionForm";
import SanteForm from "@/components/forms/SanteForm";
import RCManifestationForm from "@/components/forms/RCManifestationForm";
import RCProfessionnelleForm from "@/components/forms/RCProfessionnelleForm";
import TousRisquesChantiersForm from "@/components/forms/TousRisquesChantiersForm";
import ManipulationProduitsPetroliersForm from "@/components/forms/ManipulationProduitsPetroliersForm";

interface MultiStepFormProps {
  open: boolean;
  onClose: () => void;
  preselectedType?: string;
}

const generateRef = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "WAIRB-";
  for (let i = 0; i < 8; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
};

const TYPE_LABELS: Record<string, string> = {
  habitation: "Assurance Habitation",
  professionnelle: "Multirisque Professionnelle",
  pvt: "Violence Politique & Terrorisme",
  auto: "Assurance Automobile",
  caution: "Caution",
  sante: "Assurance Santé",
  rc_manifestation: "RC Manifestation",
  rc_pro: "RC Professionnelle",
  trc: "Tous Risques Chantiers",
  petrole: "Produits Pétroliers",
};

const MultiStepForm = ({ open, onClose, preselectedType }: MultiStepFormProps) => {
  const [step, setStep] = useState(1);
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    nom: "", email: "", telephone: "", adressePhysique: "",
    adressePostale: "", domaineActivite: "", ville: "", pays: "RDC",
  });
  const [insuranceType, setInsuranceType] = useState(preselectedType || "");
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectType = useCallback((type: string) => {
    setInsuranceType(type);
    setStep(3);
  }, []);

  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    const ref = generateRef();
    setIsLoading(true);
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: clientInfo.nom,
          email: clientInfo.email,
          telephone: clientInfo.telephone,
          adressePhysique: clientInfo.adressePhysique,
          adressePostale: clientInfo.adressePostale,
          domaineActivite: clientInfo.domaineActivite,
          ville: clientInfo.ville,
          pays: clientInfo.pays,
          typeAssurance: insuranceType,
          typeAssuranceLabel: TYPE_LABELS[insuranceType] || insuranceType,
          matricule: ref,
          detailsAssurance: data,
        }),
      });

      if (!response.ok) {
        throw new Error("Échec de l'enregistrement du client");
      }

      setRefNumber(ref);
      setSubmitted(true);
    } catch (err) {
      console.error("Error saving client:", err);
      alert("Impossible d'enregistrer la demande pour le moment. Vérifiez que la base de données est bien démarrée.");
    } finally {
      setIsLoading(false);
    }
  }, [clientInfo, insuranceType]);

  const resetForm = useCallback(() => {
    setStep(1);
    setClientInfo({ nom: "", email: "", telephone: "", adressePhysique: "", adressePostale: "", domaineActivite: "", ville: "", pays: "RDC" });
    setInsuranceType("");
    setSubmitted(false);
    setRefNumber("");
    onClose();
  }, [onClose]);

  const stepLabels = ["Informations", "Type d'assurance", "Formulaire"];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center bg-foreground/30 backdrop-blur-sm overflow-y-auto py-6 transition-opacity duration-[2000ms] ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={(e) => e.target === e.currentTarget && resetForm()}
    >
      <div className="bg-card w-full max-w-3xl mx-4 rounded-xl border card-shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-sm font-bold text-foreground">
              Soumettre une demande d'assurance
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Remplissez le formulaire ci-dessous</p>
          </div>
          <button onClick={resetForm} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label="Fermer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-12 space-y-5">
              <div className="mx-auto w-16 h-16 rounded-xl bg-accent flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                Demande envoyée avec succès !
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Votre demande a été enregistrée dans notre base de données. Notre équipe vous contactera sous 24h.
              </p>
              <div className="inline-block px-5 py-3 rounded-xl bg-accent border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Numéro de référence</p>
                <p className="text-lg font-extrabold text-accent-foreground font-mono mt-0.5">{refNumber}</p>
              </div>
              <div>
                <Button onClick={resetForm} className="rounded-lg">Fermer</Button>
              </div>
            </div>
          ) : (
            <>
              <StepProgress currentStep={step} totalSteps={3} labels={stepLabels} />

              {step === 1 && (
                <ClientInfoForm data={clientInfo} onChange={setClientInfo} onNext={() => setStep(2)} />
              )}
              {step === 2 && (
                <InsuranceTypeSelector onSelect={handleSelectType} onBack={() => setStep(1)} />
              )}
              {step === 3 && insuranceType === "habitation" && (
                <HabitationForm onBack={() => setStep(2)} onSubmit={handleSubmit} />
              )}
              {step === 3 && insuranceType === "professionnelle" && (
                <ProfessionnelleForm onBack={() => setStep(2)} onSubmit={handleSubmit} />
              )}
              {step === 3 && insuranceType === "pvt" && (
                <PVTForm onBack={() => setStep(2)} onSubmit={handleSubmit} />
              )}
              {step === 3 && insuranceType === "auto" && (
                <AutoForm onBack={() => setStep(2)} onSubmit={handleSubmit} />
              )}
              {step === 3 && insuranceType === "caution" && (
                <CautionForm onBack={() => setStep(2)} onSubmit={handleSubmit} />
              )}
              {step === 3 && insuranceType === "sante" && (
                <SanteForm onBack={() => setStep(2)} onSubmit={handleSubmit} />
              )}
              {step === 3 && insuranceType === "rc_manifestation" && (
                <RCManifestationForm onBack={() => setStep(2)} onSubmit={handleSubmit} />
              )}
              {step === 3 && insuranceType === "rc_pro" && (
                <RCProfessionnelleForm onBack={() => setStep(2)} onSubmit={handleSubmit} />
              )}
              {step === 3 && insuranceType === "trc" && (
                <TousRisquesChantiersForm onBack={() => setStep(2)} onSubmit={handleSubmit} />
              )}
              {step === 3 && insuranceType === "petrole" && (
                <ManipulationProduitsPetroliersForm onBack={() => setStep(2)} onSubmit={handleSubmit} />
              )}
              {isLoading && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;

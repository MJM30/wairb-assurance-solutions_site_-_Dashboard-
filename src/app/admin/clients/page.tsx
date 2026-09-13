"use client";

import { useEffect, useState } from "react";
import { Users, Search, CheckCircle, Clock, Trash2, FileText } from "lucide-react";

const PRICES: Record<string, number> = {
  habitation: 450, professionnelle: 1200, pvt: 2500, auto: 380,
  caution: 800, sante: 600, rc_manifestation: 300, rc_pro: 1000, trc: 3500, petrole: 5000,
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadClients = () => {
    setLoading(true);
    fetch("/api/clients")
      .then(r => r.json())
      .then(data => setClients(data.clients || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadClients(); }, []);

  const filtered = clients.filter(c =>
    c.nom?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.matricule?.toLowerCase().includes(search.toLowerCase())
  );

  const togglePayment = async (c: any) => {
    const newStatut = c.statut === "paye" ? "en_attente" : "paye";
    await fetch(`/api/clients/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: newStatut, montantPaye: PRICES[c.typeAssurance] || 0 }),
    });
    loadClients();
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Supprimer ce client ?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    loadClients();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Tous les clients</h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{clients.length} clients enregistrés</p>
        </div>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            style={{
              paddingLeft: 32, paddingRight: 12, height: 36,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", width: 200,
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Chargement...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                {["Nom", "Email", "Téléphone", "Type Assurance", "Matricule", "Statut", "Date", "Actions"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "10px 14px", color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}>{c.nom}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{c.email}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{c.telephone}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)" }}>{c.typeAssuranceLabel}</td>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "#22c55e", fontSize: 11 }}>{c.matricule}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: c.statut === "paye" ? "rgba(34,197,94,0.12)" : "rgba(234,179,8,0.12)",
                      color: c.statut === "paye" ? "#22c55e" : "#eab308",
                      display: "inline-flex", alignItems: "center", gap: 4,
                    }}>
                      {c.statut === "paye" ? <CheckCircle size={11} /> : <Clock size={11} />}
                      {c.statut === "paye" ? "Payé" : "En attente"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.3)", fontSize: 11, whiteSpace: "nowrap" }}>
                    {new Date(c.dateInscription).toLocaleDateString("fr-FR")}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => togglePayment(c)}
                        title={c.statut === "paye" ? "Marquer impayé" : "Marquer payé"}
                        style={{
                          width: 30, height: 30, borderRadius: 6, border: "none",
                          background: c.statut === "paye" ? "rgba(234,179,8,0.12)" : "rgba(34,197,94,0.12)",
                          color: c.statut === "paye" ? "#eab308" : "#22c55e",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {c.statut === "paye" ? <Clock size={13} /> : <CheckCircle size={13} />}
                      </button>
                      <button
                        onClick={() => deleteClient(c.id)}
                        title="Supprimer"
                        style={{
                          width: 30, height: 30, borderRadius: 6, border: "none",
                          background: "rgba(239,68,68,0.12)",
                          color: "#f87171",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
                    Aucun client trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

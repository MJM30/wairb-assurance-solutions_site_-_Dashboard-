"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Users, CheckCircle, Clock, DollarSign,
  TrendingUp, Eye, ArrowRight, Home, Car, Building2, AlertTriangle,
} from "lucide-react";

const COLORS: Record<string, string> = {
  habitation: "#16c784",
  auto: "#3b82f6",
  professionnelle: "#f59e0b",
  pvt: "#ef4444",
};

const PRICES: Record<string, number> = {
  habitation: 450, professionnelle: 1200, pvt: 2500, auto: 380,
  caution: 800, sante: 600, rc_manifestation: 300, rc_pro: 1000, trc: 3500, petrole: 5000,
};

function StatCard({ icon: Icon, label, value, sub, color, onClick }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
  color: string; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: 20,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: `${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${color}30`,
        }}>
          <Icon size={20} color={color} />
        </div>
        {onClick && <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.3)", marginTop: 4 }} />}
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
          {value}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500, marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/clients").then(r => r.json()),
      fetch("/api/visitors").then(r => r.json()),
    ]).then(([clientsData, visitorsData]) => {
      setClients(clientsData.clients || []);
      setVisitors(visitorsData.visitors || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const paid = clients.filter(c => c.statut === "paye");
  const pending = clients.filter(c => c.statut === "en_attente");
  const totalRevenue = paid.reduce((sum: number, c: any) => sum + (c.montantPaye || PRICES[c.typeAssurance] || 0), 0);

  const typeData = Object.entries(
    clients.reduce((acc: any, c: any) => {
      acc[c.typeAssurance] = (acc[c.typeAssurance] || 0) + 1;
      return acc;
    }, {})
  ).map(([type, count]) => ({ name: type, value: count }));

  const recentClients = [...clients].sort((a, b) => new Date(b.dateInscription).getTime() - new Date(a.dateInscription).getTime()).slice(0, 5);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.4)", flexDirection: "column", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(34,197,94,0.3)", borderTopColor: "#22c55e", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: 13 }}>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard icon={Users} label="Total Clients" value={clients.length} color="#3b82f6" onClick={() => router.push("/admin/clients")} />
        <StatCard icon={CheckCircle} label="Clients Payés" value={paid.length} color="#22c55e" onClick={() => router.push("/admin/clients-payes")} />
        <StatCard icon={Clock} label="En Attente" value={pending.length} color="#f59e0b" onClick={() => router.push("/admin/clients")} />
        <StatCard icon={DollarSign} label="Revenus" value={`$${totalRevenue.toLocaleString()}`} color="#22c55e" />
        <StatCard icon={Eye} label="Visiteurs Récents" value={visitors.reduce((s: number, v: any) => s + (v.count || 0), 0)} color="#a78bfa" sub="30 derniers jours" />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Pie Chart */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Répartition par assurance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {typeData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[entry.name] || "#6b7280"} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Visitors Bar Chart */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Visiteurs (30 derniers jours)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={visitors.slice(0, 15)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Clients Table */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Derniers clients</h3>
          <button onClick={() => router.push("/admin/clients")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#22c55e", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            Voir tout <ArrowRight size={14} />
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Nom", "Type d'assurance", "Matricule", "Statut", "Date"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentClients.map((c: any) => (
                <tr key={c.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "10px 12px", color: "#fff", fontWeight: 600 }}>{c.nom}</td>
                  <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.5)" }}>{c.typeAssuranceLabel}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "monospace", color: "#22c55e", fontSize: 11 }}>{c.matricule}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: c.statut === "paye" ? "rgba(34,197,94,0.12)" : "rgba(234,179,8,0.12)",
                      color: c.statut === "paye" ? "#22c55e" : "#eab308",
                    }}>
                      {c.statut === "paye" ? "Payé" : "En attente"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
                    {new Date(c.dateInscription).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
              {recentClients.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "24px 12px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                    Aucun client dans la base de données.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Clock, ArrowRight, Sun, Moon } from "lucide-react";

const titles: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/clients": "Tous les clients",
  "/admin/clients-payes": "Clients payés",
  "/admin/assurances": "Statistiques des assurances",
  "/admin/partenaires": "Assureurs partenaires",
  "/admin/budget": "Progression du budget",
  "/admin/visiteurs": "Visiteurs du site",
  "/admin/expenses": "Dépenses",
  "/admin/utilisateurs": "Gestion des comptes",
};

export default function AdminTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const title = titles[pathname] ?? "WAIRB Admin";

  const [isDark, setIsDark] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [pendingClients, setPendingClients] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  const role = typeof window !== "undefined" ? (localStorage.getItem("wairb_admin_role") || "admin") : "admin";
  const userName = typeof window !== "undefined" ? (localStorage.getItem("wairb_user_name") || "Admin") : "Admin";

  // Load pending clients from API
  useEffect(() => {
    fetch("/api/clients")
      .then(r => r.json())
      .then(data => {
        if (data.clients) {
          setPendingClients(data.clients.filter((c: any) => c.statut === "en_attente").slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const theme = typeof window !== "undefined" ? localStorage.getItem("wairb_admin_theme") : null;
    setIsDark(theme === "dark");
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("wairb_admin_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("wairb_admin_theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header style={{
      height: 60,
      background: "rgba(13,27,42,0.95)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      flexShrink: 0,
    }}>
      <div>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{title}</h1>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
          {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Theme Toggle */}
        <button
          style={{
            width: 36, height: 36, padding: 0, display: "flex", alignItems: "center",
            justifyContent: "center", borderRadius: 8,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.6)", cursor: "pointer",
          }}
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            style={{
              width: 36, height: 36, padding: 0, display: "flex", alignItems: "center",
              justifyContent: "center", borderRadius: 8,
              background: showNotifs ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)", cursor: "pointer",
            }}
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={18} />
          </button>

          {pendingClients.length > 0 && (
            <div style={{
              position: "absolute", top: -4, right: -4,
              width: 18, height: 18,
              background: "#ef4444",
              borderRadius: "50%",
              fontSize: 10, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", pointerEvents: "none",
            }}>{pendingClients.length}</div>
          )}

          {showNotifs && (
            <div style={{
              position: "absolute", top: 46, right: 0, width: 320, zIndex: 100,
              background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.6)", overflow: "hidden",
            }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Notifications</span>
                <span style={{ fontSize: 10, background: "rgba(234,179,8,0.1)", color: "#eab308", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>{pendingClients.length} en attente</span>
              </div>
              <div style={{ maxHeight: 300, overflowY: "auto" }}>
                {pendingClients.length > 0 ? pendingClients.map((c: any) => (
                  <div key={c.id}
                    style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" }}
                    onClick={() => { setShowNotifs(false); router.push("/admin/clients"); }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(234,179,8,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#eab308" }}>
                        <Clock size={14} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>Paiement en attente</p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>M./Mme <strong style={{ color: "rgba(255,255,255,0.7)" }}>{c.nom}</strong> — {c.typeAssuranceLabel}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                    Aucune notification.
                  </div>
                )}
              </div>
              {pendingClients.length > 0 && (
                <div style={{ padding: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", fontSize: 12, color: "#22c55e", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                    onClick={() => { setShowNotifs(false); router.push("/admin/clients"); }}>
                    Consulter les clients <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 12, borderLeft: "1px solid rgba(255,255,255,0.08)", marginLeft: 4 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{userName}</p>
            <p style={{ fontSize: 10, color: "#22c55e", fontWeight: 600, textTransform: "capitalize" }}>{role}</p>
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#22c55e",
          }}>{userName[0]}</div>
        </div>
      </div>
    </header>
  );
}

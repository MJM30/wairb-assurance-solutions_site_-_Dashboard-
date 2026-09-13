"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, CheckCircle, BarChart3,
  Handshake, Wallet, Activity, LogOut, UserPlus
} from "lucide-react";

const allNavItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Tableau de bord", exact: true, roles: ["admin", "financier"] },
  { href: "/admin/utilisateurs", icon: UserPlus, label: "Gestion des comptes", roles: ["admin"] },
  { href: "/admin/clients", icon: Users, label: "Tous les clients", roles: ["admin", "percepteur"] },
  { href: "/admin/clients-payes", icon: CheckCircle, label: "Clients payés", roles: ["admin", "financier"] },
  { href: "/admin/assurances", icon: BarChart3, label: "Assurances", roles: ["admin", "financier"] },
  { href: "/admin/partenaires", icon: Handshake, label: "Partenaires", roles: ["admin"] },
  { href: "/admin/budget", icon: Wallet, label: "Revenus", roles: ["admin", "financier"] },
  { href: "/admin/expenses", icon: Activity, label: "Dépenses", roles: ["admin", "financier"] },
  { href: "/admin/visiteurs", icon: Activity, label: "Visiteurs", roles: ["admin"] },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const role = typeof window !== "undefined" ? (localStorage.getItem("wairb_admin_role") || "admin") : "admin";
  const userName = typeof window !== "undefined" ? (localStorage.getItem("wairb_user_name") || "Admin") : "Admin";

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  function handleLogout() {
    localStorage.removeItem("wairb_admin_auth");
    localStorage.removeItem("wairb_admin_role");
    localStorage.removeItem("wairb_user_id");
    router.push("/admin/login");
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside style={{
      width: 220,
      background: "var(--bg-card, #0d1b2a)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      height: "100vh",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
          <div style={{ width: "100%", height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/images/Logo_WAIRB_Def.png" alt="WAIRB Logo" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "60px" }} />
          </div>
          <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Administration
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 8px 4px" }}>
          Navigation
        </div>
        {navItems.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: 8,
                fontSize: 13, fontWeight: active ? 700 : 500,
                color: active ? "#22c55e" : "rgba(255,255,255,0.55)",
                background: active ? "rgba(34,197,94,0.1)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{
          padding: "10px 12px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.06)",
          marginBottom: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32,
              background: "#16a34a",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff",
            }}>{userName[0]}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{userName}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{role}</div>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "8px 10px", borderRadius: 8, fontSize: 13,
            color: "rgba(239,68,68,0.8)", background: "transparent",
            border: "none", cursor: "pointer", fontWeight: 600,
          }}
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}

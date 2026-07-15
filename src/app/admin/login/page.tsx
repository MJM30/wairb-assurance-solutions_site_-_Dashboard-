"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        localStorage.setItem("wairb_admin_auth", "true");
        localStorage.setItem("wairb_admin_role", data.user.role);
        localStorage.setItem("wairb_user_id", data.user.id);
        router.push("/admin");
      } else {
        setError(data.error || "Email ou mot de passe incorrect.");
      }
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #051a10 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background blobs */}
      <div style={{
        position: "absolute", top: "-10%", right: "-5%",
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", left: "-5%",
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%", maxWidth: 420,
        padding: 32,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.5)",
        position: "relative",
        backdropFilter: "blur(12px)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: "100%", height: 100,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <img src="/images/Logo_WAIRB_Def.png" alt="WAIRB Logo" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "60px" }} />
          </div>
          <h1 style={{
            fontSize: 22, fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}>WAIRB Admin</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
            Tableau de bord — Accès réservé
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>
              Adresse email
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@wairbdrc.com"
                required
                style={{
                  width: "100%", paddingLeft: 36, paddingRight: 12, height: 42,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, color: "#fff", fontSize: 14, outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>
              Mot de passe
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%", paddingLeft: 36, paddingRight: 40, height: 42,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, color: "#fff", fontSize: 14, outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)",
                }}
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 12px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 8,
              fontSize: 12, color: "#f87171",
            }}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", height: 44,
              background: loading ? "#15803d" : "linear-gradient(135deg, #16a34a, #15803d)",
              border: "none", borderRadius: 10, color: "#fff",
              fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer",
              marginTop: 4, transition: "all 0.2s",
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Credentials Hint */}
        <div style={{
          marginTop: 20, padding: "10px 14px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 8, fontSize: 11, color: "rgba(255,255,255,0.35)",
          display: "flex", flexDirection: "column", gap: 6
        }}>
          <div><strong style={{ color: "rgba(255,255,255,0.55)" }}>Admin :</strong> admin@wairbdrc.com / Wairb@2024</div>
          <div><strong style={{ color: "rgba(255,255,255,0.55)" }}>Percepteur :</strong> percepteur@wairbdrc.com / Wairb@2024</div>
          <div><strong style={{ color: "rgba(255,255,255,0.55)" }}>Financier :</strong> financier@wairbdrc.com / Wairb@2024</div>
        </div>
      </div>
    </div>
  );
}

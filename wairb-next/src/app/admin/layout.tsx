"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminTopBar from "@/components/admin/TopBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("wairb_admin_auth");
    if (auth !== "true") {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#060f18" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AdminTopBar />
        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          background: "#0a1628",
          color: "#fff",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

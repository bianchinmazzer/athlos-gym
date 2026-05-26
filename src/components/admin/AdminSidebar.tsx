"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Users, Dumbbell, ClipboardList, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/exercises", label: "Ejercicios", icon: Dumbbell },
  { href: "/admin/routines", label: "Rutinas", icon: ClipboardList },
];

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <Image
            src="/images/athlos-logo.png"
            alt="Athlos Gym"
            width={200}
            height={200}
            style={{ height: "65px", width: "auto", objectFit: "contain" }}
          />
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", letterSpacing: "0.08em" }} className="gradient-text">
            ATHLOS GYM
          </p>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--athlos-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "4px" }}>
          Panel Admin
        </p>
      </div>

      {/* Admin name */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, var(--athlos-coral), var(--athlos-orange))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontSize: "1rem", color: "white",
          }}>
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600, color: "var(--athlos-white)" }}>
              {adminName}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--athlos-teal)" }}>
              Administrador
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 14px", borderRadius: "8px",
                fontFamily: "var(--font-body)", fontSize: "0.9rem",
                color: active ? "var(--athlos-white)" : "var(--athlos-muted)",
                background: active ? "rgba(232,83,58,0.12)" : "transparent",
                borderLeft: active ? "2px solid var(--athlos-coral)" : "2px solid transparent",
                transition: "all 0.15s",
                textDecoration: "none",
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "10px", width: "100%",
            padding: "10px 14px", borderRadius: "8px",
            fontFamily: "var(--font-body)", fontSize: "0.9rem",
            color: "var(--athlos-muted)", background: "none", border: "none",
            cursor: "pointer", transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-coral)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 flex-shrink-0"
        style={{ background: "var(--athlos-navy)", borderRight: "1px solid rgba(255,255,255,0.06)", minHeight: "100vh" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14"
        style={{ background: "var(--athlos-navy)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", letterSpacing: "0.08em" }} className="gradient-text">
          ATHLOS ADMIN
        </p>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: "var(--athlos-white)" }}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 flex"
          style={{ paddingTop: "56px" }}
        >
          <div
            className="w-64 flex flex-col"
            style={{ background: "var(--athlos-navy)" }}
          >
            <SidebarContent />
          </div>
          <div
            className="flex-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Mobile spacer */}
      <div className="md:hidden" style={{ height: "56px" }} />
    </>
  );
}

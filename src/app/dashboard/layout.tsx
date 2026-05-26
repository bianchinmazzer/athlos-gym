import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/dashboard/LogoutButton";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") redirect("/admin/users");

  return (
    <div className="min-h-screen" style={{ background: "var(--athlos-dark)" }}>
      {/* Top bar */}
      <header style={{ background: "var(--athlos-navy)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 16px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", letterSpacing: "0.08em" }} className="gradient-text">ATHLOS</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--athlos-teal)", textTransform: "uppercase" }}>GYM</span>
        </div>
        <div className="flex items-center gap-4">
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--athlos-muted)" }}>
            Hola, <span style={{ color: "var(--athlos-white)" }}>{profile?.name}</span>
          </p>
          <LogoutButton />
        </div>
      </header>
      <DashboardNav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}

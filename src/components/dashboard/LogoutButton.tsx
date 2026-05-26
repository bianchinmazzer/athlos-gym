"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        display: "flex", alignItems: "center", gap: "6px",
        color: "var(--athlos-muted)", background: "none", border: "none",
        cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.85rem",
        transition: "color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--athlos-coral)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--athlos-muted)")}
    >
      <LogOut size={16} />
      Salir
    </button>
  );
}

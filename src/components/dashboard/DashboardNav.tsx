"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, User } from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Rutinas generales", icon: Dumbbell },
  { href: "/dashboard/mis-rutinas", label: "Mis rutinas", icon: User },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      background: "var(--athlos-navy)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      justifyContent: "center",
      gap: "0",
    }}>
      {tabs.map((tab) => {
        const isActive = tab.href === "/dashboard"
          ? pathname === "/dashboard"
          : pathname.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "14px 24px",
              fontFamily: "var(--font-body)", fontSize: "0.85rem",
              color: isActive ? "var(--athlos-white)" : "var(--athlos-muted)",
              textDecoration: "none",
              borderBottom: isActive ? "2px solid var(--athlos-teal)" : "2px solid transparent",
              transition: "color 0.15s, border-color 0.15s",
            }}
          >
            <Icon size={16} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

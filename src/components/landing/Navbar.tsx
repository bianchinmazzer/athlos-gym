"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, Loader2 } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Nosotros", href: "#nosotros" },
    { label: "Servicios", href: "#servicios" },
    { label: "Galería", href: "#galeria" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(15,15,26,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/athlos-logo.png"
            alt="Athlos Gym"
            width={200}
            height={200}
            style={{
              height: "clamp(60px, 12vw, 90px)",
              width: "auto",
              objectFit: "contain",
            }}
            priority
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.06em",
                  color: "var(--athlos-muted)",
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                }}
                className="hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Login button */}
        <div className="hidden md:block">
          <button
            disabled={navigating}
            onClick={() => {
              setNavigating(true);
              router.push("/login");
            }}
            style={{
              background: "transparent",
              border: "1px solid var(--athlos-coral)",
              color: "var(--athlos-coral)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.08em",
              padding: "8px 22px",
              borderRadius: "6px",
              cursor: navigating ? "wait" : "pointer",
              fontSize: "0.95rem",
              transition: "background 0.2s, color 0.2s",
              opacity: navigating ? 0.7 : 1,
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              if (!navigating) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--athlos-coral)";
                (e.currentTarget as HTMLButtonElement).style.color = "white";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--athlos-coral)";
            }}
          >
            <span style={{ visibility: navigating ? "hidden" : "visible" }}>INGRESAR</span>
            {navigating && <Loader2 size={16} className="animate-spin" style={{ position: "absolute" }} />}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ color: "var(--athlos-white)" }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          style={{ background: "rgba(15,15,26,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
          className="md:hidden px-6 pb-6 pt-4 flex flex-col gap-4"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                letterSpacing: "0.06em",
                color: "var(--athlos-muted)",
                textTransform: "uppercase",
              }}
            >
              {l.label}
            </a>
          ))}
          <button
            disabled={navigating}
            className="btn-primary w-full mt-2 flex items-center justify-center"
            onClick={() => {
              setOpen(false);
              setNavigating(true);
              router.push("/login");
            }}
            style={{ opacity: navigating ? 0.7 : 1, cursor: navigating ? "wait" : "pointer", position: "relative" }}
          >
            <span style={{ visibility: navigating ? "hidden" : "visible" }}>INGRESAR</span>
            {navigating && <Loader2 size={16} className="animate-spin" style={{ position: "absolute" }} />}
          </button>
        </div>
      )}
    </header>
  );
}

"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--athlos-dark)" }}
    >
      {/* Background photo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/assets/hero.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Dark overlay on top of image */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(15,15,26,0.7) 0%, rgba(15,15,26,0.55) 40%, rgba(15,15,26,0.75) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(78,205,196,0.1)",
            border: "1px solid rgba(78,205,196,0.25)",
            borderRadius: "100px",
            padding: "6px 16px",
            marginBottom: "clamp(24px, 4vw, 40px)",
            animation: "fadeInDown 0.8s ease both",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--athlos-teal)",
              animation: "blink 2s ease infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--athlos-teal)",
            }}
          >
            Monte Hermoso · Buenos Aires
          </span>
        </div>

        {/* Main headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem, 14vw, 10rem)",
            lineHeight: "0.9",
            letterSpacing: "0.02em",
            marginBottom: "clamp(16px, 3vw, 28px)",
            animation: "fadeInUp 0.8s ease 0.1s both",
          }}
        >
          <span className="gradient-text">ATHLOS</span>
          <br />
          <span style={{ color: "rgba(240,240,240,0.15)", WebkitTextStroke: "1px rgba(240,240,240,0.3)" }}>
            GYM
          </span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "var(--athlos-muted)",
            maxWidth: "540px",
            lineHeight: "1.7",
            marginBottom: "clamp(32px, 5vw, 48px)",
            animation: "fadeInUp 0.8s ease 0.2s both",
          }}
        >
          Entrenamiento personalizado a metros del mar.
          Clases presenciales y rutinas online para que alcances tus metas
          donde estés.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center gap-4"
          style={{ animation: "fadeInUp 0.8s ease 0.3s both" }}
        >
          <a href="#contacto">
            <button className="btn-primary text-lg px-8 py-4">
              EMPEZÁ HOY
            </button>
          </a>
          <a href="#servicios">
            <button className="btn-secondary text-base px-8 py-4">
              Ver servicios
            </button>
          </a>
        </div>
      </div>

      {/* Wave bottom divider */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ lineHeight: 0 }}
      >
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%" }}
        >
          <path
            d="M0 40 C360 80 1080 0 1440 40 L1440 80 L0 80 Z"
            fill="rgba(22,33,62,0.5)"
          />
        </svg>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.18; }
          50% { transform: translateX(-50%) scale(1.08); opacity: 0.25; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}

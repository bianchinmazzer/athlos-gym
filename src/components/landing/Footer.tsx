import Image from "next/image";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--athlos-navy)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "40px 0 32px",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/athlos-logo.png"
              alt="Athlos Gym"
              width={120}
              height={120}
              style={{ height: "56px", width: "auto", objectFit: "contain" }}
            />
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  letterSpacing: "0.08em",
                }}
                className="gradient-text"
              >
                ATHLOS
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: "var(--athlos-teal)",
                  textTransform: "uppercase",
                }}
              >
                GYM
              </span>
            </div>
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--athlos-muted)",
              textAlign: "center",
            }}
          >
            Monte Hermoso, Buenos Aires · Entrená con propósito
          </p>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "rgba(138,138,154,0.5)",
            }}
          >
            © {new Date().getFullYear()} Athlos Gym
          </p>
        </div>
      </div>
    </footer>
  );
}

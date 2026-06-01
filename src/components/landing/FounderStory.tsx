import Image from "next/image";

export default function FounderStory() {
  return (
    <section
      id="nosotros"
      style={{ background: "var(--athlos-navy)", padding: "clamp(64px, 10vw, 120px) 0" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left: decorative quote block */}
          <div className="relative">
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "-20px",
                fontFamily: "var(--font-display)",
                fontSize: "14rem",
                lineHeight: 1,
                color: "rgba(232,83,58,0.06)",
                userSelect: "none",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            >
              "
            </div>
            <div
              className="glass-card rounded-2xl p-8 sm:p-10 relative"
              style={{ borderLeft: "3px solid var(--athlos-coral)" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                  lineHeight: "1.3",
                  letterSpacing: "0.02em",
                  color: "var(--athlos-white)",
                  marginBottom: "24px",
                }}
              >
                Empecé en un living.
                <br />
                Hoy tenemos{" "}
                <span className="gradient-text">un lugar propio.</span>
              </p>
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: "2px solid var(--athlos-orange)",
                    position: "relative",
                  }}
                >
                  <Image
                    src="/images/founder.jpeg"
                    alt="Fundador de Athlos Gym"
                    fill
                    sizes="72px"
                    style={{ objectFit: "cover", objectPosition: "center 25%" }}
                  />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: "var(--athlos-white)" }}>
                    Fundador · Athlos Gym
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--athlos-muted)" }}>
                    Monte Hermoso, Buenos Aires
                  </p>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { value: "5+", label: "Años de experiencia" },
                { value: "100%", label: "Entrenamientos grupales y rutinas personalizadas" },
                { value: "💪", label: "Ganas de crecer", isEmoji: true },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card rounded-xl p-4 text-center"
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.8rem",
                      color: "var(--athlos-orange)",
                      lineHeight: 1,
                      ...(stat.isEmoji
                        ? {
                            fontSize: "1.3rem",
                            background: "var(--athlos-orange)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }
                        : {}),
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.65rem",
                      color: "var(--athlos-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginTop: "4px",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: story text */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--athlos-teal)",
                marginBottom: "12px",
              }}
            >
              Nuestra historia
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                lineHeight: "1.1",
                marginBottom: "24px",
                color: "var(--athlos-white)",
              }}
            >
              DE LA PAMPA
              <br />
              <span className="gradient-text">AL MAR</span>
            </h2>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                lineHeight: "1.8",
                color: "var(--athlos-muted)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <p>
                A los 15 años empecé el gym y desde ese entonces el
                entrenamiento y el deporte se volvieron un estilo de vida.
              </p>
              <p>
                Decidí que esta pasión también sería mi profesión y me mudé a
                Bahía Blanca donde me formé como profesor y entrenador, me
                capacité y trabajé en diferentes gimnasios.
              </p>
              <p>
                Años más tarde la vida me llevó a Monte Hermoso y el living de
                mi casa se convirtió en el primer{" "}
                <span style={{ color: "var(--athlos-white)" }}>Athlos Gym</span>.
              </p>
              <p>
                Hoy tenemos un espacio propio completamente equipado junto al
                mar. Y seguimos creciendo, ahora también con{" "}
                <span style={{ color: "var(--athlos-white)" }}>rutinas online</span> para
                que puedas entrenar desde donde estés, con la misma calidad y
                energía de siempre.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Dumbbell, Monitor, Users, MapPin } from "lucide-react";

const services = [
  {
    icon: Dumbbell,
    title: "Gimnasio Libre Guiado",
    color: "var(--athlos-coral)",
    gradient: "linear-gradient(135deg, rgba(232,83,58,0.15), rgba(244,163,64,0.08))",
    border: "rgba(232,83,58,0.25)",
    description:
      "Entrená en nuestro gym completamente equipado con la supervisión directa del profesor. Pesas, máquinas, cardio — todo lo que necesitás para avanzar.",
    bullets: [
      "Equipamiento completo de musculación",
      "Supervisión y corrección técnica",
      "Adaptación del plan a tu nivel",
      "Horarios flexibles",
    ],
    tag: "PRESENCIAL",
  },
  {
    icon: Users,
    title: "Clases Grupales",
    color: "var(--athlos-orange)",
    gradient: "linear-gradient(135deg, rgba(244,163,64,0.15), rgba(244,200,66,0.08))",
    border: "rgba(244,163,64,0.25)",
    description:
      "Sesiones grupales con dinámica motivadora. El esfuerzo compartido potencia los resultados. Ideal para quienes buscan energía de equipo.",
    bullets: [
      "Grupos reducidos de hasta 8 personas",
      "Variedad de modalidades",
      "Dinámica motivacional",
      "Progresión estructurada",
    ],
    tag: "PRESENCIAL",
  },
  {
    icon: Monitor,
    title: "Rutinas Online",
    color: "var(--athlos-teal)",
    gradient: "linear-gradient(135deg, rgba(78,205,196,0.15), rgba(69,183,209,0.08))",
    border: "rgba(78,205,196,0.25)",
    description:
      "Rutinas diseñadas a medida, accesibles desde cualquier dispositivo. Videos explicativos por ejercicio para que nunca tengas dudas sobre la ejecución.",
    bullets: [
      "Rutinas personalizadas por el profe",
      "Videos de cada ejercicio",
      "Descarga en PDF para llevar al gym",
      "Seguimiento desde la app",
    ],
    tag: "ONLINE",
    highlight: true,
  },
];

export default function Services() {
  return (
    <section
      id="servicios"
      style={{
        background: "var(--athlos-dark)",
        padding: "clamp(64px, 10vw, 120px) 0",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
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
            Lo que ofrecemos
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              lineHeight: "1",
              color: "var(--athlos-white)",
            }}
          >
            DOS FORMAS DE{" "}
            <span className="gradient-text">ENTRENAR</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="rounded-2xl p-6 sm:p-8 flex flex-col gap-5 relative overflow-hidden"
                style={{
                  background: svc.gradient,
                  border: `1px solid ${svc.border}`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "none";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {/* Tag */}
                <div className="flex items-center justify-between">
                  <div
                    style={{
                      background: svc.border,
                      borderRadius: "100px",
                      padding: "3px 10px",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: svc.color,
                    }}
                  >
                    {svc.tag}
                  </div>
                  {svc.highlight && (
                    <div
                      style={{
                        background: "var(--athlos-teal)",
                        borderRadius: "100px",
                        padding: "3px 10px",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--athlos-dark)",
                        fontWeight: 700,
                      }}
                    >
                      ★ NUEVO
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: svc.border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: svc.color,
                  }}
                >
                  <Icon size={24} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                    letterSpacing: "0.03em",
                    color: "var(--athlos-white)",
                    lineHeight: "1.1",
                  }}
                >
                  {svc.title.toUpperCase()}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    lineHeight: "1.7",
                    color: "var(--athlos-muted)",
                    flexGrow: 1,
                  }}
                >
                  {svc.description}
                </p>

                {/* Bullets */}
                <ul className="flex flex-col gap-2">
                  {svc.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-2"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.82rem",
                        color: "rgba(240,240,240,0.75)",
                      }}
                    >
                      <span style={{ color: svc.color, flexShrink: 0 }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Location badge */}
        <div className="flex justify-center mt-12">
          <div
            className="glass-card rounded-full flex items-center gap-3 px-6 py-3"
          >
            <MapPin size={16} style={{ color: "var(--athlos-coral)" }} />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                color: "var(--athlos-muted)",
              }}
            >
              Monte Hermoso, Buenos Aires · A metros del mar
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

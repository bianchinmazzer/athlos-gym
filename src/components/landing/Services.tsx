import { Users, Monitor, MapPin } from "lucide-react";

type Section = { heading: string; text: string };

type Service = {
  icon: typeof Users;
  title: string;
  color: string;
  gradient: string;
  border: string;
  tag: string;
  highlight?: boolean;
  description?: string;
  sections?: Section[];
};

const services: Service[] = [
  {
    icon: Users,
    title: "Presencial",
    color: "var(--athlos-orange)",
    gradient: "linear-gradient(135deg, rgba(244,163,64,0.15), rgba(244,200,66,0.08))",
    border: "rgba(244,163,64,0.25)",
    tag: "PRESENCIAL",
    sections: [
      {
        heading: "Clases grupales",
        text: "Sesiones grupales con dinámica motivadora, el esfuerzo compartido potencia los resultados. Ideal para quienes buscan energía de equipo.",
      },
      {
        heading: "Open box",
        text: "Pensado para que entrenes tu rutina de manera individual con supervisión del profesor.",
      },
    ],
  },
  {
    icon: Monitor,
    title: "Rutinas Online",
    color: "var(--athlos-teal)",
    gradient: "linear-gradient(135deg, rgba(78,205,196,0.15), rgba(69,183,209,0.08))",
    border: "rgba(78,205,196,0.25)",
    tag: "ONLINE",
    highlight: true,
    description:
      "Entrenamientos personalizados orientados a tus objetivos, con videos explicativos de cada ejercicio para que puedas realizarlo desde cualquier lugar.",
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
        <div className="grid sm:grid-cols-2 gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="service-card rounded-2xl p-6 sm:p-8 flex flex-col gap-5 relative overflow-hidden"
                style={{
                  background: svc.gradient,
                  border: `1px solid ${svc.border}`,
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

                {/* Sections (presencial) */}
                {svc.sections && (
                  <div className="flex flex-col gap-5">
                    {svc.sections.map((sec) => (
                      <div key={sec.heading}>
                        <h4
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.1rem",
                            letterSpacing: "0.03em",
                            color: svc.color,
                            marginBottom: "6px",
                          }}
                        >
                          {sec.heading}
                        </h4>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.9rem",
                            lineHeight: "1.7",
                            color: "var(--athlos-muted)",
                          }}
                        >
                          {sec.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Description (online) */}
                {svc.description && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      lineHeight: "1.7",
                      color: "var(--athlos-muted)",
                    }}
                  >
                    {svc.description}
                  </p>
                )}
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

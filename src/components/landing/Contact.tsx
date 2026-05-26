"use client";
import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contacto"
      style={{
        background: "var(--athlos-dark)",
        padding: "clamp(64px, 10vw, 120px) 0",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left */}
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
              Contacto
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                lineHeight: "1",
                marginBottom: "24px",
                color: "var(--athlos-white)",
              }}
            >
              HABLEMOS <span className="gradient-text">HOY</span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                lineHeight: "1.75",
                color: "var(--athlos-muted)",
                maxWidth: "420px",
                marginBottom: "40px",
              }}
            >
              ¿Querés empezar a entrenar o tenés dudas sobre las rutinas online?
              Mandanos un mensaje y te respondemos a la brevedad.
            </p>

            {/* Info blocks */}
            <div className="flex flex-col gap-4">
              {[
                {
                  label: "Ubicación",
                  value: "Monte Hermoso, Buenos Aires",
                  color: "var(--athlos-coral)",
                },
                {
                  label: "Instagram",
                  value: "@athlosgym",
                  color: "var(--athlos-orange)",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div
                    style={{
                      width: "4px",
                      height: "40px",
                      borderRadius: "2px",
                      background: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--athlos-muted)",
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        color: "var(--athlos-white)",
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            {status === "ok" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <CheckCircle size={48} style={{ color: "var(--athlos-teal)" }} />
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.8rem",
                    color: "var(--athlos-white)",
                  }}
                >
                  MENSAJE ENVIADO
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--athlos-muted)",
                    textAlign: "center",
                  }}
                >
                  Te respondemos a la brevedad. ¡Gracias por escribirnos!
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn-secondary mt-2"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.6rem",
                    color: "var(--athlos-white)",
                    marginBottom: "4px",
                  }}
                >
                  ENVIANOS UN MENSAJE
                </h3>

                <div className="flex flex-col gap-2">
                  <label
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--athlos-muted)",
                    }}
                  >
                    Nombre
                  </label>
                  <input
                    className="athlos-input"
                    type="text"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--athlos-muted)",
                    }}
                  >
                    Email
                  </label>
                  <input
                    className="athlos-input"
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--athlos-muted)",
                    }}
                  >
                    Mensaje
                  </label>
                  <textarea
                    className="athlos-input"
                    rows={4}
                    placeholder="¿En qué te podemos ayudar?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    style={{ resize: "none" }}
                  />
                </div>

                {status === "error" && (
                  <div
                    className="flex items-center gap-2 rounded-lg px-4 py-3"
                    style={{ background: "rgba(232,83,58,0.1)", border: "1px solid rgba(232,83,58,0.2)" }}
                  >
                    <AlertCircle size={16} style={{ color: "var(--athlos-coral)" }} />
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.85rem",
                        color: "var(--athlos-coral)",
                      }}
                    >
                      Error al enviar. Intentá de nuevo.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center gap-2"
                  disabled={status === "loading"}
                  style={{ opacity: status === "loading" ? 0.7 : 1 }}
                >
                  <Send size={16} />
                  {status === "loading" ? "ENVIANDO..." : "ENVIAR MENSAJE"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

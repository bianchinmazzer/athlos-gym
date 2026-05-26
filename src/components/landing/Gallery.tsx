"use client";
import { useState } from "react";
import { X, Play } from "lucide-react";

type GalleryItem = {
  id: number;
  src: string;
  alt: string;
  aspect: "tall" | "wide" | "square";
  type?: "video";
};

const items: GalleryItem[] = [
  { id: 1, src: "/assets/gym-afuera.jpeg", alt: "Vista exterior", aspect: "tall" },
  { id: 2, src: "/assets/gym-1.jpeg", alt: "El gym", aspect: "wide" },
  { id: 3, src: "/assets/gym-2.jpeg", alt: "Equipamiento", aspect: "square" },
  { id: 4, src: "/assets/gym-3.jpeg", alt: "Zona de trabajo", aspect: "square" },
  { id: 5, src: "/assets/compe-1.jpeg", alt: "Competencia", aspect: "tall" },
  { id: 6, src: "/assets/competencia.mp4", alt: "Competencia", aspect: "tall", type: "video" },
  { id: 7, src: "/assets/kai.jpeg", alt: "Kai", aspect: "tall" },
  { id: 8, src: "/assets/gym-4.jpeg", alt: "Área de pesas", aspect: "square" },
  { id: 9, src: "/assets/gym-5.jpeg", alt: "Entrenamiento", aspect: "wide" },
  { id: 10, src: "/assets/mar.jpeg", alt: "Monte Hermoso", aspect: "tall" },
  { id: 11, src: "/assets/atardecer.jpeg", alt: "Atardecer", aspect: "tall" },
  { id: 12, src: "/assets/hero.jpeg", alt: "Athlos Gym", aspect: "square" },
  { id: 13, src: "/assets/compe-2.jpeg", alt: "Competencia", aspect: "square" },
];

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section
      id="galeria"
      style={{
        background: "var(--athlos-navy)",
        padding: "clamp(64px, 10vw, 120px) 0",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--athlos-teal)",
              marginBottom: "10px",
            }}
          >
            El espacio
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              lineHeight: "1",
              color: "var(--athlos-white)",
            }}
          >
            NUESTRO <span className="gradient-text">GYM</span>
          </h2>
        </div>

        {/* Masonry grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
          style={{ gridAutoRows: "180px", gridAutoFlow: "dense" }}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              onClick={() => setSelected(i)}
              className="rounded-xl overflow-hidden cursor-pointer relative group"
              style={{
                gridRow: item.aspect === "tall" ? "span 2" : "span 1",
                gridColumn: item.aspect === "wide" ? "span 2" : "span 1",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {item.type === "video" ? (
                <>
                  <video
                    src={item.src}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="none"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ background: "rgba(0,0,0,0.15)" }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "rgba(232,83,58,0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Play size={20} fill="white" color="white" />
                    </div>
                  </div>
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                style={{
                  background: "linear-gradient(to top, rgba(15,15,26,0.8), transparent)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    color: "var(--athlos-white)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.alt}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selected !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.9)" }}
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4"
              style={{ color: "white", background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={28} />
            </button>
            <div
              className="max-w-3xl w-full rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {items[selected].type === "video" ? (
                <video
                  src={items[selected].src}
                  controls
                  autoPlay
                  className="w-full h-auto rounded-2xl"
                  style={{ maxHeight: "80vh" }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={items[selected].src}
                  alt={items[selected].alt}
                  className="w-full h-auto"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

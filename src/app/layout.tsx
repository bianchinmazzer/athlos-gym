import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Athlos Gym | Monte Hermoso",
  description:
    "Gimnasio equipado en Monte Hermoso. Clases personalizadas y rutinas online con seguimiento profesional.",
  openGraph: {
    title: "Athlos Gym | Monte Hermoso",
    description: "Tu gym en la playa. Entrená con propósito.",
    siteName: "Athlos Gym",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

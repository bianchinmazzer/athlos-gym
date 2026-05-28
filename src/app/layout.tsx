import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
  variable: "--font-dm-sans",
});

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
    <html lang="es" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <head>
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
      </head>
      <body>{children}</body>
    </html>
  );
}

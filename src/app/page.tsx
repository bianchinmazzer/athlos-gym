import nextDynamic from "next/dynamic";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FounderStory from "@/components/landing/FounderStory";
import Services from "@/components/landing/Services";
import Footer from "@/components/landing/Footer";
import WhatsAppFloat from "@/components/landing/WhatsAppFloat";

const Gallery = nextDynamic(() => import("@/components/landing/Gallery"));
const Contact = nextDynamic(() => import("@/components/landing/Contact"));

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FounderStory />
        <Services />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

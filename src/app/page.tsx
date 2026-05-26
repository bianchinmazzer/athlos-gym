import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FounderStory from "@/components/landing/FounderStory";
import Services from "@/components/landing/Services";
import Gallery from "@/components/landing/Gallery";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";
import WhatsAppFloat from "@/components/landing/WhatsAppFloat";

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

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Hero,
  Services,
  HowWeWork,
  WhyUs,
  Work,
  Contact,
} from "@/sections";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <HowWeWork />
        <WhyUs />
        <Work />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

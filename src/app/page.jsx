"use client";

import Hero from "../components/Hero";
import TrackSection from "../components/TrackSection";
import AutomationSection from "../components/AutomationSection";
import AISearchSection from "../components/AISearchSection";
import ForecastSection from "../components/ForecastSection";
import FamiliesSection from "../components/FamiliesSection";
import DownloadSection from "../components/DownloadSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="relative w-full overflow-hidden bg-black text-white">

      <Hero />
      <TrackSection />
      <AutomationSection />
      <AISearchSection />
      <ForecastSection />
      <FamiliesSection />
      <Testimonials />
      <DownloadSection />

      <Footer />
    </main>
  );
}

"use client";
// src/app/page.tsx
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/ui/LoadingScreen";
import SpiceParticles from "@/components/ui/SpiceParticles";
import Navbar from "@/components/customer/Navbar";
import HeroSection from "@/components/customer/HeroSection";
import BestsellerSection from "@/components/customer/BestsellerSection";
import MenuSection from "@/components/customer/MenuSection";
import TestimonialsSection from "@/components/customer/TestimonialsSection";
import Footer from "@/components/customer/Footer";
import CartDrawer from "@/components/customer/CartDrawer";
import FloatingButtons from "@/components/customer/FloatingButtons";
import { getMenuItems, getSettings, getTestimonials } from "@/lib/supabase/db";
import { MenuItem, SiteSettings, Testimonial } from "@/types";
import { seedMenuItems, seedSettings } from "@/lib/seedData";
import { seedTestimonials } from "@/lib/seedData";

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    seedMenuItems.map((item, i) => ({ ...item, id: `seed-${i}` }))
  );
  const [settings, setSettings] = useState<SiteSettings>(seedSettings);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    seedTestimonials.map((t, i) => ({ ...t, id: `t-${i}` }))
  );

  useEffect(() => {
    getMenuItems().then(setMenuItems).catch(() => {});
    getSettings().then(setSettings).catch(() => {});
    getTestimonials().then(setTestimonials).catch(() => {});
  }, []);

  return (
    <>
      <LoadingScreen />
      <SpiceParticles />
      <div className="relative min-h-screen">
        <Navbar />
        <main>
          <HeroSection />
          <BestsellerSection items={menuItems} />
          <MenuSection items={menuItems} />
          <TestimonialsSection testimonials={testimonials} />
        </main>
        <Footer settings={settings} />
        <CartDrawer />
        <FloatingButtons />
      </div>
    </>
  );
}

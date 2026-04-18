"use client";
// src/components/customer/HeroSection.tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useCart } from "@/lib/cartContext";
import { seedSettings } from "@/lib/seedData";
import Image from "next/image";
import OfferTicker from "@/components/customer/OfferTicker";

const heroImages = [
  "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=80",
  "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80",
  "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80",
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { openCart } = useCart();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleWhatsApp = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
    window.open(`https://wa.me/${whatsappNumber}?text=Hello+Desi+Kitchen!+I'd+like+to+place+an+order+🙏`, "_blank");
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-charcoal">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-saffron-900/20 via-charcoal to-charcoal" />

      {/* Parallax content */}
      <motion.div style={{ y, opacity }} className="relative z-10 w-full">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-24">

          {/* Left: Text */}
          <div className="text-left order-2 lg:order-1">
            <div className="mb-6">
              <OfferTicker />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2, duration: 0.8 }}
              className="inline-flex items-center gap-2 bg-saffron-500/10 border border-saffron-500/30 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-saffron-500 animate-pulse" />
              <span className="text-saffron-400 text-xs tracking-widest uppercase font-medium">Open Now · Fast Delivery</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.4, duration: 1 }}
            >
              Fresh{" "}
              <span className="gradient-text italic">Desi</span>
              <br />
              Flavours
              <br />
              <span className="text-white/60 text-4xl md:text-5xl">Delivered To</span>
              <br />
              <span className="gradient-text">Your Door</span>
            </motion.h1>

            <motion.p
              className="text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.8, duration: 0.8 }}
            >
              Authentic homemade meals, rich curries, fresh breads, aromatic rice and chilled drinks — cooked with love in our cloud kitchen.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.1, duration: 0.8 }}
            >
              <a
                href="#menu"
                className="btn-saffron text-white font-semibold px-8 py-4 rounded-2xl text-center text-sm tracking-wide uppercase transition-all"
              >
                🍽️ View Menu
              </a>
              <button
                onClick={handleWhatsApp}
                className="glass border border-white/10 text-white font-semibold px-8 py-4 rounded-2xl text-sm tracking-wide uppercase hover:border-green-500/50 hover:bg-green-500/10 transition-all"
              >
                💬 Order on WhatsApp
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.5, duration: 0.8 }}
            >
              {[
                { val: "500+", label: "Happy Customers" },
                { val: "20+", label: "Menu Items" },
                { val: "30min", label: "Avg Delivery" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="gradient-text text-2xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif" }}>{s.val}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Image collage */}
          <motion.div
            className="relative order-1 lg:order-2 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.5, duration: 1.2 }}
          >
            {/* Smoke effects */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 80 + i * 40,
                  height: 80 + i * 40,
                  background: "radial-gradient(ellipse, rgba(255,114,16,0.12) 0%, transparent 70%)",
                  bottom: `${10 + i * 5}%`,
                  left: "50%",
                  x: "-50%",
                }}
                animate={{
                  y: [0, -30 - i * 15],
                  opacity: [0, 0.6, 0],
                  scale: [0.8, 1.4],
                }}
                transition={{
                  duration: 3 + i,
                  delay: i * 0.7,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            ))}

            {/* Main image */}
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-saffron-500/30 shadow-glow">
              <Image
                src={heroImages[0]}
                alt="Delicious Indian Food"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Floating mini cards */}
            {[
              { img: heroImages[1], pos: "-top-6 -right-4 md:-right-8", delay: 0.2, size: "w-20 h-20 md:w-28 md:h-28" },
              { img: heroImages[2], pos: "bottom-4 -left-4 md:-left-10", delay: 0.5, size: "w-16 h-16 md:w-24 md:h-24" },
              { img: heroImages[3], pos: "top-12 -left-8 md:-left-14", delay: 0.8, size: "w-14 h-14 md:w-20 md:h-20" },
            ].map((card, i) => (
              <motion.div
                key={i}
                className={`absolute ${card.pos} ${card.size} rounded-2xl overflow-hidden border border-saffron-500/30 shadow-glow`}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3 + i, delay: card.delay, repeat: Infinity }}
              >
                <Image src={card.img} alt="Food" fill className="object-cover" />
              </motion.div>
            ))}

            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-2 right-0 md:right-4 glass-saffron rounded-2xl px-4 py-3 text-center"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="text-saffron-400 font-bold text-lg" style={{ fontFamily: "Cormorant Garamond, serif" }}>100% Fresh</div>
              <div className="text-white/50 text-xs">Made Daily</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-charcoal to-transparent" />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-saffron-500/60 to-transparent" />
      </motion.div>
    </section>
  );
}

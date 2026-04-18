"use client";
// src/components/customer/Footer.tsx
import { motion } from "framer-motion";
import { MessageCircle, Instagram, MapPin, Clock, Truck } from "lucide-react";
import { seedSettings } from "@/lib/seedData";
import { SiteSettings } from "@/types";

interface Props { settings?: SiteSettings }

export default function Footer({ settings }: Props) {
  const s = settings || seedSettings;

  return (
    <footer id="footer" className="relative border-t border-white/5 pt-16 pb-8 overflow-hidden">
      {/* BG glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-saffron-950/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-3xl">🍛</span>
              <span className="gradient-text text-2xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Desi Kitchen
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              Authentic homemade desi meals cooked fresh daily and delivered right to your door. Taste the difference of real home cooking.
            </p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600/10 border border-green-500/30 text-green-400 hover:bg-green-600/20 transition-all px-4 py-2 rounded-full text-sm"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <a
                href={s.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-pink-600/10 border border-pink-500/30 text-pink-400 hover:bg-pink-600/20 transition-all px-4 py-2 rounded-full text-sm"
              >
                <Instagram size={15} /> Instagram
              </a>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white/80 font-semibold text-sm mb-5 uppercase tracking-widest">Find Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-saffron-400 mt-0.5 flex-shrink-0" />
                <p className="text-white/40 text-sm leading-relaxed">{s.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-saffron-400 flex-shrink-0" />
                <div>
                  <p className="text-white/40 text-sm">Kitchen: {s.kitchenTiming}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={16} className="text-saffron-400 flex-shrink-0" />
                <p className="text-white/40 text-sm">Delivery: {s.deliveryTiming}</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white/80 font-semibold text-sm mb-5 uppercase tracking-widest">Quick Links</h3>
            <div className="space-y-3">
              {[
                { href: "#", label: "Home" },
                { href: "#bestsellers", label: "Bestsellers" },
                { href: "#menu", label: "Full Menu" },
                { href: "#testimonials", label: "Reviews" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-white/40 hover:text-saffron-400 text-sm transition-colors"
                >
                  → {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} Desi Kitchen. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Made with ❤️ for authentic desi food lovers
          </p>
        </div>
      </div>
    </footer>
  );
}

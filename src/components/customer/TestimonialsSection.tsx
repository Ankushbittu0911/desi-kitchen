"use client";
// src/components/customer/TestimonialsSection.tsx
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Testimonial } from "@/types";
import { seedTestimonials } from "@/lib/seedData";

interface Props { testimonials?: Testimonial[] }

export default function TestimonialsSection({ testimonials }: Props) {
  const items = testimonials && testimonials.length > 0
    ? testimonials
    : seedTestimonials.map((t, i) => ({ ...t, id: `t-${i}` }));

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-saffron-950/5 to-transparent" />
      <div className="absolute right-0 top-0 w-96 h-96 bg-saffron-600/5 rounded-full blur-3xl" />
      <div className="absolute left-0 bottom-0 w-64 h-64 bg-gold-600/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-saffron-500 text-xs tracking-[0.3em] uppercase font-medium mb-3 block">
            💬 Happy Customers
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            What They <span className="gradient-text italic">Say</span>
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Real reviews from real food lovers who order from us every week.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-saffron-500/50" />
            <span className="text-saffron-500">✦</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-saffron-500/50" />
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={t.id}
              className="glass rounded-3xl p-6 border border-white/5 hover:border-saffron-500/20 transition-all group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, si) => (
                  <Star key={si} size={14} className="text-saffron-400 fill-saffron-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/60 text-sm leading-relaxed mb-5 relative">
                <span className="text-saffron-500/40 text-3xl absolute -top-2 -left-1 leading-none">"</span>
                <span className="relative z-10 pl-3">{t.review}</span>
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron-500 to-gold-500 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-white/30 text-xs">Verified Customer</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

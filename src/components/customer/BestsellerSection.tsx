"use client";
// src/components/customer/BestsellerSection.tsx
import { motion } from "framer-motion";
import FoodCard from "./FoodCard";
import { MenuItem } from "@/types";

interface Props {
  items: MenuItem[];
}

export default function BestsellerSection({ items }: Props) {
  const bestsellers = items.filter((i) => i.isBestseller);

  if (bestsellers.length === 0) return null;

  return (
    <section className="py-20 relative" id="bestsellers">
      <div className="container mx-auto px-4 md:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-saffron-500 text-xs tracking-[0.3em] uppercase font-medium mb-3 block">
            🔥 Fan Favourites
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Our{" "}
            <span className="gradient-text italic">Bestsellers</span>
          </h2>
          <p className="text-white/40 max-w-md mx-auto text-sm leading-relaxed">
            The dishes our customers keep coming back for — tried, tested and absolutely loved.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-saffron-500/50" />
            <span className="text-saffron-500">✦</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-saffron-500/50" />
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5">
          {bestsellers.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <FoodCard item={item} featured />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-saffron-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 top-1/4 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}

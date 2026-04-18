"use client";
// src/components/customer/MenuSection.tsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FoodCard from "./FoodCard";
import { MenuItem } from "@/types";
import { CATEGORIES_MAP } from "@/lib/seedData";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface Props { items: MenuItem[] }

const CATEGORY_KEYS = ["all", "main-course", "combos", "rice", "bread", "beverages", "desserts"];
const CATEGORY_ICONS: Record<string, string> = {
  all: "🍽️", "main-course": "🍛", combos: "🥘", rice: "🍚", bread: "🫓", beverages: "🥛", desserts: "🍮",
};

const FILTERS = [
  { key: "veg", label: "Veg", icon: "🟢" },
  { key: "non-veg", label: "Non-Veg", icon: "🔴" },
  { key: "egg", label: "Egg", icon: "🟡" },
  { key: "spicy", label: "Spicy", icon: "🌶️" },
  { key: "bestseller", label: "Bestseller", icon: "⭐" },
  { key: "under100", label: "Under ₹100", icon: "💰" },
];

export default function MenuSection({ items }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const filtered = useMemo(() => {
    let result = items;
    if (activeCategory !== "all") result = result.filter((i) => i.category === activeCategory);
    if (search) result = result.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    if (activeFilters.includes("veg")) result = result.filter((i) => i.type === "veg");
    if (activeFilters.includes("non-veg")) result = result.filter((i) => i.type === "non-veg");
    if (activeFilters.includes("egg")) result = result.filter((i) => i.type === "egg");
    if (activeFilters.includes("spicy")) result = result.filter((i) => i.isSpicy);
    if (activeFilters.includes("bestseller")) result = result.filter((i) => i.isBestseller);
    if (activeFilters.includes("under100")) result = result.filter((i) => i.price < 100);
    return result;
  }, [items, activeCategory, activeFilters, search]);

  return (
    <section id="menu" className="py-20 relative">
      <div className="container mx-auto px-4 md:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-saffron-500 text-xs tracking-[0.3em] uppercase font-medium mb-3 block">🍴 Full Menu</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            What We <span className="gradient-text italic">Cook Today</span>
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">Fresh, made-to-order meals — pick your favourites and we'll deliver them hot.</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-saffron-500/50" />
            <span className="text-saffron-500">✦</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-saffron-500/50" />
          </div>
        </motion.div>

        {/* Search bar */}
        <div className="flex items-center gap-3 mb-6 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-saffron-500/50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all ${showFilters || activeFilters.length > 0 ? "bg-saffron-600 text-white" : "glass border border-white/10 text-white/60 hover:text-white"}`}
          >
            <SlidersHorizontal size={15} />
            {activeFilters.length > 0 ? `Filters (${activeFilters.length})` : "Filter"}
          </button>
        </div>

        {/* Filter chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="flex flex-wrap gap-2 mb-6 justify-center"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => toggleFilter(f.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                    activeFilters.includes(f.key)
                      ? "bg-saffron-600 text-white border-saffron-600"
                      : "glass border-white/10 text-white/50 hover:text-white hover:border-white/20"
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-10 -mx-4 px-4">
          {CATEGORY_KEYS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-saffron-600 text-white shadow-glow"
                  : "glass border border-white/10 text-white/50 hover:text-white"
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              {cat === "all" ? "All Items" : CATEGORIES_MAP[cat] || cat}
            </button>
          ))}
        </div>

        {/* Items grid */}
        {filtered.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
                >
                  <FoodCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-white/50 text-lg mb-2">No items found</h3>
            <p className="text-white/30 text-sm">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(""); setActiveFilters([]); setActiveCategory("all"); }}
              className="mt-4 text-saffron-400 text-sm hover:text-saffron-300 underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Decoration */}
      <div className="absolute left-0 bottom-0 w-80 h-80 bg-saffron-600/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}

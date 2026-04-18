"use client";
// src/components/customer/FoodCard.tsx
import { motion } from "framer-motion";
import Image from "next/image";
import { MenuItem } from "@/types";
import { useCart } from "@/lib/cartContext";
import { ShoppingCart, Minus, Plus, Flame, Star } from "lucide-react";

interface FoodCardProps {
  item: MenuItem;
  featured?: boolean;
}

const TYPE_CONFIG = {
  veg: { color: "text-green-400", bg: "bg-green-500/10 border-green-500/30", dot: "bg-green-400", label: "Veg" },
  "non-veg": { color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", dot: "bg-red-400", label: "Non-Veg" },
  egg: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", dot: "bg-yellow-400", label: "Egg" },
};

export default function FoodCard({ item, featured = false }: FoodCardProps) {
  const { state, addItem, updateQuantity } = useCart();
  const cartItem = state.items.find((ci) => ci.item.id === item.id);
  const typeConfig = TYPE_CONFIG[item.type];

  return (
    <motion.div
      className={`food-card glass rounded-3xl overflow-hidden relative group ${featured ? "border border-saffron-500/20" : "border border-white/5"}`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
    >
      {/* Out of stock overlay */}
      {!item.inStock && (
        <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-3xl">
          <span className="text-white/70 font-semibold tracking-widest uppercase text-sm border border-white/20 rounded-full px-4 py-2">
            Out of Stock
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-44 md:h-52 overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="img-overlay absolute inset-0" />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {item.isBestseller && (
            <span className="flex items-center gap-1 bg-saffron-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
              <Star size={10} fill="white" /> Bestseller
            </span>
          )}
          {item.isSpicy && (
            <span className="flex items-center gap-1 bg-red-600/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
              <Flame size={10} /> Spicy
            </span>
          )}
        </div>

        {/* Veg/NonVeg */}
        <div className={`absolute top-3 right-3 flex items-center gap-1.5 ${typeConfig.bg} border rounded-full px-2 py-1`}>
          <span className={`w-2 h-2 rounded-full ${typeConfig.dot}`} />
          <span className={`${typeConfig.color} text-[10px] font-semibold`}>{typeConfig.label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-base mb-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
          {item.name}
        </h3>
        <p className="text-white/40 text-xs leading-relaxed mb-4 line-clamp-2">{item.description}</p>

        {/* Price + Add */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-saffron-400 font-bold text-xl" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              ₹{item.price}
            </span>
          </div>

          {cartItem ? (
            <div className="flex items-center gap-2 glass-saffron rounded-full px-3 py-1.5">
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                className="text-saffron-400 hover:text-white transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="text-white font-semibold text-sm w-5 text-center">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                className="text-saffron-400 hover:text-white transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <motion.button
              onClick={() => addItem(item)}
              className="btn-saffron text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5"
              whileTap={{ scale: 0.95 }}
              disabled={!item.inStock}
            >
              <ShoppingCart size={13} />
              Add
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

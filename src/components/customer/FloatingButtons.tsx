"use client";
// src/components/customer/FloatingButtons.tsx
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { seedSettings } from "@/lib/seedData";

export default function FloatingButtons() {
  const { itemCount, total, toggleCart } = useCart();

  return (
    <>
      {/* WhatsApp floating button */}
      <motion.a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 md:bottom-8 md:right-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/40 hover:scale-110 transition-all"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle size={24} fill="white" className="text-white" />
        <motion.span
          className="absolute top-0 right-0 w-3 h-3 bg-green-300 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.a>

      {/* Mobile sticky cart bar */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-30 md:hidden px-4 pb-4 pt-2"
            style={{ background: "linear-gradient(to top, rgba(10,10,10,1) 60%, transparent)" }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <button
              onClick={toggleCart}
              className="w-full btn-saffron text-white font-semibold py-4 rounded-2xl flex items-center justify-between px-5"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={17} />
                <span className="text-sm">{itemCount} item{itemCount > 1 ? "s" : ""}</span>
              </div>
              <span className="text-sm font-bold">₹{total} →</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

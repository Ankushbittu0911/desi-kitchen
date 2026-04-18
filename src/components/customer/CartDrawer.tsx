"use client";
// src/components/customer/CartDrawer.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cartContext";
import { X, Minus, Plus, Trash2, ShoppingBag, RotateCcw, MessageCircle } from "lucide-react";
import Image from "next/image";
import { saveOrder } from "@/lib/supabase/db";
import { seedSettings } from "@/lib/seedData";
import toast from "react-hot-toast";

export default function CartDrawer() {
  const { state, removeItem, updateQuantity, clearCart, closeCart, total, itemCount, repeatLastOrder } = useCart();

  const generateWhatsAppMessage = () => {
    if (state.items.length === 0) return;
    const lines = state.items.map((ci) => `${ci.quantity} x ${ci.item.name} — ₹${ci.item.price * ci.quantity}`).join("\n");
    const msg = encodeURIComponent(
      `Hello Desi Kitchen, I want to place an order:\n\n${lines}\n\nTotal: ₹${total}\n\nName: \nAddress: \nPayment Mode: `
    );
    saveOrder({ items: state.items, total, timestamp: new Date().toISOString(), status: "pending" });
    window.open(`https://wa.me/${seedSettings.whatsappNumber}?text=${msg}`, "_blank");
    closeCart();
  };

  const hasLastOrder = typeof window !== "undefined" && !!localStorage.getItem("dk_last_order");

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            className="fixed inset-0 cart-overlay z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col"
            style={{ background: "#111", borderLeft: "1px solid rgba(255,114,16,0.15)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div>
                <h2 className="text-white font-semibold text-lg" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  Your Order
                </h2>
                {itemCount > 0 && (
                  <p className="text-white/40 text-xs mt-0.5">{itemCount} item{itemCount > 1 ? "s" : ""} in cart</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {itemCount > 0 && (
                  <button onClick={clearCart} className="text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="w-8 h-8 glass rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {state.items.length === 0 ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full text-center py-20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <motion.div
                      className="text-7xl mb-5"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      🛒
                    </motion.div>
                    <h3 className="text-white/60 text-base font-medium mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                      Your cart is empty
                    </h3>
                    <p className="text-white/30 text-xs mb-6">Add some delicious items from our menu</p>
                    <button
                      onClick={closeCart}
                      className="btn-saffron text-white text-xs font-semibold px-6 py-2.5 rounded-full"
                    >
                      Browse Menu
                    </button>
                    {hasLastOrder && (
                      <button
                        onClick={repeatLastOrder}
                        className="mt-3 flex items-center gap-2 text-saffron-400 text-xs hover:text-saffron-300 transition-colors"
                      >
                        <RotateCcw size={12} /> Repeat Last Order
                      </button>
                    )}
                  </motion.div>
                ) : (
                  state.items.map((ci) => (
                    <motion.div
                      key={ci.item.id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="glass rounded-2xl p-3 flex items-center gap-3"
                    >
                      {/* Image */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative">
                        <Image src={ci.item.imageUrl} alt={ci.item.name} fill className="object-cover" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{ci.item.name}</p>
                        <p className="text-saffron-400 text-sm font-semibold mt-0.5">
                          ₹{ci.item.price * ci.quantity}
                        </p>
                      </div>
                      {/* Qty + Remove */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeItem(ci.item.id)}
                          className="text-white/20 hover:text-red-400 transition-colors"
                        >
                          <X size={13} />
                        </button>
                        <div className="flex items-center gap-1.5 glass-saffron rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                            className="text-saffron-400 hover:text-white transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-white text-xs font-semibold w-4 text-center">{ci.quantity}</span>
                          <button
                            onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                            className="text-saffron-400 hover:text-white transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="p-4 border-t border-white/5 space-y-3">
                {/* Repeat last order */}
                {hasLastOrder && (
                  <button
                    onClick={repeatLastOrder}
                    className="w-full flex items-center justify-center gap-2 text-saffron-400 text-xs hover:text-saffron-300 transition-colors py-1"
                  >
                    <RotateCcw size={12} /> Repeat Last Order
                  </button>
                )}

                {/* Total */}
                <div className="glass rounded-2xl p-3 flex items-center justify-between">
                  <span className="text-white/60 text-sm">Total Amount</span>
                  <span className="text-saffron-400 font-bold text-xl" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                    ₹{total}
                  </span>
                </div>

                {/* WhatsApp order */}
                <button
                  onClick={generateWhatsAppMessage}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-colors text-sm"
                >
                  <MessageCircle size={17} />
                  Order via WhatsApp
                </button>

                <p className="text-white/20 text-center text-[10px]">
                  You'll be redirected to WhatsApp to confirm your order
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";
// src/components/customer/Navbar.tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useCart } from "@/lib/cartContext";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const { itemCount, toggleCart } = useCart();
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "#", label: "Home" },
    { href: "#bestsellers", label: "Bestsellers" },
    { href: "#menu", label: "Menu" },
    { href: "#testimonials", label: "Reviews" },
    { href: "#footer", label: "Contact" },
  ];

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-30"
        style={{}}
      >
        <motion.div
          className="absolute inset-0 backdrop-blur-xl border-b border-white/5"
          style={{ opacity: bgOpacity, background: "rgba(10,10,10,0.9)" }}
        />
        <div className="relative z-10 container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl">🍛</span>
            <span
              className="gradient-text text-xl font-bold"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Desi Kitchen
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/50 hover:text-saffron-400 text-sm transition-colors"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <motion.button
              onClick={toggleCart}
              className="relative glass border border-white/10 rounded-full w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:border-saffron-500/40 transition-all"
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={17} />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-saffron-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden glass border border-white/10 rounded-full w-10 h-10 flex items-center justify-center text-white/70"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            className="md:hidden absolute top-16 left-0 right-0 border-b border-white/5"
            style={{ background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <nav className="flex flex-col py-4 px-6 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white/60 hover:text-saffron-400 text-sm py-3 border-b border-white/5 last:border-0 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </motion.header>
    </>
  );
}

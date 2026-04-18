"use client";
// src/components/customer/OfferTicker.tsx
import { useEffect, useState } from "react";
import { getOffers } from "@/lib/supabase/db";
import { Offer } from "@/types";

export default function OfferTicker() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    getOffers().then(setOffers).catch(() => {});
  }, []);

  if (offers.length === 0) return null;

  const text = offers.map((o) => o.text).join("   •   ");
  const doubled = text + "   •   " + text;

  return (
    <div className="bg-gradient-to-r from-saffron-700 via-saffron-600 to-gold-600 py-2 overflow-hidden relative z-10">
      <div className="ticker-wrapper">
        <div className="ticker-inner">
          <span className="text-white text-xs md:text-sm font-medium tracking-wide px-8 whitespace-nowrap" style={{ fontFamily: "DM Sans, sans-serif" }}>
            {doubled}
            &nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;
            {doubled}
          </span>
        </div>
      </div>
    </div>
  );
}

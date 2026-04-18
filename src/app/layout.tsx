// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cartContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Desi Kitchen — Authentic Homemade Flavours",
  description: "Fresh desi flavours delivered to your door. Authentic homemade meals, curries, breads, rice and drinks.",
  keywords: "desi food, home cooked, indian food, delivery, cloud kitchen",
  openGraph: {
    title: "Desi Kitchen",
    description: "Authentic homemade meals delivered fresh to your door",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>
        <CartProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#1a1a1a",
                color: "#fff",
                border: "1px solid rgba(255,114,16,0.3)",
                fontFamily: "DM Sans, sans-serif",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}

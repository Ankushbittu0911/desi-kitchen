import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#fff8ed",
          100: "#ffefd4",
          200: "#ffd9a8",
          300: "#ffbc71",
          400: "#ff9438",
          500: "#ff7210",
          600: "#f05506",
          700: "#c73d07",
          800: "#9e300e",
          900: "#7f290f",
        },
        gold: {
          300: "#f5d376",
          400: "#f0c040",
          500: "#d4a017",
          600: "#b8860b",
        },
        cream: "#FFF8F0",
        charcoal: "#0a0a0a",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        ticker: "ticker 25s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "smoke-rise": "smokeRise 4s ease-out infinite",
        "particle-float": "particleFloat 8s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        smokeRise: {
          "0%": { opacity: "0", transform: "translateY(0) scale(1)" },
          "50%": { opacity: "0.15", transform: "translateY(-40px) scale(1.5)" },
          "100%": { opacity: "0", transform: "translateY(-80px) scale(2)" },
        },
        particleFloat: {
          "0%": { transform: "translateY(100vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": {
            transform: "translateY(-100px) rotate(360deg)",
            opacity: "0",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(255, 114, 16, 0.3)",
        "glow-gold": "0 0 30px rgba(212, 160, 23, 0.3)",
        glass:
          "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
      },
    },
  },
  plugins: [],
};
export default config;

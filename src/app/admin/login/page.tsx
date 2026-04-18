"use client";
// src/app/admin/login/page.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/supabase/db";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await signIn(email, password);

      // Verify the user is registered as an admin
      const { getClient } = await import("@/lib/supabase/client");
      const supabase = getClient();
      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!adminRow) {
        await supabase.auth.signOut();
        setError("You do not have admin access.");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch (err: any) {
      const code: string = err?.message ?? "";
      const msg =
        code.includes("Invalid login credentials")
          ? "Invalid email or password."
          : code.includes("Email not confirmed")
          ? "Please confirm your email first."
          : code.includes("Too many requests")
          ? "Too many attempts. Try again later."
          : "Login failed. Please try again.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-saffron-900/15 via-charcoal to-charcoal" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-64 bg-gradient-to-b from-saffron-500/30 to-transparent" />

      {/* Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-saffron-400"
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 20}%` }}
          animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.5, 1] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            className="text-5xl mb-3"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🍛
          </motion.div>
          <h1
            className="gradient-text text-4xl font-bold mb-1"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Desi Kitchen
          </h1>
          <p className="text-white/30 text-sm tracking-widest uppercase">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 border border-white/8 shadow-glass">
          <h2
            className="text-white text-xl font-semibold mb-1"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Welcome back
          </h2>
          <p className="text-white/40 text-sm mb-7">Sign in to manage your kitchen</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@desikitchen.com"
                required
                className="w-full bg-white/5 border border-white/10 focus:border-saffron-500/50 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/25 text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-white/5 border border-white/10 focus:border-saffron-500/50 rounded-2xl pl-11 pr-12 py-3.5 text-white placeholder:text-white/25 text-sm focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-xs">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-saffron text-white font-semibold py-4 rounded-2xl text-sm tracking-wide uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          <a href="/" className="hover:text-saffron-400 transition-colors">
            ← Back to website
          </a>
        </p>
      </motion.div>
    </div>
  );
}


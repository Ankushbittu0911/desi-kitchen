"use client";
// src/components/ui/SpiceParticles.tsx
import { useEffect, useState } from "react";

const SPICES = ["🌶️", "✨", "⭐", "🌿", "💫", "🔥", "🫚", "🧄", "🌰"];

interface Particle {
  id: number;
  emoji: string;
  left: string;
  duration: string;
  delay: string;
  size: string;
  opacity: number;
}

export default function SpiceParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      emoji: SPICES[Math.floor(Math.random() * SPICES.length)],
      left: `${Math.random() * 100}%`,
      duration: `${10 + Math.random() * 15}s`,
      delay: `${Math.random() * 12}s`,
      size: `${10 + Math.random() * 10}px`,
      opacity: 0.15 + Math.random() * 0.2,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="spice-particle select-none"
          style={{
            left: p.left,
            fontSize: p.size,
            opacity: p.opacity,
            "--duration": p.duration,
            "--delay": p.delay,
            "--left": p.left,
          } as React.CSSProperties}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

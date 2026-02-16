"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ProductDetailBackgroundProps {
  children: ReactNode;
  accentColor?: string;
}

export function ProductDetailBackground({
  children,
  accentColor = "rgba(99, 102, 241, 0.06)",
}: ProductDetailBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Soft Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />

      {/* Subtle Gradient Orb - Top Right */}
      <motion.div
        className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle Gradient Orb - Bottom Left */}
      <motion.div
        className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

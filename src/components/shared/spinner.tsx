"use client";

import { motion } from "framer-motion";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "gradient" | "pulse" | "dots" | "orbit" | "ripple";
  className?: string;
}

const sizeMap = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

// Gradient Spinner - Rotating gradient ring
export function GradientSpinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{
          background: "linear-gradient(135deg, #6366F1, #06B6D4, #8B5CF6, #6366F1)",
          backgroundClip: "padding-box",
          WebkitBackgroundClip: "padding-box",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0.5 rounded-full bg-background" />
      </motion.div>
    </div>
  );
}

// Pulse Spinner - Pulsing circles
export function PulseSpinner({ size = "md", className = "" }: SpinnerProps) {
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : size === "md" ? "w-2 h-2" : size === "lg" ? "w-3 h-3" : "w-4 h-4";
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${dotSize} rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Dots Spinner - Bouncing dots
export function DotsSpinner({ size = "md", className = "" }: SpinnerProps) {
  const dotSize = size === "sm" ? "w-2 h-2" : size === "md" ? "w-2.5 h-2.5" : size === "lg" ? "w-3 h-3" : "w-4 h-4";
  
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${dotSize} rounded-full bg-primary`}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Orbit Spinner - Orbiting particles
export function OrbitSpinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
      </motion.div>
      <motion.div
        className="absolute inset-2"
        animate={{ rotate: -360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-primary/20" />
      </div>
    </div>
  );
}

// Ripple Spinner - Expanding ripples
export function RippleSpinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-primary"
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.5, 0, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
      </div>
    </div>
  );
}

// Infinity Spinner - Figure-8 animation
export function InfinitySpinner({ size = "md", className = "" }: SpinnerProps) {
  const pathLength = size === "sm" ? 20 : size === "md" ? 32 : size === "lg" ? 48 : 64;
  
  return (
    <div className={`${sizeMap[size]} ${className}`}>
      <svg viewBox="0 0 100 50" className="w-full h-full">
        <motion.path
          d="M20,25 C20,10 35,10 35,25 C35,40 50,40 50,25 C50,10 65,10 65,25 C65,40 80,40 80,25"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Main Spinner Component
export function Spinner({ 
  size = "md", 
  variant = "gradient", 
  className = "" 
}: SpinnerProps) {
  switch (variant) {
    case "pulse":
      return <PulseSpinner size={size} className={className} />;
    case "dots":
      return <DotsSpinner size={size} className={className} />;
    case "orbit":
      return <OrbitSpinner size={size} className={className} />;
    case "ripple":
      return <RippleSpinner size={size} className={className} />;
    case "gradient":
    default:
      return <GradientSpinner size={size} className={className} />;
  }
}

// Loading Screen with brand spinner
export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <GradientSpinner size="xl" />
        <motion.p 
          className="text-muted-foreground text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}

// Skeleton shimmer component
export function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

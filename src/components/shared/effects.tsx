"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
}

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
  onComplete?: () => void;
}

const colors = [
  "#6366F1", // Indigo
  "#06B6D4", // Cyan
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#EF4444", // Red
];

export function Confetti({
  trigger,
  duration = 3000,
  particleCount = 100,
  onComplete,
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      
      // Generate particles
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      }));
      
      setParticles(newParticles);

      // Clear after duration
      const timeout = setTimeout(() => {
        setParticles([]);
        setIsActive(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [trigger, duration, particleCount, onComplete, isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
              rotate: 0,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              y: `${100 + Math.random() * 20}vh`,
              x: `${particle.x + (Math.random() - 0.5) * 30}vw`,
              rotate: particle.rotation + 720,
              scale: particle.scale,
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2 + Math.random() * 2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              position: "absolute",
              width: "10px",
              height: "10px",
              backgroundColor: particle.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Fireworks effect
interface FireworksProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function Fireworks({ trigger, onComplete }: FireworksProps) {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (trigger) {
      const newBursts = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 40,
      }));
      setBursts(newBursts);

      setTimeout(() => {
        setBursts([]);
        onComplete?.();
      }, 2000);
    }
  }, [trigger, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {bursts.map((burst) => (
          <FireworkBurst key={burst.id} x={burst.x} y={burst.y} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function FireworkBurst({ x, y }: { x: number; y: number }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (i / 20) * 360,
    color: colors[Math.floor(Math.random() * colors.length)],
    distance: 50 + Math.random() * 100,
  }));

  return (
    <div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
            y: Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: "6px",
            height: "6px",
            backgroundColor: particle.color,
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
}

// Sparkle effect for buttons and icons
interface SparklesProps {
  children: React.ReactNode;
  active?: boolean;
}

export function Sparkles({ children, active = true }: SparklesProps) {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      const newSparkle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
      };
      setSparkles((prev) => [...prev.slice(-5), newSparkle]);
    }, 300);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="relative inline-block">
      {children}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1, 0], opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute pointer-events-none"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: "4px",
              height: "4px",
              background: "linear-gradient(135deg, #F59E0B, #FBBF24)",
              borderRadius: "50%",
              boxShadow: "0 0 6px #F59E0B",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Success checkmark animation
interface SuccessCheckmarkProps {
  show: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SuccessCheckmark({
  show,
  size = "md",
  className,
}: SuccessCheckmarkProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const strokeWidths = {
    sm: 2,
    md: 3,
    lg: 4,
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={className}
    >
      <svg
        className={sizes[size]}
        viewBox="0 0 52 52"
      >
        <motion.circle
          cx="26"
          cy="26"
          r="25"
          fill="none"
          stroke="#10B981"
          strokeWidth={strokeWidths[size]}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <motion.path
          fill="none"
          stroke="#10B981"
          strokeWidth={strokeWidths[size]}
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}

// Heart animation for wishlist
interface HeartAnimationProps {
  isLiked: boolean;
  onClick?: () => void;
  className?: string;
}

export function HeartAnimation({ isLiked, onClick, className }: HeartAnimationProps) {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      whileTap={{ scale: 0.8 }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isLiked ? "#EF4444" : "none"}
        stroke={isLiked ? "#EF4444" : "currentColor"}
        strokeWidth="2"
        className="w-6 h-6"
        animate={isLiked ? {
          scale: [1, 1.3, 1],
        } : {}}
        transition={{ duration: 0.3 }}
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </motion.svg>
      
      {/* Burst particles when liked */}
      <AnimatePresence>
        {isLiked && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-500 rounded-full"
                initial={{ scale: 0, x: 12, y: 12 }}
                animate={{
                  scale: [0, 1, 0],
                  x: 12 + Math.cos((i * 60 * Math.PI) / 180) * 20,
                  y: 12 + Math.sin((i * 60 * Math.PI) / 180) * 20,
                }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Cart badge bounce animation
interface CartBadgeAnimationProps {
  count: number;
  children: React.ReactNode;
}

export function CartBadgeAnimation({ count, children }: CartBadgeAnimationProps) {
  return (
    <motion.div
      key={count}
      initial={{ scale: 1.5 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      {children}
    </motion.div>
  );
}

// Notification toast with animation
interface NotificationToastProps {
  message: string;
  type?: "success" | "error" | "info";
  show: boolean;
  onClose?: () => void;
}

export function NotificationToast({
  message,
  type = "success",
  show,
  onClose,
}: NotificationToastProps) {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg ${colors[type]}`}
        >
          <span className="text-xl">{icons[type]}</span>
          <span>{message}</span>
          <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  animation?: "scale" | "bounce" | "pulse" | "shake" | "none";
  glow?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function AnimatedButton({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText = "Loading...",
  icon,
  animation = "scale",
  glow = false,
  className,
  onClick,
  disabled,
  type = "button",
}: AnimatedButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 rounded-lg overflow-hidden";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "text-primary hover:bg-primary/10",
    gradient: "gradient-bg text-white hover:opacity-90",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const animations = {
    scale: { scale: 1.02 },
    bounce: { y: -2 },
    pulse: { scale: [1, 1.02, 1] },
    shake: { x: [-2, 2, -2, 2, 0] },
    none: {},
  };

  const glowStyles = glow ? "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40" : "";

  return (
    <motion.button
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        glowStyles,
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
      whileHover={animations[animation]}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {/* Background shimmer effect */}
      {variant === "gradient" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
      
      {/* Loading spinner */}
      {isLoading && (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      {/* Icon with animation */}
      {icon && !isLoading && (
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
        </motion.span>
      )}
      
      {/* Button text */}
      <span className="relative z-10">{isLoading ? loadingText : children}</span>
    </motion.button>
  );
}

// Magnetic button that follows cursor
interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({ children, className, onClick }: MagneticButtonProps) {
  return (
    <motion.button
      className={cn(
        "relative px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium overflow-hidden",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

// Floating action button with ripple
interface FloatingButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function FloatingButton({ children, onClick, className }: FloatingButtonProps) {
  return (
    <motion.button
      className={cn(
        "fixed bottom-6 right-6 w-14 h-14 gradient-bg rounded-full shadow-lg shadow-primary/30 flex items-center justify-center text-white z-50",
        className
      )}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: [0, -4, 0],
      }}
      transition={{
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

// 3D Tilt Button
interface TiltButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TiltButton({ children, className, onClick }: TiltButtonProps) {
  return (
    <motion.button
      className={cn(
        "relative px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg font-medium shadow-lg",
        className
      )}
      whileHover={{
        scale: 1.02,
        rotateX: 5,
        rotateY: 5,
        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 1000 }}
      onClick={onClick}
    >
      <motion.span
        className="relative z-10 flex items-center gap-2"
        whileHover={{ y: -2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}

// Liquid button effect
interface LiquidButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function LiquidButton({ children, className, onClick }: LiquidButtonProps) {
  return (
    <motion.button
      className={cn(
        "relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white rounded-full font-semibold overflow-hidden",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Liquid animation layers */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-indigo-600"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />
      
      {/* Ripple effects */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{
            scale: [1, 1.2, 1.2],
            opacity: [0.3, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        />
      ))}
      
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

// Neon glowing button
interface NeonButtonProps {
  children: ReactNode;
  className?: string;
  color?: "indigo" | "cyan" | "purple" | "pink";
  onClick?: () => void;
}

export function NeonButton({
  children,
  className,
  color = "indigo",
  onClick,
}: NeonButtonProps) {
  const colorMap = {
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-500/50",
    cyan: "from-cyan-500 to-cyan-600 shadow-cyan-500/50",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/50",
    pink: "from-pink-500 to-pink-600 shadow-pink-500/50",
  };

  return (
    <motion.button
      className={cn(
        "relative px-6 py-3 bg-gradient-to-r text-white rounded-lg font-medium",
        "shadow-lg hover:shadow-xl transition-shadow",
        colorMap[color],
        className
      )}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 30px rgba(99, 102, 241, 0.6)`,
      }}
      whileTap={{ scale: 0.98 }}
      animate={{
        boxShadow: [
          `0 0 10px rgba(99, 102, 241, 0.3)`,
          `0 0 30px rgba(99, 102, 241, 0.5)`,
          `0 0 10px rgba(99, 102, 241, 0.3)`,
        ],
      }}
      transition={{
        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      }}
      onClick={onClick}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

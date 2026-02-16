"use client";

import { useRef, useEffect, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles, MousePointer2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ParallaxHeroProps {
  title: string;
  highlightText: string;
  subtitle: string;
  backgroundImage?: string;
  secondaryBackground?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function ParallaxHero({
  title,
  highlightText,
  subtitle,
  backgroundImage,
  secondaryBackground,
  ctaText = "Shop Now",
  ctaHref = "/products",
  secondaryCtaText = "Browse Categories",
  secondaryCtaHref = "/categories",
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms with spring for smooth animation
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Smooth spring for the parallax effect
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 2);
      mouseY.set((clientY / innerHeight - 0.5) * 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Floating particles with different behaviors
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 3,
    type: i % 3,
  }));

  // Text reveal animation for highlight
  const highlightChars = highlightText.split("");

  return (
    <section
      ref={containerRef}
      className="relative min-h-[95vh] sm:min-h-screen overflow-hidden"
    >
      {/* Animated Background Layer */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: smoothY, scale: smoothScale }}
      >
        {/* Dynamic Gradient Background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)))",
              "radial-gradient(ellipse at 80% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)))",
              "radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)))",
              "radial-gradient(ellipse at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)))",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Secondary Background Image */}
        {secondaryBackground && (
          <div className="absolute inset-0">
            <Image
              src={secondaryBackground}
              alt="Background"
              fill
              className="object-cover opacity-10"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          </div>
        )}

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
            animate={{
              backgroundPosition: ["0px 0px", "80px 80px"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Floating Particles with Different Shapes */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute ${
              particle.type === 0
                ? "rounded-full"
                : particle.type === 1
                ? "rounded-sm rotate-45"
                : "rounded-full border-2 border-primary/30"
            }`}
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor:
                particle.type === 0 ? "rgba(99, 102, 241, 0.3)" : "transparent",
              borderColor: particle.type === 2 ? "rgba(99, 102, 241, 0.4)" : undefined,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.3, 1],
              rotate: particle.type === 1 ? [0, 180, 360] : 0,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Large Animated Orbs */}
        <motion.div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%)",
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Diagonal Lines Animation */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="diagonal-lines" width="40" height="40" patternUnits="userSpaceOnUse">
              <line x1="0" y1="40" x2="40" y2="0" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
        </svg>
      </motion.div>

      {/* Content Layer */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:py-28 lg:py-36 sm:px-6 lg:px-8"
        style={{ y: textY, opacity }}
      >
        <div className="mx-auto max-w-4xl text-center">
          {/* Animated Badge */}
          <motion.div
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm px-5 py-2.5"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          >
            <motion.span
              animate={{
                rotate: [0, 20, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </motion.span>
            <span className="text-sm font-medium text-muted-foreground">
              New arrivals are here
            </span>
          </motion.div>

          {/* Main Title with Character Animation */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1]"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {title.split("").map((char, i) => (
                <motion.span
                  key={i}
                  className={char === " " ? "" : "inline-block"}
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.03,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          {/* Highlight Text with Gradient & Animation */}
          <div className="mb-8">
            <motion.span
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <span className="relative inline-block">
                <motion.span
                  className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  {highlightText}
                </motion.span>
                {/* Underline Animation */}
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  style={{ transformOrigin: "left" }}
                />
              </span>
            </motion.span>
          </div>

          {/* Subtitle with Fade In */}
          <motion.p
            className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {subtitle}
          </motion.p>

          {/* CTA Buttons with Enhanced Styling */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <Link href={ctaHref} className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 sm:h-16 rounded-2xl px-10 sm:px-12 gradient-bg border-0 text-white hover:opacity-90 text-base font-semibold shadow-xl shadow-primary/30 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    {ctaText}
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </span>
                  {/* Shine Effect */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  />
                </Button>
              </motion.div>
            </Link>

            <Link href={secondaryCtaHref} className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 sm:h-16 rounded-2xl px-10 sm:px-12 text-base border-2 hover:bg-primary/5 transition-all duration-300"
                >
                  {secondaryCtaText}
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Scroll to explore
            </span>
            <motion.div
              className="w-7 h-12 rounded-full border-2 border-primary/30 flex justify-center pt-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{
                  y: [0, 16, 0],
                  opacity: [1, 0.3, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />

      {/* Decorative Corner Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 border-l-2 border-t-2 border-primary/20 rounded-tl-3xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      />
      <motion.div
        className="absolute top-20 right-10 w-20 h-20 border-r-2 border-t-2 border-primary/20 rounded-tr-3xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
      />
    </section>
  );
}

// Parallax Image Component for sections
interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  children?: ReactNode;
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.5,
  children,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-20 * speed}%`, `${20 * speed}%`]
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover scale-110"
          sizes="100vw"
        />
      </motion.div>
      {children && (
        <div className="relative z-10 h-full flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

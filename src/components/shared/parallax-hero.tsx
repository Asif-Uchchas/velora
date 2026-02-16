"use client";

import { useRef, useEffect, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
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

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] sm:min-h-screen overflow-hidden"
    >
      {/* Background Layer with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: smoothY, scale: smoothScale }}
      >
        {/* Primary Background */}
        <div className="absolute inset-0 gradient-bg opacity-10" />

        {/* Secondary Background Image with Overlay */}
        {secondaryBackground && (
          <div className="absolute inset-0">
            <Image
              src={secondaryBackground}
              alt="Background"
              fill
              className="object-cover opacity-20"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          </div>
        )}

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-[100px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-[100px]"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Content Layer */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:py-32 sm:px-6 lg:px-8"
        style={{ y: textY, opacity }}
      >
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            className="mb-6 sm:mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 sm:px-5 py-2 text-sm backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
            </motion.span>
            <span className="text-muted-foreground">
              New arrivals are here
            </span>
          </motion.div>

          {/* Title with Character Animation */}
          <div className="overflow-hidden mb-4 sm:mb-6">
            <motion.h1
              className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1]"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              {title.split("").map((char, i) => (
                <motion.span
                  key={i}
                  className={char === " " ? "" : "inline-block"}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.03,
                    ease: "easeOut",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          {/* Highlight Text with Gradient Animation */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <span className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold">
              <motion.span
                className="inline-block gradient-text bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                {highlightText}
              </motion.span>
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Link href={ctaHref} className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 sm:h-14 rounded-2xl px-8 sm:px-10 gradient-bg border-0 text-white hover:opacity-90 text-sm sm:text-base font-semibold shadow-lg shadow-primary/25 group"
                >
                  {ctaText}
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Button>
              </motion.div>
            </Link>

            <Link href={secondaryCtaHref} className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 sm:h-14 rounded-2xl px-8 sm:px-10 text-sm sm:text-base border-2 hover:bg-primary/5 transition-colors"
                >
                  {secondaryCtaText}
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span className="text-xs text-muted-foreground">Scroll to explore</span>
            <motion.div
              className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center p-1"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
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

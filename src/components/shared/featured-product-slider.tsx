"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/formatters";

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  category: string;
  accentColor?: string;
}

interface FeaturedProductSliderProps {
  products: FeaturedProduct[];
  autoplayInterval?: number;
}

export function FeaturedProductSlider({
  products,
  autoplayInterval = 6000,
}: FeaturedProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentProduct = products[currentIndex];

  // Mouse tracking for dynamic background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, autoplayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, autoplayInterval]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1] as const,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1] as const,
      },
    }),
  };

  const textVariants = {
    enter: { opacity: 0, y: 30 },
    center: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2 },
    },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
  };

  if (!products.length) return null;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[80vh] sm:min-h-[90vh] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at 30% 30%, ${currentProduct.accentColor || "rgba(99, 102, 241, 0.15)"} 0%, transparent 50%),
             radial-gradient(circle at 70% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
             linear-gradient(to bottom, transparent, hsl(var(--background)))`,
            `radial-gradient(circle at 70% 30%, ${currentProduct.accentColor || "rgba(99, 102, 241, 0.15)"} 0%, transparent 50%),
             radial-gradient(circle at 30% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
             linear-gradient(to bottom, transparent, hsl(var(--background)))`,
          ],
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Mouse-follow Gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background: useMotionValue(
            `radial-gradient(circle at 50% 50%, ${currentProduct.accentColor || "rgba(99, 102, 241, 0.2)"} 0%, transparent 40%)`
          ),
        }}
      />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Featured Collection
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold">
            Featured Products
          </h2>
        </motion.div>

        {/* Slider Content */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              {/* Image Side */}
              <motion.div
                className="relative aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={currentProduct.images[0] || "/placeholder.svg"}
                  alt={currentProduct.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />

                {/* Image Overlay Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating Badge */}
                <motion.div
                  className="absolute top-4 left-4 sm:top-6 sm:left-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                    {currentProduct.category}
                  </span>
                </motion.div>

                {/* Price Badge */}
                {currentProduct.comparePrice && (
                  <motion.div
                    className="absolute top-4 right-4 sm:top-6 sm:right-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 text-white rounded-full text-xs sm:text-sm font-bold">
                      {Math.round(
                        ((currentProduct.comparePrice - currentProduct.price) /
                          currentProduct.comparePrice) *
                          100
                      )}
                      % OFF
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* Content Side */}
              <motion.div variants={textVariants} className="text-center lg:text-left">
                <motion.span
                  className="inline-block text-xs sm:text-sm text-primary font-medium uppercase tracking-widest mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentProduct.category}
                </motion.span>

                <motion.h3
                  className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentProduct.name}
                </motion.h3>

                <motion.p
                  className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 line-clamp-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {currentProduct.description}
                </motion.p>

                <motion.div
                  className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                    {formatPrice(currentProduct.price)}
                  </span>
                  {currentProduct.comparePrice && (
                    <span className="text-base sm:text-lg text-muted-foreground line-through">
                      {formatPrice(currentProduct.comparePrice)}
                    </span>
                  )}
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link href={`/products/${currentProduct.slug}`} className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-12 sm:h-14 rounded-2xl px-8 sm:px-10 gradient-bg border-0 text-white text-sm sm:text-base font-semibold shadow-lg shadow-primary/25 group"
                    >
                      View Product
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-0 sm:-mx-4 lg:-mx-8">
            <motion.button
              onClick={prevSlide}
              className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors border"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors border"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.button>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-12">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="relative h-1.5 sm:h-2 rounded-full overflow-hidden bg-muted transition-all duration-300"
              style={{ width: index === currentIndex ? "3rem" : "0.75rem" }}
            >
              <motion.div
                className="absolute inset-0 bg-primary rounded-full"
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: index === currentIndex ? 1 : 0,
                }}
                transition={{ duration: index === currentIndex ? autoplayInterval / 1000 : 0.3 }}
                style={{ transformOrigin: "left" }}
              />
            </button>
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-center mt-4">
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>
            {" / "}
            {String(products.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

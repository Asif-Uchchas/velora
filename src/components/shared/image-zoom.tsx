"use client";

import { useRef, useState, useCallback, TouchEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  zoomScale?: number;
  showOverlay?: boolean;
}

export function ImageZoom({
  src,
  alt,
  className = "",
  zoomScale = 2.5,
  showOverlay = true,
}: ImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  // Mouse position for desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse movement
  const springConfig = { stiffness: 150, damping: 20 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Transform mouse position to background position
  const backgroundX = useTransform(smoothMouseX, [0, 1], [0, 100]);
  const backgroundY = useTransform(smoothMouseY, [0, 1], [0, 100]);

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      mouseX.set(Math.max(0, Math.min(1, x)));
      mouseY.set(Math.max(0, Math.min(1, y)));
    },
    [mouseX, mouseY]
  );

  // Handle touch events for mobile
  const handleTouchStart = useCallback(() => {
    setIsTouching(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (!containerRef.current || !isTouching) return;

      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;

      mouseX.set(Math.max(0, Math.min(1, x)));
      mouseY.set(Math.max(0, Math.min(1, y)));
    },
    [isTouching, mouseX, mouseY]
  );

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden cursor-crosshair ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      initial={false}
    >
      {/* Base Image - visible when not zooming */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: isHovered || isTouching ? 1 : 1,
          opacity: isHovered || isTouching ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </motion.div>

      {/* Zoomed Image Container */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered || isTouching ? 1 : 0,
          scale: isHovered || isTouching ? 1 : 0.95,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Zoomed Image with moving background position */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomScale * 100}%`,
            backgroundPositionX: useTransform(backgroundX, (v) => `${v}%`),
            backgroundPositionY: useTransform(backgroundY, (v) => `${v}%`),
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Circular Mask Overlay for cool effect */}
        {showOverlay && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: useTransform(
                [smoothMouseX, smoothMouseY],
                ([x, y]) => {
                  const posX = (x as number) * 100;
                  const posY = (y as number) * 100;
                  return `radial-gradient(circle at ${posX}% ${posY}%, transparent 0%, transparent 30%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.3) 100%)`;
                }
              ),
            }}
          />
        )}

        {/* Zoom Lens Indicator */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: useTransform(smoothMouseX, [0, 1], ["0%", "100%"]),
            top: useTransform(smoothMouseY, [0, 1], ["0%", "100%"]),
            x: "-50%",
            y: "-50%",
          }}
          animate={{
            scale: isHovered || isTouching ? 1 : 0,
            opacity: isHovered || isTouching ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-24 h-24 rounded-full border-2 border-white/50 shadow-lg backdrop-blur-sm bg-white/10" />
        </motion.div>
      </motion.div>

      {/* Mobile Touch Hint */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full md:hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: isTouching ? 0 : 1,
          y: isTouching ? 10 : 0,
        }}
        transition={{ delay: 0.5 }}
      >
        Touch and move to zoom
      </motion.div>
    </motion.div>
  );
}

// Advanced Image Zoom with Magnifier Effect
interface MagnifierZoomProps {
  src: string;
  alt: string;
  className?: string;
  magnifierSize?: number;
  zoomLevel?: number;
}

export function MagnifierZoom({
  src,
  alt,
  className = "",
  magnifierSize = 150,
  zoomLevel = 2.5,
}: MagnifierZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCursorPosition({ x, y });
    setMagnifierPosition({
      x: x - magnifierSize / 2,
      y: y - magnifierSize / 2,
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Main Image */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />

      {/* Magnifier */}
      <motion.div
        className="absolute pointer-events-none rounded-full border-2 border-white shadow-2xl overflow-hidden"
        style={{
          width: magnifierSize,
          height: magnifierSize,
          left: magnifierPosition.x,
          top: magnifierPosition.y,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: showMagnifier ? 1 : 0,
          opacity: showMagnifier ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${cursorPosition.x}px ${cursorPosition.y}px`,
            backgroundRepeat: "no-repeat",
            transform: `scale(${zoomLevel})`,
            transformOrigin: `${cursorPosition.x}px ${cursorPosition.y}px`,
          }}
        />
      </motion.div>

      {/* Crosshair */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showMagnifier ? 1 : 0 }}
      >
        <div className="absolute -translate-x-1/2 w-4 h-0.5 bg-white/80" />
        <div className="absolute -translate-y-1/2 w-0.5 h-4 bg-white/80" />
      </motion.div>
    </div>
  );
}

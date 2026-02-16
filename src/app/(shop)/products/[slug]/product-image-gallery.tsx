"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageLightbox } from "@/components/shared/image-lightbox";
import { ImageZoom } from "@/components/shared/image-zoom";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  discount?: number;
}

export function ProductImageGallery({ images, productName, discount }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  const hasMultipleImages = images.length > 1;
  const mainImage = images[selectedIndex] || images[0] || "/placeholder.svg";

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="space-y-3 sm:space-y-4 w-full">
        {/* Main Image with Zoom */}
        <motion.div
          className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl border bg-muted group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image Zoom Component */}
          <ImageZoom
            src={mainImage}
            alt={productName}
            className="w-full h-full"
            zoomScale={2.5}
            showOverlay={true}
          />

          {/* Click to open lightbox overlay */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute inset-0 z-20 cursor-zoom-in"
            aria-label="Open image gallery"
          />

          {/* Zoom Icon Overlay */}
          <motion.div
            className="absolute top-4 right-4 z-30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
              <ZoomIn className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </div>
          </motion.div>

          {/* Navigation Arrows for multiple images */}
          {hasMultipleImages && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </>
          )}

          {/* Discount Badge */}
          {discount && discount > 0 && (
            <motion.div
              className="absolute left-4 top-4 z-30"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                -{discount}% OFF
              </div>
            </motion.div>
          )}

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>

        {/* Thumbnail Gallery */}
        {hasMultipleImages && (
          <motion.div
            className="grid grid-cols-5 gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {images.map((img, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl border-2 transition-all ${
                  index === selectedIndex
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-muted hover:border-primary/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={img}
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 20vw, 100px"
                />
                {index === selectedIndex && (
                  <motion.div
                    layoutId="activeThumbnail"
                    className="absolute inset-0 bg-primary/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        productName={productName}
      />
    </>
  );
}

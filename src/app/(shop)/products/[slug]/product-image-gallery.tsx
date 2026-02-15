"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { ImageLightbox } from "@/components/shared/image-lightbox";

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
    discount?: number;
}

export function ProductImageGallery({ images, productName, discount }: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const hasMultipleImages = images.length > 1;
    const mainImage = images[selectedIndex] || images[0] || "/placeholder.svg";

    return (
        <>
            <div className="space-y-3 sm:space-y-4 w-full">
                {/* Main Image */}
                <motion.div
                    className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl border bg-muted cursor-zoom-in group"
                    onClick={() => setLightboxOpen(true)}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                >
                    <Image
                        src={mainImage}
                        alt={productName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
                    />
                    
                    {/* Zoom Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <div className="bg-white/90 dark:bg-black/90 rounded-full p-3 backdrop-blur-sm">
                            <ZoomIn className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        </div>
                    </div>

                    {/* Discount Badge */}
                    {discount && discount > 0 && (
                        <div className="absolute left-3 top-3 sm:left-4 sm:top-4 bg-red-500 text-white px-2 py-1 rounded-lg text-xs sm:text-sm font-semibold">
                            -{discount}% OFF
                        </div>
                    )}
                </motion.div>

                {/* Thumbnail Gallery */}
                {hasMultipleImages && (
                    <div className="grid grid-cols-5 gap-2 sm:gap-3">
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
                            </motion.button>
                        ))}
                    </div>
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

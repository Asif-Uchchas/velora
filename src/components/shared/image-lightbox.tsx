"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageLightboxProps {
    images: string[];
    initialIndex?: number;
    isOpen: boolean;
    onClose: () => void;
    productName: string;
}

export function ImageLightbox({
    images,
    initialIndex = 0,
    isOpen,
    onClose,
    productName,
}: ImageLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const currentImage = images[currentIndex];

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setScale(1);
            setPosition({ x: 0, y: 0 });
        }
    }, [isOpen, initialIndex]);

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "Escape":
                    onClose();
                    break;
                case "ArrowLeft":
                    goToPrevious();
                    break;
                case "ArrowRight":
                    goToNext();
                    break;
                case "+":
                case "=":
                    zoomIn();
                    break;
                case "-":
                    zoomOut();
                    break;
                case "0":
                    resetZoom();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, currentIndex]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        resetZoom();
    }, [images.length]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        resetZoom();
    }, [images.length]);

    const zoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.5, 1));
    const resetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Handle mouse/touch drag for panning when zoomed
    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Handle click on image for zoom toggle
    const handleImageClick = (e: React.MouseEvent) => {
        // Only zoom if not dragging
        if (!isDragging) {
            if (scale === 1) {
                zoomIn();
            } else {
                resetZoom();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
                onClick={onClose}
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
                    <div className="text-white">
                        <h3 className="font-medium text-sm">{productName}</h3>
                        <p className="text-xs text-white/60">
                            {currentIndex + 1} / {images.length}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Main Image Container */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Previous Button */}
                    {images.length > 1 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 z-10 text-white hover:bg-white/20"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </Button>
                    )}

                    {/* Image */}
                    <motion.div
                        className="relative w-full h-full max-w-5xl max-h-[80vh] mx-16 cursor-grab active:cursor-grabbing"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onClick={handleImageClick}
                        animate={{
                            scale,
                            x: position.x,
                            y: position.y,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <Image
                            src={currentImage}
                            alt={`${productName} - Image ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1200px) 100vw, 1200px"
                            priority
                        />
                    </motion.div>

                    {/* Next Button */}
                    {images.length > 1 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 z-10 text-white hover:bg-white/20"
                            onClick={goToNext}
                        >
                            <ChevronRight className="h-8 w-8" />
                        </Button>
                    )}
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="flex items-center justify-center gap-2">
                        {/* Zoom Controls */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={zoomOut}
                            disabled={scale <= 1}
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-white text-sm min-w-[60px] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={zoomIn}
                            disabled={scale >= 3}
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>

                        {/* Thumbnail Navigation */}
                        {images.length > 1 && (
                            <div className="flex items-center gap-2 ml-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setCurrentIndex(idx);
                                            resetZoom();
                                        }}
                                        className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                                            idx === currentIndex
                                                ? "border-white"
                                                : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

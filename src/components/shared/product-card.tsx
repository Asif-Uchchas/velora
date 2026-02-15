"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/formatters";
import { toast } from "sonner";
import { Confetti } from "@/components/shared/effects";

interface ProductCardProps {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: string[];
    stock: number;
    category?: string;
    isFeatured?: boolean;
    isNew?: boolean;
}

export function ProductCard({
    id,
    name,
    slug,
    price,
    comparePrice,
    images,
    stock,
    category,
    isFeatured,
    isNew,
}: ProductCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const addItem = useCartStore((s) => s.addItem);
    
    const discount = comparePrice
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    const displayImages = images.length > 0 ? images : ["/placeholder.svg"];
    const hasMultipleImages = displayImages.length > 1;

    // 3D tilt effect
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-8deg", "8deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) / rect.width);
        y.set((e.clientY - centerY) / rect.height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
        setCurrentImageIndex(0);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: `cart-${id}`,
            productId: id,
            name,
            price,
            image: displayImages[0],
            stock,
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 500);
        toast.success(`${name} added to cart!`, {
            icon: <ShoppingBag className="w-4 h-4" />,
        });
    };

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
        if (!isLiked) {
            toast.success("Added to wishlist!");
        }
    };

    return (
        <>
            <Confetti trigger={showConfetti} particleCount={20} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full"
                style={{ perspective: 1000 }}
            >
                <Link href={`/products/${slug}`} className="group block h-full">
                    <motion.div
                        ref={cardRef}
                        className="overflow-hidden rounded-2xl border bg-card shadow-premium h-full flex flex-col relative"
                        style={{
                            rotateX: isHovered ? rotateX : 0,
                            rotateY: isHovered ? rotateY : 0,
                            transformStyle: "preserve-3d",
                        }}
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={handleMouseLeave}
                        whileHover={{
                            boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Image Container */}
                        <div className="relative aspect-square overflow-hidden bg-muted flex-shrink-0">
                            <motion.div
                                className="absolute inset-0"
                                animate={{
                                    scale: isHovered ? 1.05 : 1,
                                }}
                                transition={{ duration: 0.4 }}
                            >
                                <Image
                                    src={displayImages[currentImageIndex]}
                                    alt={`${name} - Image ${currentImageIndex + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                                />
                            </motion.div>

                            {/* Gradient overlay on hover */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isHovered ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            />

                            {/* Image Indicators */}
                            {hasMultipleImages && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                    {displayImages.slice(0, 5).map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setCurrentImageIndex(idx);
                                            }}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                idx === currentImageIndex
                                                    ? "bg-white w-4"
                                                    : "bg-white/50 hover:bg-white/70"
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Badges */}
                            <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
                                {isNew && (
                                    <Badge className="bg-green-500 text-white border-0 text-[10px] px-2 py-0.5 shadow-lg">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        NEW
                                    </Badge>
                                )}
                                {isFeatured && (
                                    <Badge className="gradient-bg border-0 text-white text-[10px] px-2 py-0.5 shadow-lg">
                                        Featured
                                    </Badge>
                                )}
                                {discount > 0 && (
                                    <Badge variant="destructive" className="text-[10px] px-2 py-0.5 shadow-lg">
                                        -{discount}%
                                    </Badge>
                                )}
                                {stock === 0 && (
                                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5 shadow-lg">
                                        Out of Stock
                                    </Badge>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
                                <motion.button
                                    onClick={handleLike}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                                        isLiked 
                                            ? "bg-red-500 text-white" 
                                            : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
                                    }`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    animate={isLiked ? {
                                        scale: [1, 1.2, 1],
                                    } : {}}
                                >
                                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                </motion.button>
                                
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </motion.div>
                            </div>

                            {/* Add to cart button */}
                            {stock > 0 && (
                                <motion.div
                                    className="absolute bottom-3 left-3 right-3 z-10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ 
                                        opacity: isHovered ? 1 : 0, 
                                        y: isHovered ? 0 : 20 
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Button
                                        onClick={handleAddToCart}
                                        className="w-full rounded-xl gradient-bg border-0 text-white text-sm shadow-lg hover:shadow-xl transition-shadow"
                                        size="sm"
                                    >
                                        <motion.span
                                            className="flex items-center gap-2"
                                            whileHover={{ x: 3 }}
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            Add to Cart
                                        </motion.span>
                                    </Button>
                                </motion.div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4 flex flex-col flex-grow">
                            {category && (
                                <motion.p 
                                    className="text-[11px] font-medium text-primary uppercase tracking-wider mb-1"
                                    initial={{ opacity: 0.7 }}
                                    whileHover={{ opacity: 1 }}
                                >
                                    {category}
                                </motion.p>
                            )}
                            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight mb-2">
                                {name}
                            </h3>
                            <div className="mt-auto flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-base text-primary">
                                    {formatPrice(price)}
                                </span>
                                {comparePrice && (
                                    <span className="text-xs text-muted-foreground line-through">
                                        {formatPrice(comparePrice)}
                                    </span>
                                )}
                            </div>

                            {/* Mobile Add to Cart */}
                            {stock > 0 && (
                                <motion.div
                                    className="mt-3 sm:hidden"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={handleAddToCart}
                                        className="w-full rounded-lg gradient-bg border-0 text-white text-xs h-9"
                                        size="sm"
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                                        Add to Cart
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </Link>
            </motion.div>
        </>
    );
}

// 3D Card with advanced hover effects
export function ProductCard3D({
    id,
    name,
    slug,
    price,
    comparePrice,
    images,
    stock,
    category,
    isFeatured,
}: ProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) / rect.width);
        y.set((e.clientY - centerY) / rect.height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    const discount = comparePrice
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    return (
        <motion.div
            ref={cardRef}
            className="relative w-full h-full cursor-pointer"
            style={{
                perspective: 1000,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={`/products/${slug}`}>
                <motion.div
                    className="relative w-full h-full rounded-2xl overflow-hidden bg-card border shadow-2xl"
                    style={{
                        rotateX: rotateX,
                        rotateY: rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    whileHover={{
                        boxShadow: "0 30px 60px -15px rgba(99, 102, 241, 0.4)",
                    }}
                >
                    {/* Shine effect */}
                    <motion.div
                        className="absolute inset-0 z-20 pointer-events-none"
                        style={{
                            background: useTransform(
                                [mouseX, mouseY],
                                ([latestX, latestY]) =>
                                    `radial-gradient(circle at ${(latestX as number + 0.5) * 100}% ${(latestY as number + 0.5) * 100}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
                            ),
                        }}
                    />

                    {/* Content */}
                    <div className="relative aspect-square">
                        <Image
                            src={images[0] || "/placeholder.svg"}
                            alt={name}
                            fill
                            className="object-cover"
                        />
                        
                        {/* Floating badge */}
                        <motion.div
                            className="absolute top-4 left-4 z-10"
                            style={{
                                translateZ: 50,
                            }}
                        >
                            {discount > 0 && (
                                <Badge className="bg-red-500 text-white border-0 shadow-lg">
                                    -{discount}%
                                </Badge>
                            )}
                        </motion.div>
                    </div>

                    {/* Info with depth */}
                    <motion.div 
                        className="p-4"
                        style={{
                            translateZ: 30,
                        }}
                    >
                        <h3 className="font-bold text-lg">{name}</h3>
                        <p className="text-2xl font-bold text-primary mt-2">
                            {formatPrice(price)}
                        </p>
                    </motion.div>
                </motion.div>
            </Link>
        </motion.div>
    );
}

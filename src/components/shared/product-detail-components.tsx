"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Package,
  Award,
  Clock,
  CheckCircle2,
  Star,
  Zap,
  Leaf,
  Sparkles,
  TrendingUp,
  Users,
  Box,
  CreditCard,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/formatters";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { Confetti } from "@/components/shared/effects";

interface ProductQuickActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
  };
}

export function ProductQuickActions({ product }: ProductQuickActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    // Add item multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `cart-${product.id}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        stock: product.stock,
      });
    }
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 500);
    toast.success(`${quantity} × ${product.name} added to cart!`, {
      icon: <ShoppingCart className="w-4 h-4" />,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success("Added to wishlist!", {
        icon: <Heart className="w-4 h-4" />,
      });
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      // User cancelled or share failed
    }
  };

  return (
    <>
      <Confetti trigger={showConfetti} particleCount={30} />
      <div className="space-y-4">
        {/* Quantity Selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
          <div className="flex items-center border rounded-xl overflow-hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
            >
              -
            </motion.button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
            >
              +
            </motion.button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full h-14 rounded-2xl gradient-bg border-0 text-white font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-xl transition-shadow"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              className={`h-14 w-14 rounded-2xl border-2 ${
                isLiked ? "border-red-500 text-red-500" : ""
              }`}
              onClick={handleLike}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-2xl border-2"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
}

// Feature Badge Component
interface FeatureBadgeProps {
  icon: React.ElementType;
  label: string;
  description: string;
  color?: string;
  delay?: number;
}

export function FeatureBadge({ icon: Icon, label, description, color = "primary", delay = 0 }: FeatureBadgeProps) {
  const colorClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/20",
    green: "bg-green-500/10 text-green-600 border-green-500/20",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    orange: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    pink: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`flex flex-col items-center text-center p-4 rounded-2xl border ${colorClasses[color]} hover:shadow-lg transition-shadow`}
    >
      <motion.div
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-6 h-6 mb-2" />
      </motion.div>
      <span className="font-semibold text-sm">{label}</span>
      <span className="text-xs opacity-80 mt-1">{description}</span>
    </motion.div>
  );
}

// Trust Badges Grid
export function TrustBadgesGrid() {
  const badges = [
    { icon: Truck, label: "Free Shipping", description: "On orders over $100", color: "green" },
    { icon: Shield, label: "Secure Payment", description: "100% secure checkout", color: "blue" },
    { icon: RotateCcw, label: "Easy Returns", description: "30-day return policy", color: "purple" },
    { icon: Package, label: "Fast Delivery", description: "2-5 business days", color: "orange" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {badges.map((badge, index) => (
        <FeatureBadge key={badge.label} {...badge} delay={index * 0.1} />
      ))}
    </div>
  );
}

// Product Highlights
interface ProductHighlightsProps {
  highlights: string[];
}

export function ProductHighlights({ highlights }: ProductHighlightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-3"
    >
      <h4 className="font-semibold flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        Product Highlights
      </h4>
      <ul className="space-y-2">
        {highlights.map((highlight, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>{highlight}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

// Product Stats
export function ProductStats() {
  const stats = [
    { icon: Users, value: "50K+", label: "Happy Customers" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Box, value: "100%", label: "Authentic" },
    { icon: TrendingUp, value: "Top", label: "Best Seller" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="grid grid-cols-4 gap-2 py-4 border-y"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + index * 0.1 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.2, rotate: 5 }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 mb-1"
          >
            <stat.icon className="w-4 h-4 text-primary" />
          </motion.div>
          <div className="font-bold text-sm">{stat.value}</div>
          <div className="text-[10px] text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Animated Price Display
interface AnimatedPriceProps {
  price: number;
  comparePrice?: number | null;
}

export function AnimatedPrice({ price, comparePrice }: AnimatedPriceProps) {
  const discount = comparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-baseline gap-3 flex-wrap"
    >
      <motion.span
        className="text-3xl sm:text-4xl lg:text-5xl font-bold"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {formatPrice(price)}
      </motion.span>

      {comparePrice && (
        <>
          <motion.span
            className="text-lg sm:text-xl text-muted-foreground line-through"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {formatPrice(comparePrice)}
          </motion.span>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <Badge className="bg-red-500 text-white border-0 px-3 py-1">
              <Zap className="w-3 h-3 mr-1" />
              Save {discount}%
            </Badge>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

// Rating Display with Stars
interface RatingDisplayProps {
  rating: number;
  reviewCount: number;
}

export function RatingDisplay({ rating, reviewCount }: RatingDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: star * 0.05 }}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted"
              }`}
            />
          </motion.div>
        ))}
      </div>

      <span className="font-semibold">{rating.toFixed(1)}</span>

      <span className="text-muted-foreground">
        ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
      </span>
    </motion.div>
  );
}

// Stock Status Badge
interface StockStatusProps {
  stock: number;
}

export function StockStatus({ stock }: StockStatusProps) {
  const getStatus = () => {
    if (stock === 0) return { label: "Out of Stock", color: "destructive", icon: Box };
    if (stock < 10) return { label: `Only ${stock} left!`, color: "orange", icon: Clock };
    return { label: "In Stock", color: "green", icon: CheckCircle2 };
  };

  const status = getStatus();
  const Icon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-2"
    >
      <motion.div
        animate={stock < 10 && stock > 0 ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Icon
          className={`w-5 h-5 ${
            status.color === "green"
              ? "text-green-500"
              : status.color === "orange"
              ? "text-orange-500"
              : "text-red-500"
          }`}
        />
      </motion.div>

      <Badge
        variant={status.color === "destructive" ? "destructive" : "secondary"}
        className={`${
          status.color === "green"
            ? "bg-green-500/10 text-green-600"
            : status.color === "orange"
            ? "bg-orange-500/10 text-orange-600"
            : ""
        }`}
      >
        {status.label}
      </Badge>
    </motion.div>
  );
}

// Guarantee Section
export function GuaranteeSection() {
  const guarantees = [
    { icon: Award, title: "Quality Guarantee", desc: "Premium materials" },
    { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
    { icon: CreditCard, title: "Secure Payment", desc: "256-bit encryption" },
    { icon: Leaf, title: "Eco-Friendly", desc: "Sustainable packaging" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-muted/30 rounded-2xl p-4 sm:p-6"
    >
      <h4 className="font-semibold mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Our Guarantees
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {guarantees.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="flex items-start gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

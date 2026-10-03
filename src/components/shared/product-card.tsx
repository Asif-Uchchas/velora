"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { useWishlist } from "@/hooks/use-wishlist";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";

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
    ratingAvg?: number;
    ratingCount?: number;
    /** Above-the-fold cards load their image eagerly */
    priority?: boolean;
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
    ratingAvg = 0,
    ratingCount = 0,
    priority = false,
}: ProductCardProps) {
    const { isInWishlist, toggleItem, isLoading } = useWishlist();
    const addItem = useCartStore((s) => s.addItem);

    const discount = comparePrice && comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
    const images0 = images[0] || "/placeholder.svg";
    const images1 = images[1];
    const inWishlist = isInWishlist(id);
    const soldOut = stock === 0;

    function addToCart(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        addItem({ id: `cart-${id}`, productId: id, name, price, image: images0, stock });
        toast.success(`${name} added to cart`, {
            action: { label: "View cart", onClick: () => (window.location.href = "/cart") },
        });
    }

    async function toggleWishlist(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoading) await toggleItem(id);
    }

    return (
        <Link
            href={`/products/${slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-shadow duration-300 hover:shadow-premium focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
        >
            <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                    src={images0}
                    alt={name}
                    fill
                    priority={priority}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={cn(
                        "object-cover transition duration-500 group-hover:scale-[1.03]",
                        images1 && "group-hover:opacity-0",
                        soldOut && "opacity-60"
                    )}
                />
                {/* Second photo on hover, when there is one */}
                {images1 && (
                    <Image
                        src={images1}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover opacity-0 transition duration-500 group-hover:opacity-100"
                    />
                )}

                <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
                    {discount > 0 && (
                        <span className="rounded-md bg-destructive px-1.5 py-0.5 text-[11px] font-semibold text-white">
                            −{discount}%
                        </span>
                    )}
                    {isNew && (
                        <span className="rounded-md bg-foreground px-1.5 py-0.5 text-[11px] font-semibold text-background">New</span>
                    )}
                    {isFeatured && !discount && (
                        <span className="rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                            Featured
                        </span>
                    )}
                    {soldOut && (
                        <span className="rounded-md bg-background/90 px-1.5 py-0.5 text-[11px] font-semibold text-foreground">
                            Sold out
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={toggleWishlist}
                    aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
                    aria-pressed={inWishlist}
                    className={cn(
                        "absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-colors",
                        inWishlist ? "bg-red-500 text-white" : "bg-background/90 text-foreground hover:text-red-500"
                    )}
                >
                    <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
                </button>
            </div>

            <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
                {category && (
                    <p className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">{category}</p>
                )}
                <h3 className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary">{name}</h3>

                <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                    <div className="min-w-0">
                        <p className="flex flex-wrap items-baseline gap-x-1.5">
                            <span className="font-semibold">{formatPrice(price)}</span>
                            {discount > 0 && (
                                <span className="text-xs text-muted-foreground line-through">{formatPrice(comparePrice!)}</span>
                            )}
                        </p>
                        {ratingCount > 0 && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                                <span className="text-foreground">{ratingAvg.toFixed(1)}</span>
                                <span>({ratingCount})</span>
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={addToCart}
                        disabled={soldOut}
                        aria-label={soldOut ? `${name} is sold out` : `Add ${name} to cart`}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-background transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-40"
                    >
                        <ShoppingBag className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </Link>
    );
}

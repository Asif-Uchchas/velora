"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Heart, MapPin, MessageCircle, Minus, Plus, Share2, ShoppingBag, Truck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { useWishlist } from "@/hooks/use-wishlist";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const MAX_PER_ORDER = 20;

interface Props {
    product: {
        id: string;
        name: string;
        price: number;
        comparePrice: number | null;
        stock: number;
        images: string[];
    };
    fees: { inside: number; outside: number };
}

export function PurchasePanel({ product, fees }: Props) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((s) => s.addItem);
    const { isInWishlist, toggleItem, isLoading } = useWishlist();

    const soldOut = product.stock === 0;
    const maxQty = Math.min(product.stock, MAX_PER_ORDER);
    const discount =
        product.comparePrice && product.comparePrice > product.price
            ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
            : 0;
    const inWishlist = isInWishlist(product.id);

    function addToCart() {
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: `cart-${product.id}`,
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] || "/placeholder.svg",
                stock: product.stock,
            });
        }
    }

    function handleAdd() {
        addToCart();
        toast.success(`${quantity} × ${product.name} added to cart`, {
            action: { label: "View cart", onClick: () => router.push("/cart") },
        });
    }

    function handleBuyNow() {
        addToCart();
        router.push("/checkout");
    }

    async function handleShare() {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: product.name, url });
                return;
            }
            await navigator.clipboard.writeText(url);
            toast.success("Link copied");
        } catch {
            // dismissed or not allowed
        }
    }

    const stockState = soldOut
        ? { icon: XCircle, label: "Sold out", cls: "bg-destructive/10 text-destructive" }
        : product.stock < 10
            ? { icon: Clock, label: `Only ${product.stock} left · Ready to ship`, cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400" }
            : { icon: CheckCircle2, label: "In stock · Ready to ship", cls: "bg-green-600/10 text-green-700 dark:text-green-400" };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-3xl font-semibold tracking-tight">{formatPrice(product.price)}</span>
                {discount > 0 && (
                    <>
                        <span className="text-lg text-muted-foreground line-through">{formatPrice(product.comparePrice!)}</span>
                        <span className="rounded-md bg-destructive px-1.5 py-0.5 text-xs font-semibold text-white">Save {discount}%</span>
                    </>
                )}
            </div>

            <p className={cn("inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium", stockState.cls)}>
                <stockState.icon className="h-4 w-4" aria-hidden="true" />
                {stockState.label}
            </p>

            {!soldOut && (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground" id="qty-label">Quantity</span>
                    <div className="flex items-center rounded-xl border" role="group" aria-labelledby="qty-label">
                        <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                            className="flex h-11 w-11 items-center justify-center rounded-l-xl hover:bg-muted disabled:opacity-40"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-medium tabular-nums" aria-live="polite">{quantity}</span>
                        <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                            disabled={quantity >= maxQty}
                            aria-label="Increase quantity"
                            className="flex h-11 w-11 items-center justify-center rounded-r-xl hover:bg-muted disabled:opacity-40"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={soldOut}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                    <ShoppingBag className="h-4 w-4" />
                    Add to cart
                </button>
                <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={soldOut}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-700 text-sm font-semibold text-white transition-colors hover:bg-green-800 disabled:opacity-40"
                >
                    Buy now
                </button>
            </div>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => !isLoading && toggleItem(product.id)}
                    aria-pressed={inWishlist}
                    className={cn(
                        "inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm transition-colors hover:bg-muted",
                        inWishlist && "border-red-300 text-red-600 dark:border-red-900 dark:text-red-400"
                    )}
                >
                    <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
                    {inWishlist ? "Saved" : "Save"}
                </button>
                <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm transition-colors hover:bg-muted"
                >
                    <Share2 className="h-4 w-4" />
                    Share
                </button>
            </div>

            <ul className="divide-y rounded-2xl border text-sm">
                <li className="flex gap-3 p-4">
                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span>
                        <span className="font-medium">Cash on delivery.</span>{" "}
                        <span className="text-muted-foreground">No payment until it reaches you.</span>
                    </span>
                </li>
                <li className="flex gap-3 p-4">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span>
                        <span className="font-medium">Delivery {formatPrice(fees.inside)}</span>{" "}
                        <span className="text-muted-foreground">
                            inside Dhaka (1–2 days), {formatPrice(fees.outside)} elsewhere (3–5 days).
                        </span>
                    </span>
                </li>
                <li className="flex gap-3 p-4">
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-700 dark:text-green-400" aria-hidden="true" />
                    <span>
                        <span className="font-medium">Order on WhatsApp</span>{" "}
                        <span className="text-muted-foreground">at checkout and we confirm with you before shipping.</span>
                    </span>
                </li>
            </ul>
        </div>
    );
}

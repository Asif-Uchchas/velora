"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/formatters";

export default function CartPage() {
    const { items, updateQuantity, removeItem, clearCart, getTotal } =
        useCartStore();

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 animate-fade-in">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted mb-6">
                        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold">Your cart is empty</h1>
                    <p className="mt-2 text-muted-foreground max-w-md">
                        Looks like you haven&apos;t added anything to your cart yet. Start
                        browsing our collection to find something you love.
                    </p>
                    <Link href="/products">
                        <Button className="mt-8 rounded-lg gradient-bg border-0 text-white hover:opacity-90">
                            Continue Shopping
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8 lg:px-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Shopping Cart</h1>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive text-xs sm:text-sm">
                    Clear Cart
                </Button>
            </div>

            <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
                {/* Items */}
                <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                    <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                            <motion.div
                                key={item.productId}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="flex gap-3 sm:gap-4 rounded-xl border bg-card p-3 sm:p-4 shadow-premium"
                            >
                                <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 80px, 96px"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col justify-between min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-medium text-sm truncate">{item.name}</h3>
                                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                                {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeItem(item.productId)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-2">
                                        <div className="flex items-center rounded-lg border">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 sm:h-8 sm:w-8 rounded-r-none"
                                                onClick={() =>
                                                    updateQuantity(item.productId, item.quantity - 1)
                                                }
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="flex h-7 w-8 sm:h-8 sm:w-10 items-center justify-center text-xs sm:text-sm">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 sm:h-8 sm:w-8 rounded-l-none"
                                                onClick={() =>
                                                    updateQuantity(item.productId, item.quantity + 1)
                                                }
                                                disabled={item.quantity >= item.stock}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <span className="text-xs sm:text-sm font-semibold">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-premium lg:sticky lg:top-24">
                        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Summary</h2>
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPrice(getTotal())}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold">
                                <span className="text-sm sm:text-base">Total</span>
                                <span className="text-base sm:text-lg">{formatPrice(getTotal())}</span>
                            </div>
                        </div>
                        <Link href="/checkout">
                            <Button className="w-full mt-4 sm:mt-6 h-10 sm:h-11 rounded-lg gradient-bg border-0 text-white hover:opacity-90 text-sm sm:text-base">
                                Proceed to Checkout
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/products">
                            <Button variant="outline" className="w-full mt-2 sm:mt-3 rounded-lg h-10 sm:h-11 text-sm sm:text-base">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

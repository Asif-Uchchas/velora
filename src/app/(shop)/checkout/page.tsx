"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { createCheckoutSession } from "@/actions/order";
import { formatPrice } from "@/lib/formatters";
import { toast } from "sonner";
import Image from "next/image";

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { items, getTotal } = useCartStore();

    async function handleCheckout() {
        setLoading(true);
        const result = await createCheckoutSession();

        if (result.error) {
            toast.error(result.error);
            setLoading(false);
            return;
        }

        if (result.url) {
            window.location.href = result.url;
        }
    }

    if (items.length === 0) {
        router.push("/cart");
        return null;
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="rounded-xl border bg-card p-6 shadow-premium">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6">
                    {items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    Qty: {item.quantity}
                                </p>
                            </div>
                            <span className="text-sm font-medium">
                                {formatPrice(item.price * item.quantity)}
                            </span>
                        </div>
                    ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(getTotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-green-600">Free</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(getTotal())}</span>
                    </div>
                </div>

                <Button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full mt-6 h-12 rounded-lg gradient-bg border-0 text-white hover:opacity-90 text-base"
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Pay with Stripe
                </Button>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Payments are secure and encrypted
                </div>
            </div>
        </div>
    );
}

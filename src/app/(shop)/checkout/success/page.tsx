import Link from "next/link";
import { CheckCircle, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Order Confirmed",
};

export default function CheckoutSuccessPage() {
    return (
        <div className="mx-auto max-w-lg px-4 py-24 sm:px-6 lg:px-8 animate-fade-in">
            <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 mb-6">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold">Order Confirmed!</h1>
                <p className="mt-3 text-muted-foreground max-w-sm mx-auto">
                    Thank you for your purchase. Your order has been received and is being
                    processed. You&apos;ll receive an email confirmation shortly.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link href="/account/orders">
                        <Button className="rounded-lg gradient-bg border-0 text-white hover:opacity-90">
                            <Package className="mr-2 h-4 w-4" />
                            View Orders
                        </Button>
                    </Link>
                    <Link href="/products">
                        <Button variant="outline" className="rounded-lg">
                            Continue Shopping
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

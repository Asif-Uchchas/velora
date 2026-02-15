"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

interface Props {
    product: {
        id: string;
        name: string;
        price: number;
        images: string[];
        stock: number;
    };
}

export function AddToCartButton({ product }: Props) {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((s) => s.addItem);

    function handleAdd() {
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
        toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart`);
    }

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center justify-center sm:justify-start rounded-lg border">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 sm:h-11 sm:w-11 rounded-r-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="flex h-10 w-12 sm:h-11 sm:w-14 items-center justify-center text-sm sm:text-base font-medium">
                    {quantity}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 sm:h-11 sm:w-11 rounded-l-none"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <Button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="flex-1 h-11 sm:h-12 rounded-lg gradient-bg border-0 text-white hover:opacity-90 text-sm sm:text-base"
            >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
        </div>
    );
}

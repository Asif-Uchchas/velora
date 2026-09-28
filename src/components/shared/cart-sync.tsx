"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { getCartSnapshot } from "@/actions/product";
import { useCartStore } from "@/stores/cart-store";

/** Refreshes cart prices/stock from the server once per mount (cart + checkout pages). */
export function CartSync() {
    const done = useRef(false);

    useEffect(() => {
        if (done.current) return;
        done.current = true;
        const { items, syncWithServer } = useCartStore.getState();
        if (items.length === 0) return;

        getCartSnapshot(items.map((i) => i.productId))
            .then((products) => {
                if (syncWithServer(products)) {
                    toast.info("Your cart was updated with the latest prices and stock.");
                }
            })
            .catch(() => {
                // Non-fatal: the server re-checks everything when the order is placed
            });
    }, []);

    return null;
}

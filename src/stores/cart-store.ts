"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    syncWithServer: (
        products: Array<{ id: string; name: string; price: number; stock: number; image: string }>
    ) => boolean;
    getItemCount: () => number;
    getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const existing = get().items.find((i) => i.productId === item.productId);
                if (existing) {
                    if (existing.quantity >= Math.min(item.stock, 20)) return;
                    set({
                        items: get().items.map((i) =>
                            i.productId === item.productId
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...get().items, { ...item, quantity: 1 }] });
                }
            },

            removeItem: (productId) => {
                set({ items: get().items.filter((i) => i.productId !== productId) });
            },

            updateQuantity: (productId, quantity) => {
                const item = get().items.find((i) => i.productId === productId);
                if (item) quantity = Math.min(quantity, item.stock, 20);
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.productId === productId ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            // Replace local price/stock with the server's; drop items that no longer exist.
            // Returns true if anything changed.
            syncWithServer: (products) => {
                const byId = new Map(products.map((p) => [p.id, p]));
                let changed = false;
                const next: CartItem[] = [];
                for (const item of get().items) {
                    const p = byId.get(item.productId);
                    if (!p || p.stock === 0) {
                        changed = true;
                        continue;
                    }
                    const quantity = Math.min(item.quantity, p.stock);
                    if (p.price !== item.price || p.stock !== item.stock || quantity !== item.quantity || p.name !== item.name) {
                        changed = true;
                    }
                    next.push({ ...item, name: p.name, price: p.price, stock: p.stock, image: p.image, quantity });
                }
                if (changed) set({ items: next });
                return changed;
            },

            getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

            getTotal: () =>
                get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        }),
        {
            name: "velora-cart",
            // v2: prices are BDT. Carts saved before that held USD prices, so start fresh.
            version: 2,
            migrate: () => ({ items: [] }) as unknown as CartStore,
        }
    )
);

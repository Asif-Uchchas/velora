"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShopQuery } from "./use-shop-query";

// Parent passes key={initial} so the input resets when the URL query changes.
export function ShopSearch({ initial, className }: { initial?: string; className?: string }) {
    const { update } = useShopQuery();
    const [value, setValue] = useState(initial ?? "");

    return (
        <form
            role="search"
            onSubmit={(e) => {
                e.preventDefault();
                update({ q: value.trim() || null, search: null });
            }}
            className={cn("relative", className)}
        >
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
                type="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                maxLength={100}
                placeholder="Search products, categories…"
                aria-label="Search products"
                className="h-11 w-full rounded-xl border bg-card pl-10 pr-10 text-sm outline-none transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring/40 [&::-webkit-search-cancel-button]:hidden"
            />
            {value && (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                        setValue("");
                        update({ q: null, search: null });
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </form>
    );
}

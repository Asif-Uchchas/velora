"use client";

import { X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS, type ShopFilters } from "@/lib/shop-params";
import { formatTaka } from "@/lib/formatters";
import { useShopQuery } from "./use-shop-query";
import type { FilterCategory } from "./shop-filters";

export function SortSelect({ value }: { value: string }) {
    const { update } = useShopQuery();
    return (
        <Select value={value} onValueChange={(v) => update({ sort: v })}>
            <SelectTrigger className="h-10 w-48 rounded-lg" aria-label="Sort products">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                        {o.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

/** Removable chips for every active filter. */
export function ActiveFilters({ filters, categories }: { filters: ShopFilters; categories: FilterCategory[] }) {
    const { update, clear, isPending } = useShopQuery();

    const chips: Array<{ label: string; remove: () => void }> = [];
    if (filters.q) chips.push({ label: `“${filters.q}”`, remove: () => update({ q: null, search: null }) });
    for (const slug of filters.categories) {
        const name = categories.find((c) => c.slug === slug)?.name ?? slug;
        chips.push({
            label: name,
            remove: () => update({ category: filters.categories.filter((s) => s !== slug).join(",") || null }),
        });
    }
    if (filters.min || filters.max) {
        const label =
            filters.min && filters.max
                ? `${formatTaka(filters.min)} – ${formatTaka(filters.max)}`
                : filters.min
                    ? `Over ${formatTaka(filters.min)}`
                    : `Under ${formatTaka(filters.max!)}`;
        chips.push({ label, remove: () => update({ min: null, max: null }) });
    }
    if (filters.inStock) chips.push({ label: "In stock", remove: () => update({ stock: null }) });
    if (filters.onSale) chips.push({ label: "On sale", remove: () => update({ sale: null }) });
    if (filters.featured) chips.push({ label: "Featured", remove: () => update({ featured: null }) });
    if (filters.rating) chips.push({ label: `${filters.rating}★ & up`, remove: () => update({ rating: null }) });

    if (chips.length === 0) return null;

    return (
        <div className={`flex flex-wrap items-center gap-2 transition-opacity ${isPending ? "opacity-60" : ""}`}>
            {chips.map((chip) => (
                <button
                    key={chip.label}
                    type="button"
                    onClick={chip.remove}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground pl-3 pr-2 text-xs font-medium text-background hover:bg-foreground/85"
                    aria-label={`Remove filter ${chip.label}`}
                >
                    {chip.label}
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
            ))}
            {chips.length > 1 && (
                <button type="button" onClick={clear} className="px-1 text-xs font-medium text-primary hover:underline">
                    Clear all
                </button>
            )}
        </div>
    );
}

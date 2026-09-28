"use client";

import { useState } from "react";
import { SlidersHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { PRICE_PRESETS, SORT_OPTIONS, type ShopFilters } from "@/lib/shop-params";
import { formatPriceWithoutSymbol } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useShopQuery } from "./use-shop-query";

export interface FilterCategory {
    id: string;
    name: string;
    slug: string;
    _count: { products: number };
}

interface Props {
    categories: FilterCategory[];
    filters: ShopFilters;
    priceBounds: { min: number; max: number };
    total: number;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {children}
        </p>
    );
}

function Chip({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                "inline-flex h-9 items-center gap-1 rounded-full border px-3 text-xs sm:text-[13px] transition-colors",
                active
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : "border-border bg-card hover:bg-muted"
            )}
        >
            {children}
        </button>
    );
}

function PriceInputs({ filters, priceBounds }: Pick<Props, "filters" | "priceBounds">) {
    const { update } = useShopQuery();
    const [minInput, setMinInput] = useState(filters.min?.toString() ?? "");
    const [maxInput, setMaxInput] = useState(filters.max?.toString() ?? "");

    function applyPrice(e?: React.FormEvent) {
        e?.preventDefault();
        const min = Math.max(0, Math.trunc(Number(minInput) || 0));
        const max = Math.max(0, Math.trunc(Number(maxInput) || 0));
        if (min === (filters.min ?? 0) && max === (filters.max ?? 0)) return;
        update({
            min: min > 0 ? String(min) : null,
            max: max > 0 ? String(Math.max(max, min)) : null,
        });
    }

    return (
        <form onSubmit={applyPrice} className="flex items-center gap-2">
            <Input
                inputMode="numeric"
                aria-label="Minimum price"
                placeholder={formatPriceWithoutSymbol(priceBounds.min)}
                value={minInput}
                onChange={(e) => setMinInput(e.target.value.replace(/\D/g, ""))}
                onBlur={() => applyPrice()}
                className="h-10 rounded-lg"
            />
            <span className="text-muted-foreground">–</span>
            <Input
                inputMode="numeric"
                aria-label="Maximum price"
                placeholder={formatPriceWithoutSymbol(priceBounds.max)}
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value.replace(/\D/g, ""))}
                onBlur={() => applyPrice()}
                className="h-10 rounded-lg"
            />
            <button type="submit" className="sr-only">Apply price</button>
        </form>
    );
}

function FilterPanel({ categories, filters, priceBounds, showSort }: Props & { showSort?: boolean }) {
    const { update, clear } = useShopQuery();
    const [showAllCats, setShowAllCats] = useState(false);
    const selected = new Set(filters.categories);
    const visibleCats = showAllCats ? categories : categories.slice(0, 6);

    function toggleCategory(slug: string) {
        const next = new Set(selected);
        if (next.has(slug)) next.delete(slug);
        else next.add(slug);
        update({ category: [...next].join(",") || null });
    }

    return (
        <div className="space-y-6">
            {showSort && (
                <div>
                    <SectionLabel>Sort by</SectionLabel>
                    <div className="flex flex-wrap gap-2">
                        {SORT_OPTIONS.map((o) => (
                            <Chip key={o.value} active={filters.sort === o.value} onClick={() => update({ sort: o.value })}>
                                {o.label}
                            </Chip>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <SectionLabel>Category</SectionLabel>
                <div className="space-y-0.5">
                    {visibleCats.map((cat) => (
                        <label
                            key={cat.id}
                            className="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm hover:bg-muted"
                        >
                            <input
                                type="checkbox"
                                checked={selected.has(cat.slug)}
                                onChange={() => toggleCategory(cat.slug)}
                                className="h-4 w-4 rounded accent-[var(--primary)]"
                            />
                            <span className="flex-1 truncate">{cat.name}</span>
                            <span className="text-xs text-muted-foreground">{cat._count.products}</span>
                        </label>
                    ))}
                </div>
                {categories.length > 6 && (
                    <button
                        type="button"
                        onClick={() => setShowAllCats((v) => !v)}
                        className="mt-1 px-2 text-sm font-medium text-primary hover:underline"
                    >
                        {showAllCats ? "Show less" : `+ ${categories.length - 6} more`}
                    </button>
                )}
            </div>

            <div>
                <SectionLabel>Price (৳)</SectionLabel>
                {/* Keyed so the inputs reset when the price filter changes elsewhere (chips, presets, clear) */}
                <PriceInputs key={`${filters.min ?? ""}-${filters.max ?? ""}`} filters={filters} priceBounds={priceBounds} />
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {PRICE_PRESETS.map((p) => (
                        <Chip
                            key={p.label}
                            active={filters.min === p.min && filters.max === p.max}
                            onClick={() =>
                                update({ min: p.min ? String(p.min) : null, max: p.max ? String(p.max) : null })
                            }
                        >
                            {p.label}
                        </Chip>
                    ))}
                </div>
            </div>

            <div>
                <SectionLabel>Availability &amp; deals</SectionLabel>
                {(
                    [
                        { key: "stock", label: "In stock only", on: filters.inStock },
                        { key: "sale", label: "On sale", on: filters.onSale },
                        { key: "featured", label: "Featured picks", on: filters.featured },
                    ] as const
                ).map((t) => (
                    <label key={t.key} className="flex h-10 cursor-pointer items-center justify-between px-2 text-sm">
                        {t.label}
                        <Switch checked={t.on} onCheckedChange={(v) => update({ [t.key]: v ? "1" : null })} />
                    </label>
                ))}
            </div>

            <div>
                <SectionLabel>Customer rating</SectionLabel>
                <div className="flex flex-wrap gap-1.5">
                    <Chip active={!filters.rating} onClick={() => update({ rating: null })}>Any</Chip>
                    {[4, 3].map((r) => (
                        <Chip key={r} active={filters.rating === r} onClick={() => update({ rating: String(r) })}>
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                            {r} &amp; up
                        </Chip>
                    ))}
                </div>
            </div>

            <Button variant="outline" className="w-full rounded-lg" onClick={clear}>
                Reset all filters
            </Button>
        </div>
    );
}

export function ShopFiltersSidebar(props: Props) {
    return (
        <div className="rounded-2xl border bg-card p-5 shadow-premium">
            <p className="mb-5 text-[15px] font-semibold">Filters</p>
            <FilterPanel {...props} />
        </div>
    );
}

export function ShopFiltersSheet(props: Props & { activeCount: number }) {
    const [open, setOpen] = useState(false);
    const { isPending } = useShopQuery();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="h-10 shrink-0 rounded-full bg-foreground px-4 text-background hover:bg-foreground/90">
                    <SlidersHorizontal className="mr-1.5 h-4 w-4" />
                    Filters{props.activeCount > 0 ? ` · ${props.activeCount}` : ""}
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[88dvh] rounded-t-2xl p-0">
                <SheetHeader className="border-b px-5 py-4">
                    <SheetTitle>Filters &amp; sort</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto px-5 py-5 scroll-momentum">
                    <FilterPanel {...props} showSort />
                </div>
                <SheetFooter className="border-t px-5 py-4">
                    <Button
                        className="h-12 w-full rounded-xl gradient-bg border-0 text-base text-white"
                        onClick={() => setOpen(false)}
                    >
                        {isPending ? "Updating…" : `Show ${props.total} product${props.total === 1 ? "" : "s"}`}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

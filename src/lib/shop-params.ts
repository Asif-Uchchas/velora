// URL <-> filter state for the shop view. Shared by the server page and the client filters.

export const SORT_OPTIONS = [
    { value: "popular", label: "Most popular" },
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: low to high" },
    { value: "price-desc", label: "Price: high to low" },
    { value: "rating", label: "Top rated" },
    { value: "discount", label: "Biggest discount" },
] as const;

export const PRICE_PRESETS = [
    { label: "Under ৳1,000", min: undefined, max: 1000 },
    { label: "৳1,000 – ৳5,000", min: 1000, max: 5000 },
    { label: "৳5,000 – ৳20,000", min: 5000, max: 20000 },
    { label: "Over ৳20,000", min: 20000, max: undefined },
] as const;

export interface ShopFilters {
    q?: string;
    categories: string[];
    min?: number;
    max?: number;
    inStock: boolean;
    onSale: boolean;
    featured: boolean;
    rating?: number;
    sort: string;
    page: number;
}

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function positiveInt(v: string | undefined) {
    if (!v) return undefined;
    const n = Math.trunc(Number(v));
    return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function parseShopParams(raw: RawParams): ShopFilters {
    const sort = first(raw.sort);
    const rating = positiveInt(first(raw.rating));
    return {
        q: first(raw.q ?? raw.search)?.trim().slice(0, 100) || undefined,
        categories: (first(raw.category) ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 20),
        min: positiveInt(first(raw.min)),
        max: positiveInt(first(raw.max)),
        inStock: first(raw.stock) === "1",
        onSale: first(raw.sale) === "1",
        featured: first(raw.featured) === "1" || first(raw.featured) === "true",
        rating: rating && rating <= 4 ? rating : undefined,
        sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort! : "popular",
        page: Math.min(positiveInt(first(raw.page)) ?? 1, 1000),
    };
}

export function hasActiveFilters(f: ShopFilters) {
    return Boolean(
        f.q || f.categories.length || f.min || f.max || f.inStock || f.onSale || f.featured || f.rating
    );
}

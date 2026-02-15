"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
    categories: Array<{
        id: string;
        name: string;
        slug: string;
        _count: { products: number };
    }>;
    activeCategory?: string;
    activeSort?: string;
    searchQuery?: string;
}

const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
];

export function ProductFilters({ categories, activeCategory, activeSort, searchQuery }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchQuery || "");

    function updateFilter(key: string, value: string | null) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.push(`/products?${params.toString()}`);
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        updateFilter("search", search || null);
    }

    function clearFilters() {
        setSearch("");
        router.push("/products");
    }

    const hasActiveFilters = activeCategory || activeSort || searchQuery;

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Search */}
            <form onSubmit={handleSearch}>
                <Label className="text-xs font-medium uppercase text-muted-foreground mb-1.5 sm:mb-2 block">
                    Search
                </Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="h-9 sm:h-10 pl-9 rounded-lg text-sm"
                    />
                </div>
            </form>

            {/* Categories */}
            <div>
                <Label className="text-xs font-medium uppercase text-muted-foreground mb-1.5 sm:mb-2 block">
                    Categories
                </Label>
                <div className="space-y-0.5 sm:space-y-1 max-h-48 sm:max-h-none overflow-y-auto scroll-momentum">
                    <button
                        onClick={() => updateFilter("category", null)}
                        className={`w-full rounded-lg px-2.5 sm:px-3 py-2 text-left text-xs sm:text-sm transition-colors ${!activeCategory
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted"
                            }`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateFilter("category", cat.slug)}
                            className={`w-full rounded-lg px-2.5 sm:px-3 py-2 text-left text-xs sm:text-sm transition-colors flex items-center justify-between ${activeCategory === cat.slug
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            <span className="truncate mr-2">{cat.name}</span>
                            <span className="text-[10px] sm:text-xs shrink-0">{cat._count.products}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Sort */}
            <div>
                <Label className="text-xs font-medium uppercase text-muted-foreground mb-1.5 sm:mb-2 block">
                    Sort By
                </Label>
                <div className="space-y-0.5 sm:space-y-1">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => updateFilter("sort", option.value)}
                            className={`w-full rounded-lg px-2.5 sm:px-3 py-2 text-left text-xs sm:text-sm transition-colors ${activeSort === option.value
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
                <Button
                    variant="outline"
                    className="w-full rounded-lg h-9 sm:h-10 text-xs sm:text-sm"
                    onClick={clearFilters}
                >
                    <X className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Clear Filters
                </Button>
            )}
        </div>
    );
}

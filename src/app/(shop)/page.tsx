import Link from "next/link";
import type { Metadata } from "next";
import { getPriceBounds, getProducts } from "@/actions/product";
import { getCategories } from "@/actions/category";
import { ProductCard } from "@/components/shared/product-card";
import { FeaturedStrip } from "@/components/shop/featured-strip";
import { ShopFiltersSheet, ShopFiltersSidebar } from "@/components/shop/shop-filters";
import { ActiveFilters, SortSelect } from "@/components/shop/shop-toolbar";
import { ShopSearch } from "@/components/shop/shop-search";
import { hasActiveFilters, parseShopParams } from "@/lib/shop-params";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Velora — Shop Premium Products",
    description: "Shop premium products with cash on delivery across Bangladesh. Order on WhatsApp in seconds.",
};

export const dynamic = "force-dynamic";

interface Props {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const PAGE_SIZE = 24;

export default async function ShopPage({ searchParams }: Props) {
    const filters = parseShopParams(await searchParams);
    const categories = await getCategories();

    const categoryIds = categories.filter((c) => filters.categories.includes(c.slug)).map((c) => c.id);
    const filtered = hasActiveFilters(filters);

    const [{ products, total, pages }, priceBounds, featured] = await Promise.all([
        getProducts({
            search: filters.q,
            // Unknown slugs match nothing rather than silently showing everything
            categoryIds: filters.categories.length ? (categoryIds.length ? categoryIds : ["__none__"]) : undefined,
            minPrice: filters.min,
            maxPrice: filters.max,
            inStock: filters.inStock,
            onSale: filters.onSale,
            featured: filters.featured,
            minRating: filters.rating,
            sort: filters.sort,
            page: filters.page,
            limit: PAGE_SIZE,
        }),
        getPriceBounds(),
        !filtered && filters.page === 1 ? getProducts({ featured: true, limit: 3 }) : null,
    ]);

    const activeCount =
        filters.categories.length +
        (filters.min || filters.max ? 1 : 0) +
        [filters.inStock, filters.onSale, filters.featured, Boolean(filters.rating)].filter(Boolean).length;

    const heading = filters.q
        ? `Results for “${filters.q}”`
        : filters.categories.length === 1
            ? categories.find((c) => c.slug === filters.categories[0])?.name ?? "Products"
            : filters.featured
                ? "Featured picks"
                : "All products";

    const filterProps = { categories, filters, priceBounds, total };

    function pageHref(page: number) {
        const params = new URLSearchParams();
        if (filters.q) params.set("q", filters.q);
        if (filters.categories.length) params.set("category", filters.categories.join(","));
        if (filters.min) params.set("min", String(filters.min));
        if (filters.max) params.set("max", String(filters.max));
        if (filters.inStock) params.set("stock", "1");
        if (filters.onSale) params.set("sale", "1");
        if (filters.featured) params.set("featured", "1");
        if (filters.rating) params.set("rating", String(filters.rating));
        if (filters.sort !== "popular") params.set("sort", filters.sort);
        if (page > 1) params.set("page", String(page));
        const qs = params.toString();
        return qs ? `/?${qs}` : "/";
    }

    const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
        (p) => p === 1 || p === pages || Math.abs(p - filters.page) <= 2
    );

    return (
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:pt-6 lg:px-8 animate-fade-in">
            {featured && featured.products.length > 0 && (
                <div className="mb-5">
                    <FeaturedStrip products={featured.products} />
                </div>
            )}

            {/* Mobile: search + filter trigger + quick category chips */}
            <div className="mb-4 space-y-3 lg:hidden">
                <ShopSearch key={filters.q ?? ""} initial={filters.q} />
                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
                    <ShopFiltersSheet {...filterProps} activeCount={activeCount} />
                    <Link
                        href="/"
                        scroll={false}
                        className={cn(
                            "flex h-10 shrink-0 items-center rounded-full border px-4 text-sm",
                            filters.categories.length === 0 ? "border-primary bg-primary/10 font-semibold text-primary" : "bg-card"
                        )}
                    >
                        All
                    </Link>
                    {categories.map((c) => (
                        <Link
                            key={c.id}
                            href={`/?category=${c.slug}`}
                            scroll={false}
                            className={cn(
                                "flex h-10 shrink-0 items-center rounded-full border px-4 text-sm",
                                filters.categories.includes(c.slug)
                                    ? "border-primary bg-primary/10 font-semibold text-primary"
                                    : "bg-card"
                            )}
                        >
                            {c.name}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex gap-8">
                <aside className="hidden w-72 shrink-0 lg:block">
                    <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto no-scrollbar">
                        <ShopFiltersSidebar {...filterProps} />
                    </div>
                </aside>

                <section className="min-w-0 flex-1" aria-labelledby="shop-heading">
                    <div className="mb-4 flex flex-wrap items-end gap-3">
                        <div className="min-w-0 flex-1">
                            <h1 id="shop-heading" className="truncate text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                                {heading}
                            </h1>
                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm" aria-live="polite">
                                {total} product{total === 1 ? "" : "s"}
                                {filtered ? " match" : ""}
                            </p>
                        </div>
                        <ShopSearch key={filters.q ?? ""} initial={filters.q} className="hidden w-72 lg:block" />
                        <div className="hidden lg:block">
                            <SortSelect value={filters.sort} />
                        </div>
                    </div>

                    <div className="mb-5">
                        <ActiveFilters filters={filters} categories={categories} />
                    </div>

                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
                            <h2 className="text-lg font-semibold">No products match these filters</h2>
                            <p className="mt-1 max-w-sm px-4 text-sm text-muted-foreground">
                                Try removing a filter or widening the price range.
                            </p>
                            <Link
                                href="/"
                                className="mt-5 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                            >
                                Show all products
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        slug={product.slug}
                                        price={product.price}
                                        comparePrice={product.comparePrice}
                                        images={product.images}
                                        stock={product.stock}
                                        category={product.category.name}
                                        isFeatured={product.isFeatured}
                                        ratingAvg={product.ratingAvg}
                                        ratingCount={product.ratingCount}
                                    />
                                ))}
                            </div>

                            {pages > 1 && (
                                <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
                                    {filters.page > 1 && (
                                        <Link href={pageHref(filters.page - 1)} className="flex h-10 items-center rounded-lg px-3 text-sm hover:bg-muted">
                                            ← Prev
                                        </Link>
                                    )}
                                    {pageNumbers.map((page, i) => (
                                        <span key={page} className="flex items-center gap-1.5">
                                            {i > 0 && page - pageNumbers[i - 1] > 1 && (
                                                <span className="px-1 text-muted-foreground">…</span>
                                            )}
                                            <Link
                                                href={pageHref(page)}
                                                aria-current={page === filters.page ? "page" : undefined}
                                                className={cn(
                                                    "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium",
                                                    page === filters.page ? "gradient-bg text-white" : "bg-muted hover:bg-muted/70"
                                                )}
                                            >
                                                {page}
                                            </Link>
                                        </span>
                                    ))}
                                    {filters.page < pages && (
                                        <Link href={pageHref(filters.page + 1)} className="flex h-10 items-center rounded-lg px-3 text-sm hover:bg-muted">
                                            Next →
                                        </Link>
                                    )}
                                </nav>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

import { Suspense } from "react";
import { getProducts } from "@/actions/product";
import { getCategories } from "@/actions/category";
import { ProductCard } from "@/components/shared/product-card";
import { ProductGridSkeleton } from "@/components/shared/product-skeleton";
import { ProductFilters } from "./product-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Products",
    description: "Browse our curated collection of premium products.",
};

interface Props {
    searchParams: Promise<{
        search?: string;
        category?: string;
        sort?: string;
        page?: string;
        featured?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: Props) {
    const params = await searchParams;
    const categories = await getCategories();

    const selectedCategory = params.category
        ? categories.find((c) => c.slug === params.category)
        : null;

    const { products, total, pages } = await getProducts({
        search: params.search,
        categoryId: selectedCategory?.id,
        sort: params.sort,
        featured: params.featured === "true",
        page: Number(params.page) || 1,
        limit: 12,
    });

    const currentPage = Number(params.page) || 1;

    return (
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8 lg:px-8 animate-fade-in">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    {params.search
                        ? `Search: "${params.search}"`
                        : params.featured === "true"
                            ? "Featured Products"
                            : selectedCategory
                                ? selectedCategory.name
                                : "All Products"}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    {total} product{total !== 1 ? "s" : ""} found
                </p>
            </div>

            <div className="flex flex-col gap-6 lg:gap-8 lg:flex-row">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 shrink-0">
                    <div className="lg:sticky lg:top-24">
                        <ProductFilters
                            categories={categories}
                            activeCategory={params.category}
                            activeSort={params.sort}
                            searchQuery={params.search}
                        />
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <Suspense fallback={<ProductGridSkeleton />}>
                        {products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
                                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-muted mb-4">
                                    <span className="text-2xl sm:text-3xl">🔍</span>
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold">No products found</h3>
                                <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm px-4">
                                    Try adjusting your filters or search terms to find what you&apos;re looking for.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:gap-6 lg:grid-cols-3">
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
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pages > 1 && (
                                    <div className="mt-6 sm:mt-8 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                                        {Array.from({ length: pages }, (_, i) => i + 1).map(
                                            (page) => (
                                                <a
                                                    key={page}
                                                    href={`/products?${new URLSearchParams({
                                                        ...params,
                                                        page: String(page),
                                                    }).toString()}`}
                                                    className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-colors ${page === currentPage
                                                            ? "gradient-bg text-white"
                                                            : "bg-muted hover:bg-muted/80"
                                                        }`}
                                                >
                                                    {page}
                                                </a>
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

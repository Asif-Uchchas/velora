import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/actions/category";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Categories",
    description: "Browse all product categories.",
};

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Categories</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Browse all product categories
                </p>
            </div>

            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-4">
                        <span className="text-3xl">📂</span>
                    </div>
                    <h3 className="text-lg font-semibold">No categories yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Check back later for new categories.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group overflow-hidden rounded-xl border bg-card hover-lift shadow-premium"
                        >
                            <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                                {category.image ? (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 gradient-bg opacity-10" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-base font-semibold text-white">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs text-white/70 mt-0.5">
                                        {category._count.products} products
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

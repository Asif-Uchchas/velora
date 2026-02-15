import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Shield, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/actions/product";
import { getCategories } from "@/actions/category";
import { ProductCard } from "@/components/shared/product-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Velora — Premium E-Commerce",
    description: "Discover premium products at Velora. Beautiful, modern e-commerce experience.",
};

// Force dynamic rendering to avoid database issues during build
export const dynamic = 'force-dynamic';

const features = [
    {
        icon: Sparkles,
        title: "Premium Quality",
        description: "Curated products from top brands",
    },
    {
        icon: Truck,
        title: "Free Shipping",
        description: "On orders over $100",
    },
    {
        icon: Shield,
        title: "Secure Payments",
        description: "Protected by Stripe",
    },
    {
        icon: CreditCard,
        title: "Easy Returns",
        description: "30-day return policy",
    },
];

export default async function HomePage() {
    let featuredProducts: any[] = [];
    let categories: any[] = [];

    try {
        const [productsResult, categoriesResult] = await Promise.all([
            getProducts({ featured: true, limit: 4 }),
            getCategories(),
        ]);
        featuredProducts = productsResult.products || [];
        categories = categoriesResult || [];
    } catch (error) {
        console.error('Failed to fetch homepage data:', error);
        // Continue with empty arrays to show fallback UI
    }

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 gradient-bg opacity-5" />
                <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:py-32 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mb-4 sm:mb-6 inline-flex items-center rounded-full border px-3 sm:px-4 py-1.5 text-xs sm:text-sm">
                            <Sparkles className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                            <span className="text-muted-foreground">New arrivals are here</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                            Discover{" "}
                            <span className="gradient-text">Premium</span>
                            <br className="hidden sm:block" />
                            <span className="sm:hidden"> </span>
                            Products
                        </h1>
                        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto px-2 sm:px-0">
                            Elevate your lifestyle with our carefully curated collection of
                            premium products. Quality craftsmanship meets modern design.
                        </p>
                        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            <Link href="/products" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto h-11 sm:h-12 rounded-xl px-6 sm:px-8 gradient-bg border-0 text-white hover:opacity-90 text-sm sm:text-base"
                                >
                                    Shop Now
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/categories" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto h-11 sm:h-12 rounded-xl px-6 sm:px-8 text-sm sm:text-base"
                                >
                                    Browse Categories
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="border-y bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="flex items-start gap-2 sm:gap-3">
                                <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-xs sm:text-sm font-medium">{feature.title}</h3>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-8">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold">Shop by Category</h2>
                            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                                Browse our curated collections
                            </p>
                        </div>
                        <Link href="/categories" className="hidden sm:block">
                            <Button variant="ghost" className="text-primary text-sm">
                                View All <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {categories.slice(0, 4).map((category) => (
                            <Link
                                key={category.id}
                                href={`/categories/${category.slug}`}
                                className="group relative overflow-hidden rounded-xl border bg-card hover-lift shadow-premium"
                            >
                                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                                    {category.image ? (
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 gradient-bg opacity-10" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                                        <h3 className="text-xs sm:text-sm font-semibold text-white">
                                            {category.name}
                                        </h3>
                                        <p className="text-[10px] sm:text-xs text-white/70 mt-0.5">
                                            {category._count.products} products
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Link href="/categories" className="sm:hidden mt-4 block">
                        <Button variant="ghost" className="w-full text-primary text-sm">
                            View All Categories <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                    </Link>
                </section>
            )}

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-8">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold">Featured Products</h2>
                            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                                Handpicked favorites for you
                            </p>
                        </div>
                        <Link href="/products?featured=true" className="hidden sm:block">
                            <Button variant="ghost" className="text-primary text-sm">
                                View All <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:gap-6 lg:grid-cols-4">
                        {featuredProducts.map((product) => (
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
                    <Link href="/products?featured=true" className="sm:hidden mt-4 block">
                        <Button variant="ghost" className="w-full text-primary text-sm">
                            View All Products <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                    </Link>
                </section>
            )}

            {/* CTA */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-8">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl gradient-bg p-6 sm:p-12 lg:p-16 text-center">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTJ2LTZoMnptMC0xMnY2aC0ydi02aDJ6bTAtMTJ2NmgtMlY0aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                            Ready to elevate your style?
                        </h2>
                        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white/80 max-w-xl mx-auto">
                            Join thousands of satisfied customers who trust Velora for their
                            premium shopping needs.
                        </p>
                        <Link href="/products" className="inline-block">
                            <Button
                                size="lg"
                                className="mt-6 sm:mt-8 h-11 sm:h-12 rounded-xl px-6 sm:px-8 bg-white text-primary hover:bg-white/90 text-sm sm:text-base font-semibold"
                            >
                                Start Shopping
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

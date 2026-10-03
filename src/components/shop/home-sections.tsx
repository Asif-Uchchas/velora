import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, Truck } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { categoryIcon } from "@/components/shop/category-icon";
import { formatPrice } from "@/lib/formatters";

type HomeProduct = {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    stock: number;
    isFeatured: boolean;
    ratingAvg: number;
    ratingCount: number;
    category: { name: string };
};

/** Compact editorial banner built from the store's own featured products. */
export function HeroBanner({ products }: { products: HomeProduct[] }) {
    const [main, second, third] = products;

    return (
        <section className="relative overflow-hidden rounded-3xl border bg-primary/[0.06] dark:bg-primary/[0.08]">
            <div className="grid items-center gap-5 p-5 sm:gap-6 sm:p-10 md:grid-cols-[1.05fr_1fr] md:gap-10 lg:p-12">
                <div className="flex flex-col items-start gap-3 sm:gap-4">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Velora · Bangladesh</p>
                    <h1 className="font-display text-[28px] font-medium leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-5xl">
                        Modern essentials for a better you
                    </h1>
                    <p className="max-w-md text-sm text-muted-foreground sm:text-base">
                        Quality products at fair prices, delivered to your door. Pay cash when it arrives.
                    </p>
                    <div className="mt-1 flex flex-wrap gap-3 sm:mt-2">
                        <Link
                            href="#all-products"
                            className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                        >
                            Shop now <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/?sale=1&sort=discount#all-products"
                            className="inline-flex h-11 items-center rounded-xl border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted"
                        >
                            Today&apos;s deals
                        </Link>
                    </div>
                </div>

                {main && (
                    <div className="grid h-40 grid-cols-[1.4fr_1fr] gap-3 sm:h-72 lg:h-80">
                        <Link
                            href={`/products/${main.slug}`}
                            className="group relative overflow-hidden rounded-2xl bg-muted"
                        >
                            <Image
                                src={main.images[0] || "/placeholder.svg"}
                                alt={main.name}
                                fill
                                priority
                                sizes="(max-width: 768px) 55vw, 30vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            />
                            <span className="absolute bottom-3 left-3 rounded-lg bg-background/90 px-2.5 py-1.5 text-xs shadow-sm backdrop-blur">
                                <span className="block max-w-[11rem] truncate font-medium">{main.name}</span>
                                <span className="text-muted-foreground">{formatPrice(main.price)}</span>
                            </span>
                        </Link>
                        <div className="grid grid-rows-2 gap-3">
                            {[second, third].filter(Boolean).map((p) => (
                                <Link
                                    key={p!.id}
                                    href={`/products/${p!.slug}`}
                                    className="group relative overflow-hidden rounded-2xl bg-muted"
                                >
                                    <Image
                                        src={p!.images[0] || "/placeholder.svg"}
                                        alt={p!.name}
                                        fill
                                        sizes="(max-width: 768px) 40vw, 20vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export function TrustStrip({ feeInside, feeOutside }: { feeInside: number; feeOutside: number }) {
    const items = [
        { icon: Truck, title: "Cash on delivery", text: "Pay when your order arrives", tone: "text-foreground" },
        { icon: MessageCircle, title: "Order on WhatsApp", text: "Confirmed by a real person", tone: "text-green-700 dark:text-green-400" },
        {
            icon: MapPin,
            title: "All 64 districts",
            text: `${formatPrice(feeInside)} in Dhaka · ${formatPrice(feeOutside)} outside`,
            tone: "text-foreground",
        },
    ];

    return (
        <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border bg-border">
            {items.map((item) => (
                <li
                    key={item.title}
                    className="flex flex-col items-center gap-1.5 bg-card px-2 py-3 text-center sm:flex-row sm:gap-3 sm:px-5 sm:py-4 sm:text-left"
                >
                    <item.icon className={`h-5 w-5 shrink-0 ${item.tone}`} aria-hidden="true" />
                    <div className="min-w-0">
                        <p className="text-xs font-medium leading-tight sm:text-sm">{item.title}</p>
                        <p className="hidden truncate text-xs text-muted-foreground sm:block">{item.text}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export function CategoryRow({
    categories,
}: {
    categories: Array<{ id: string; name: string; slug: string; _count: { products: number } }>;
}) {
    return (
        <section aria-labelledby="shop-by-category">
            <h2 id="shop-by-category" className="sr-only">
                Shop by category
            </h2>
            <ul className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
                {categories.map((c) => {
                    const Icon = categoryIcon(c.slug);
                    return (
                        <li key={c.id} className="shrink-0">
                            <Link
                                href={`/?category=${c.slug}#all-products`}
                                className="group flex w-24 flex-col items-center gap-2 rounded-2xl p-2 text-center sm:w-auto sm:border sm:bg-card sm:px-3 sm:py-5 sm:hover:border-primary/40"
                            >
                                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-card transition-colors group-hover:border-primary group-hover:text-primary sm:bg-muted">
                                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-xs font-medium leading-tight sm:text-sm">{c.name}</span>
                                    <span className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                                        {c._count.products} item{c._count.products === 1 ? "" : "s"}
                                    </span>
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export function FeaturedRow({ products }: { products: HomeProduct[] }) {
    if (products.length === 0) return null;
    return (
        <section aria-labelledby="featured-heading" className="space-y-4">
            <div className="flex items-end justify-between gap-4">
                <h2 id="featured-heading" className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
                    Featured products
                </h2>
                <Link href="/?featured=1#all-products" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    View all <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:grid-cols-6">
                {products.map((p, i) => (
                    <li key={p.id} className="w-[46%] shrink-0 snap-start sm:w-auto">
                        <ProductCard
                            id={p.id}
                            name={p.name}
                            slug={p.slug}
                            price={p.price}
                            comparePrice={p.comparePrice}
                            images={p.images}
                            stock={p.stock}
                            category={p.category.name}
                            ratingAvg={p.ratingAvg}
                            ratingCount={p.ratingCount}
                            priority={i < 2}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}

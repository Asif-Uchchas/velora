import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getProducts } from "@/actions/product";
import { ProductCard } from "@/components/shared/product-card";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductImageGallery } from "./product-image-gallery";
import { Star, Truck, Shield, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Product Not Found" };
    return {
        title: product.name,
        description: product.description.substring(0, 160),
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) notFound();

    const avgRating =
        product.reviews.length > 0
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length
            : 0;

    const discount = product.comparePrice
        ? Math.round(
            ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
        : 0;

    // Related products
    const { products: relatedProducts } = await getProducts({
        categoryId: product.categoryId,
        limit: 4,
    });
    const related = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);

    return (
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8 lg:px-8 animate-fade-in">
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16">
                {/* Images */}
                <ProductImageGallery 
                    images={product.images}
                    productName={product.name}
                    discount={discount}
                />

                {/* Product Info */}
                <div className="flex flex-col">
                    <div>
                        <p className="text-xs sm:text-sm text-primary font-medium mb-2">
                            {product.category.name}
                        </p>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{product.name}</h1>

                        {/* Rating */}
                        {product.reviews.length > 0 && (
                            <div className="mt-2 sm:mt-3 flex items-center gap-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${star <= avgRating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-muted"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs sm:text-sm text-muted-foreground">
                                    ({product.reviews.length} reviews)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="mt-3 sm:mt-4 flex items-baseline gap-2 sm:gap-3">
                            <span className="text-2xl sm:text-3xl font-bold">
                                {formatPrice(product.price)}
                            </span>
                            {product.comparePrice && (
                                <span className="text-base sm:text-lg text-muted-foreground line-through">
                                    {formatPrice(product.comparePrice)}
                                </span>
                            )}
                        </div>

                        {/* Stock */}
                        <div className="mt-2 sm:mt-3">
                            {product.stock > 0 ? (
                                <Badge
                                    variant="secondary"
                                    className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm"
                                >
                                    In Stock ({product.stock} available)
                                </Badge>
                            ) : (
                                <Badge variant="destructive" className="text-xs sm:text-sm">Out of Stock</Badge>
                            )}
                        </div>
                    </div>

                    <Separator className="my-4 sm:my-6" />

                    {/* Description */}
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                            {product.description}
                        </p>
                    </div>

                    <Separator className="my-4 sm:my-6" />

                    {/* Add to Cart */}
                    <AddToCartButton product={product} />

                    {/* Trust badges */}
                    <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4">
                        {[
                            { icon: Truck, label: "Free Shipping" },
                            { icon: Shield, label: "Secure Payment" },
                            { icon: RotateCcw, label: "Easy Returns" },
                        ].map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="flex flex-col items-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-muted/50 p-2 sm:p-3 text-center"
                            >
                                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                                <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            {product.reviews.length > 0 && (
                <section className="mt-12 sm:mt-16">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Customer Reviews</h2>
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {product.reviews.map((review) => (
                            <div
                                key={review.id}
                                className="rounded-xl border bg-card p-4 sm:p-6 shadow-premium"
                            >
                                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full gradient-bg text-white text-xs sm:text-sm font-bold">
                                        {review.user.name?.[0] || "?"}
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium">{review.user.name}</p>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-3 w-3 ${star <= review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-muted"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                        {review.comment}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Related Products */}
            {related.length > 0 && (
                <section className="mt-12 sm:mt-16">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Related Products</h2>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:gap-6 lg:grid-cols-4">
                        {related.map((product) => (
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
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

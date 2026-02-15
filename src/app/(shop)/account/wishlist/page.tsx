import { Heart } from "lucide-react";
import { getWishlist } from "@/actions/wishlist";
import { ProductCard } from "@/components/shared/product-card";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Wishlist" };

export default async function WishlistPage() {
    const wishlist = await getWishlist();

    if (!wishlist || wishlist.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-4">
                    <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Your wishlist is empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Save products you love and come back to them later.
                </p>
                <Link
                    href="/products"
                    className="mt-4 text-sm text-primary font-medium hover:underline"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">
                My Wishlist ({wishlist.items.length})
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {wishlist.items.map((item) => (
                    <ProductCard
                        key={item.id}
                        id={item.product.id}
                        name={item.product.name}
                        slug={item.product.slug}
                        price={item.product.price}
                        comparePrice={item.product.comparePrice}
                        images={item.product.images}
                        stock={item.product.stock}
                        category={item.product.category?.name}
                    />
                ))}
            </div>
        </div>
    );
}

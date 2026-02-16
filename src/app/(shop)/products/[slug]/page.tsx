import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getProducts } from "@/actions/product";
import { ProductCard } from "@/components/shared/product-card";
import { ProductImageGallery } from "./product-image-gallery";
import { formatPrice } from "@/lib/formatters";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ProductQuickActions,
  TrustBadgesGrid,
  ProductHighlights,
  ProductStats,
  AnimatedPrice,
  RatingDisplay,
  StockStatus,
  GuaranteeSection,
} from "@/components/shared/product-detail-components";
import { ImageZoom } from "@/components/shared/image-zoom";

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
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
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

  // Mock highlights - in real app, these would come from database
  const highlights = [
    "Premium quality materials",
    "Ergonomic design for comfort",
    "Sustainable manufacturing",
    "2-year warranty included",
  ];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ArrowRight className="w-4 h-4" />
        <Link href="/products" className="hover:text-foreground transition-colors">
          Products
        </Link>
        <ArrowRight className="w-4 h-4" />
        <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16">
        {/* Images with Zoom */}
        <ProductImageGallery
          images={product.images}
          productName={product.name}
          discount={discount}
        />

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Category & Badges */}
          <div className="flex items-center gap-2 mb-3">
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-sm text-primary font-medium hover:underline"
            >
              {product.category.name}
            </Link>
            {product.isFeatured && (
              <Badge className="bg-primary text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          {/* Product Name */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          {product.reviews.length > 0 && (
            <div className="mb-4">
              <RatingDisplay rating={avgRating} reviewCount={product.reviews.length} />
            </div>
          )}

          {/* Price */}
          <div className="mb-4">
            <AnimatedPrice price={product.price} comparePrice={product.comparePrice} />
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <StockStatus stock={product.stock} />
          </div>

          <Separator className="my-4 sm:my-6" />

          {/* Description */}
          <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {product.description}
            </p>
          </div>

          {/* Product Highlights */}
          <div className="mb-6">
            <ProductHighlights highlights={highlights} />
          </div>

          <Separator className="my-4 sm:my-6" />

          {/* Quick Actions */}
          <ProductQuickActions
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              stock: product.stock,
              images: product.images,
            }}
          />

          {/* Product Stats */}
          <div className="mt-6">
            <ProductStats />
          </div>

          {/* Trust Badges */}
          <div className="mt-6">
            <TrustBadgesGrid />
          </div>

          {/* Guarantee Section */}
          <div className="mt-6">
            <GuaranteeSection />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Customer Reviews</h2>
            <Badge variant="secondary" className="text-sm">
              {product.reviews.length} Reviews
            </Badge>
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {product.reviews.slice(0, 6).map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">You May Also Like</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Similar products in {product.category.name}
              </p>
            </div>
            <Link href={`/categories/${product.category.slug}`} className="hidden sm:block">
              <Button variant="ghost" className="text-primary">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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

// Review Card Component
function ReviewCard({
  review,
  index,
}: {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    user: { name: string | null };
  };
  index: number;
}) {
  return (
    <div
      className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-bg text-white text-sm font-bold">
          {review.user.name?.[0] || "?"}
        </div>
        <div>
          <p className="text-sm font-medium">{review.user.name || "Anonymous"}</p>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}

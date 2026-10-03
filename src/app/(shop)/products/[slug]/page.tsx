import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getProductBySlug, getProducts } from "@/actions/product";
import { getProductReviews } from "@/actions/review";
import { ProductCard } from "@/components/shared/product-card";
import { RatingDisplay } from "@/components/shared/product-detail-components";
import { ReviewSection } from "@/components/shared/review-section";
import { WhatsAppChatButton } from "@/components/shared/whatsapp-chat";
import { getStoreSettings } from "@/lib/settings";
import { ProductImageGallery } from "./product-image-gallery";
import { PurchasePanel } from "./purchase-panel";

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

  // The WhatsApp number comes from Admin → Store settings (defaults to +8801999398675)
  const [reviews, settings] = await Promise.all([
    getProductReviews(product.id),
    getStoreSettings(),
  ]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
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
    <div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <Link href={`/?category=${product.category.slug}`} className="hover:text-foreground">
            {product.category.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="max-w-[14rem] truncate text-foreground" aria-current="page">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <ProductImageGallery images={product.images} productName={product.name} discount={discount} />

          <div className="flex flex-col gap-5">
            <div className="space-y-3">
              <Link
                href={`/?category=${product.category.slug}`}
                className="text-xs font-medium uppercase tracking-[0.18em] text-primary hover:underline"
              >
                {product.category.name}
              </Link>
              <h1 className="font-display text-3xl font-medium leading-tight tracking-tight text-balance sm:text-4xl">
                {product.name}
              </h1>
              {reviews.length > 0 && <RatingDisplay rating={avgRating} reviewCount={reviews.length} />}
            </div>

            <PurchasePanel
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                comparePrice: product.comparePrice,
                stock: product.stock,
                images: product.images,
              }}
              fees={{ inside: settings.deliveryFeeInside, outside: settings.deliveryFeeOutside }}
            />

            <section aria-labelledby="about-heading" className="border-t pt-5">
              <h2 id="about-heading" className="mb-2 text-sm font-semibold">About this product</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
                {product.description}
              </p>
            </section>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection
          productId={product.id}
          initialReviews={reviews}
          averageRating={avgRating}
          totalReviews={reviews.length}
        />

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">You may also like</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Similar products in {product.category.name}
                </p>
              </div>
              <Link
                href={`/?category=${product.category.slug}`}
                className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
              >
                View all <ArrowRight className="h-4 w-4" />
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
                  ratingAvg={product.ratingAvg}
                  ratingCount={product.ratingCount}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* WhatsApp Chat Button */}
      <WhatsAppChatButton
        productName={product.name}
        productPrice={product.price}
        productImage={product.images[0]}
        productSlug={product.slug}
        phoneNumber={settings.whatsappNumber}
        businessName="Velora Store"
      />
    </div>
  );
}

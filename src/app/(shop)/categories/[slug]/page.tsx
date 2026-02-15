import { redirect } from "next/navigation";
import { getCategoryBySlug } from "@/actions/category";
import { getProducts } from "@/actions/product";
import { ProductCard } from "@/components/shared/product-card";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);
    if (!category) return { title: "Category Not Found" };
    return { title: category.name, description: category.description || `Browse ${category.name} products.` };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);
    if (!category) redirect("/categories");

    const { products } = await getProducts({ categoryId: category.id, limit: 24 });

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{category.name}</h1>
                {category.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">{products.length} products</p>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-4">
                        <span className="text-3xl">📦</span>
                    </div>
                    <h3 className="text-lg font-semibold">No products in this category</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Check back later for new products.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

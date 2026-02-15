import { getAllProducts } from "@/actions/product";
import { getCategories } from "@/actions/category";
import { ProductsClient } from "./products-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products — Admin" };

export default async function AdminProductsPage() {
    const [products, categories] = await Promise.all([
        getAllProducts(),
        getCategories(),
    ]);

    return (
        <ProductsClient
            products={products.map((p) => ({
                ...p,
                category: p.category || { name: "?" },
            }))}
            categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        />
    );
}

"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { productSchema } from "@/lib/validators";
import { computeDiscountPercent } from "@/lib/formatters";
import { revalidatePath } from "next/cache";

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export type ProductSort = "popular" | "newest" | "oldest" | "price-asc" | "price-desc" | "rating" | "discount";

export interface ProductQuery {
    categoryIds?: string[];
    /** @deprecated use categoryIds */
    categoryId?: string;
    search?: string;
    sort?: string;
    featured?: boolean;
    inStock?: boolean;
    onSale?: boolean;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    page?: number;
    limit?: number;
}

const SORTS: Record<ProductSort, Prisma.ProductOrderByWithRelationInput[]> = {
    popular: [{ soldCount: "desc" }, { ratingCount: "desc" }, { createdAt: "desc" }],
    newest: [{ createdAt: "desc" }],
    oldest: [{ createdAt: "asc" }],
    "price-asc": [{ price: "asc" }],
    "price-desc": [{ price: "desc" }],
    rating: [{ ratingAvg: "desc" }, { ratingCount: "desc" }],
    discount: [{ discountPercent: "desc" }, { createdAt: "desc" }],
};

export async function getProducts(params?: ProductQuery) {
    const {
        categoryIds,
        categoryId,
        search,
        sort,
        featured,
        inStock,
        onSale,
        minPrice,
        maxPrice,
        minRating,
    } = params || {};
    const limit = Math.min(Math.max(Math.trunc(params?.limit ?? 12), 1), 48);
    const page = Math.min(Math.max(Math.trunc(params?.page ?? 1), 1), 1000);

    const where: Prisma.ProductWhereInput = { isArchived: false };
    const cats = categoryIds?.length ? categoryIds : categoryId ? [categoryId] : [];
    if (cats.length) where.categoryId = { in: cats.slice(0, 20) };
    if (featured) where.isFeatured = true;
    if (inStock) where.stock = { gt: 0 };
    if (onSale) where.discountPercent = { gt: 0 };
    if (minRating && minRating >= 1 && minRating <= 5) where.ratingAvg = { gte: minRating };
    if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
        where.price = {
            ...(Number.isFinite(minPrice) && minPrice! > 0 ? { gte: minPrice } : {}),
            ...(Number.isFinite(maxPrice) && maxPrice! > 0 ? { lte: maxPrice } : {}),
        };
    }
    const q = search?.trim().slice(0, 100);
    if (q) {
        where.OR = [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { category: { name: { contains: q, mode: "insensitive" } } },
        ];
    }

    const orderBy = SORTS[(sort as ProductSort) in SORTS ? (sort as ProductSort) : "newest"];

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
            include: { category: { select: { name: true, slug: true } } },
        }),
        prisma.product.count({ where }),
    ]);

    return {
        products: products.map((p) => ({
            ...p,
            price: Number(p.price),
            comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        })),
        total,
        pages: Math.ceil(total / limit),
    };
}

/** Lowest / highest active product price, for the price filter's bounds. */
export async function getPriceBounds() {
    const agg = await prisma.product.aggregate({
        where: { isArchived: false },
        _min: { price: true },
        _max: { price: true },
    });
    return {
        min: Math.floor(Number(agg._min.price ?? 0)),
        max: Math.ceil(Number(agg._max.price ?? 0)),
    };
}

export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            reviews: {
                include: { user: { select: { name: true, image: true } } },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!product || product.isArchived) return null;

    return {
        ...product,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    };
}

function parseProductForm(formData: FormData) {
    let images: unknown = [];
    try {
        images = JSON.parse((formData.get("images") as string) || "[]");
    } catch {
        images = null;
    }

    return productSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        comparePrice: formData.get("comparePrice") || null,
        images,
        stock: formData.get("stock"),
        categoryId: formData.get("categoryId"),
        isFeatured: formData.get("isFeatured") === "true",
        isArchived: formData.get("isArchived") === "true",
    });
}

export async function createProduct(formData: FormData) {
    if (!(await requireAdmin())) return { error: "Unauthorized" };

    const parsed = parseProductForm(formData);
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const slug = generateSlug(parsed.data.name) || "product";

    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    await prisma.product.create({
        data: {
            ...parsed.data,
            slug: finalSlug,
            discountPercent: computeDiscountPercent(parsed.data.price, parsed.data.comparePrice),
        },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
    if (!(await requireAdmin())) return { error: "Unauthorized" };

    const parsed = parseProductForm(formData);
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    await prisma.product.update({
        where: { id },
        data: {
            ...parsed.data,
            discountPercent: computeDiscountPercent(parsed.data.price, parsed.data.comparePrice),
        },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
}

export async function deleteProduct(id: string) {
    if (!(await requireAdmin())) return { error: "Unauthorized" };

    await prisma.product.update({
        where: { id },
        data: { isArchived: true },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
}

export async function getAllProducts() {
    if (!(await requireAdmin())) return [];

    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: { select: { name: true } } },
    });

    return products.map((p) => ({
        ...p,
        price: Number(p.price),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
    }));
}

/** Current public price/stock for items in a browser cart, so stale local carts get corrected. */
export async function getCartSnapshot(productIds: string[]) {
    if (!Array.isArray(productIds)) return [];
    const ids = productIds.filter((id) => typeof id === "string" && id.length <= 64).slice(0, 50);
    if (ids.length === 0) return [];

    const products = await prisma.product.findMany({
        where: { id: { in: ids }, isArchived: false },
        select: { id: true, name: true, price: true, stock: true, images: true },
    });
    return products.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        stock: p.stock,
        image: p.images[0] ?? "/placeholder.svg",
    }));
}

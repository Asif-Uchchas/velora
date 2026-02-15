"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function getProducts(params?: {
    categoryId?: string;
    search?: string;
    sort?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
}) {
    const { categoryId, search, sort, featured, page = 1, limit = 12 } = params || {};

    const where: Record<string, unknown> = { isArchived: false };
    if (categoryId) where.categoryId = categoryId;
    if (featured) where.isFeatured = true;
    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };

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

    if (!product) return null;

    return {
        ...product,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    };
}

export async function createProduct(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    const parsed = productSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        comparePrice: formData.get("comparePrice") || null,
        images: JSON.parse((formData.get("images") as string) || "[]"),
        stock: formData.get("stock"),
        categoryId: formData.get("categoryId"),
        isFeatured: formData.get("isFeatured") === "true",
        isArchived: formData.get("isArchived") === "true",
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const slug = generateSlug(parsed.data.name);

    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    await prisma.product.create({
        data: {
            ...parsed.data,
            price: parsed.data.price,
            comparePrice: parsed.data.comparePrice,
            slug: finalSlug,
        },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    const parsed = productSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        comparePrice: formData.get("comparePrice") || null,
        images: JSON.parse((formData.get("images") as string) || "[]"),
        stock: formData.get("stock"),
        categoryId: formData.get("categoryId"),
        isFeatured: formData.get("isFeatured") === "true",
        isArchived: formData.get("isArchived") === "true",
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    await prisma.product.update({
        where: { id },
        data: {
            ...parsed.data,
            price: parsed.data.price,
            comparePrice: parsed.data.comparePrice,
        },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
}

export async function deleteProduct(id: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    await prisma.product.update({
        where: { id },
        data: { isArchived: true },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
}

export async function getAllProducts() {
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

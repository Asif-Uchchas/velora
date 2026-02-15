"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { categorySchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function getCategories() {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: { select: { products: true } },
        },
    });
    return categories;
}

export async function getCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
        where: { slug },
    });
}

export async function createCategory(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    const parsed = categorySchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description") || undefined,
        image: formData.get("image") || null,
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const slug = generateSlug(parsed.data.name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) return { error: "Category already exists" };

    await prisma.category.create({
        data: { ...parsed.data, slug },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    const parsed = categorySchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description") || undefined,
        image: formData.get("image") || null,
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    await prisma.category.update({
        where: { id },
        data: parsed.data,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true };
}

export async function deleteCategory(id: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    const productCount = await prisma.product.count({
        where: { categoryId: id },
    });

    if (productCount > 0) {
        return { error: "Cannot delete category with existing products" };
    }

    await prisma.category.delete({ where: { id } });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true };
}

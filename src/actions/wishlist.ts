"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getWishlist() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const wishlist = await prisma.wishlist.findUnique({
        where: { userId: session.user.id },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            category: { select: { name: true } },
                        },
                    },
                },
            },
        },
    });

    if (!wishlist) return null;

    return {
        ...wishlist,
        items: wishlist.items.map((item) => ({
            ...item,
            product: {
                ...item.product,
                price: Number(item.product.price),
                comparePrice: item.product.comparePrice
                    ? Number(item.product.comparePrice)
                    : null,
            },
        })),
    };
}

export async function toggleWishlist(productId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Please sign in" };

    let wishlist = await prisma.wishlist.findUnique({
        where: { userId: session.user.id },
    });

    if (!wishlist) {
        wishlist = await prisma.wishlist.create({
            data: { userId: session.user.id },
        });
    }

    const existing = await prisma.wishlistItem.findUnique({
        where: {
            wishlistId_productId: { wishlistId: wishlist.id, productId },
        },
    });

    if (existing) {
        await prisma.wishlistItem.delete({ where: { id: existing.id } });
        revalidatePath("/account/wishlist");
        return { added: false };
    } else {
        await prisma.wishlistItem.create({
            data: { wishlistId: wishlist.id, productId },
        });
        revalidatePath("/account/wishlist");
        return { added: true };
    }
}

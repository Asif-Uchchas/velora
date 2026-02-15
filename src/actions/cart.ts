"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getCart() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            price: true,
                            images: true,
                            stock: true,
                        },
                    },
                },
            },
        },
    });

    if (!cart) return null;

    return {
        ...cart,
        items: cart.items.map((item) => ({
            ...item,
            product: {
                ...item.product,
                price: Number(item.product.price),
            },
        })),
    };
}

export async function addToCart(productId: string, quantity: number = 1) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Please sign in to add items to cart" };

    let cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId: session.user.id },
        });
    }

    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product || product.stock < quantity) {
        return { error: "Product not available" };
    }

    const existingItem = await prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existingItem) {
        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
        });
    } else {
        await prisma.cartItem.create({
            data: { cartId: cart.id, productId, quantity },
        });
    }

    revalidatePath("/cart");
    return { success: true };
}

export async function updateCartItem(cartItemId: string, quantity: number) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    if (quantity <= 0) {
        await prisma.cartItem.delete({ where: { id: cartItemId } });
    } else {
        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
        });
    }

    revalidatePath("/cart");
    return { success: true };
}

export async function removeFromCart(cartItemId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await prisma.cartItem.delete({ where: { id: cartItemId } });

    revalidatePath("/cart");
    return { success: true };
}

export async function clearCart() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
    });

    if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    revalidatePath("/cart");
    return { success: true };
}

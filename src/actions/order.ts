"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";

export async function createCheckoutSession() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Please sign in" };

    const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        include: {
            items: { include: { product: true } },
        },
    });

    if (!cart || cart.items.length === 0) {
        return { error: "Cart is empty" };
    }

    const lineItems = cart.items.map((item) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: item.product.name,
                images: item.product.images.slice(0, 1),
            },
            unit_amount: Math.round(Number(item.product.price) * 100),
        },
        quantity: item.quantity,
    }));

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        metadata: {
            userId: session.user.id,
            cartId: cart.id,
        },
    });

    return { url: checkoutSession.url };
}

export async function getOrders(userId?: string) {
    const session = await auth();
    if (!session?.user?.id) return [];

    const where = userId
        ? { userId }
        : session.user.role === "ADMIN"
            ? {}
            : { userId: session.user.id };

    const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: {
                    product: {
                        select: { name: true, images: true, slug: true },
                    },
                },
            },
            user: { select: { name: true, email: true } },
        },
    });

    return orders.map((order) => ({
        ...order,
        total: Number(order.total),
        items: order.items.map((item) => ({
            ...item,
            price: Number(item.price),
        })),
    }));
}

export async function getOrderById(id: string) {
    const session = await auth();
    if (!session?.user?.id) return null;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: {
                        select: { name: true, images: true, slug: true },
                    },
                },
            },
            user: { select: { name: true, email: true } },
        },
    });

    if (!order) return null;
    if (session.user.role !== "ADMIN" && order.userId !== session.user.id) return null;

    return {
        ...order,
        total: Number(order.total),
        items: order.items.map((item) => ({
            ...item,
            price: Number(item.price),
        })),
    };
}

export async function updateOrderStatus(
    orderId: string,
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });

    revalidatePath("/admin/orders");
    return { success: true };
}

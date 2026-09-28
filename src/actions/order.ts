"use server";

import { randomInt } from "crypto";
import { Prisma, type OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { getStoreSettings, deliveryFeeFor, orderEmailFor } from "@/lib/settings";
import { zoneForDistrict } from "@/lib/districts";
import { placeOrderSchema, type PlaceOrderInput } from "@/lib/validators";
import { buildOrderText, mailtoLink, whatsappLink, type OrderSummary } from "@/lib/order-message";
import { isMailConfigured, sendOrderEmail } from "@/lib/mailer";

type PlaceOrderResult =
    | { error: string; needsPhone?: boolean }
    // emailSent: true/false when the server sent (or failed to send) the email itself;
    // null when there is no SMTP account and the customer sends it from their own mail app.
    | { orderNumber: string; emailSent?: boolean | null };

const ORDER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

function newOrderNumber() {
    const d = new Date();
    const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    let suffix = "";
    for (let i = 0; i < 5; i++) suffix += ORDER_ALPHABET[randomInt(ORDER_ALPHABET.length)];
    return `VL-${date}-${suffix}`;
}

function appUrl() {
    return (
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.AUTH_URL ||
        process.env.NEXTAUTH_URL ||
        "http://localhost:3000"
    ).replace(/\/$/, "");
}

function toSummary(order: {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    address: string;
    district: string;
    deliveryZone: "INSIDE_DHAKA" | "OUTSIDE_DHAKA";
    note: string | null;
    subtotal: Prisma.Decimal;
    deliveryFee: Prisma.Decimal;
    total: Prisma.Decimal;
    items: Array<{ name: string; quantity: number; price: Prisma.Decimal }>;
}): OrderSummary {
    return {
        ...order,
        subtotal: Number(order.subtotal),
        deliveryFee: Number(order.deliveryFee),
        total: Number(order.total),
        items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: Number(i.price) })),
    };
}

/**
 * Creates a PENDING order from the customer's cart. Prices, stock and the delivery
 * fee are all taken from the database; the client only supplies ids and quantities.
 * The admin later confirms it from /admin/orders after talking to the customer.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
    const sessionUser = await requireUser();
    if (!sessionUser) return { error: "Please sign in to place an order" };

    const parsed = placeOrderSchema.safeParse(input);
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    const data = parsed.data;

    const user = await prisma.user.findUnique({
        where: { id: sessionUser.id },
        select: { id: true, email: true, phone: true },
    });
    if (!user) return { error: "Please sign in to place an order" };
    if (!user.phone) {
        return { error: "Add your phone number in account settings first", needsPhone: true };
    }

    if (!(await rateLimit(`order:${user.id}`, 5, 60 * 60))) {
        return { error: "Too many orders in a short time. Please contact us on WhatsApp." };
    }

    // Merge duplicate lines so a crafted payload can't bypass per-line limits
    const quantities = new Map<string, number>();
    for (const item of data.items) {
        quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
    }

    const products = await prisma.product.findMany({
        where: { id: { in: [...quantities.keys()] }, isArchived: false },
        select: { id: true, name: true, price: true, stock: true },
    });
    if (products.length !== quantities.size) {
        return { error: "Some items in your cart are no longer available. Please review your cart." };
    }
    for (const product of products) {
        const qty = quantities.get(product.id)!;
        if (qty > 20) return { error: `You can order at most 20 of ${product.name}` };
        if (product.stock < qty) {
            return { error: `Only ${product.stock} of ${product.name} left in stock` };
        }
    }

    const settings = await getStoreSettings();
    const orderEmail = orderEmailFor(settings);
    if (data.channel === "EMAIL" && !orderEmail) {
        return { error: "Ordering by email isn't available right now. Please order on WhatsApp." };
    }
    const zone = zoneForDistrict(data.district);
    const deliveryFee = deliveryFeeFor(settings, zone);
    const subtotal = products.reduce(
        (sum, p) => sum.add(p.price.mul(quantities.get(p.id)!)),
        new Prisma.Decimal(0)
    );

    let order;
    for (let attempt = 0; ; attempt++) {
        try {
            order = await prisma.order.create({
                data: {
                    orderNumber: newOrderNumber(),
                    userId: user.id,
                    status: "PENDING",
                    channel: data.channel,
                    paymentMethod: "COD",
                    subtotal,
                    deliveryFee,
                    total: subtotal.add(deliveryFee),
                    customerName: data.customerName,
                    customerPhone: user.phone,
                    customerEmail: user.email,
                    address: data.address,
                    district: data.district,
                    deliveryZone: zone,
                    note: data.note || null,
                    items: {
                        create: products.map((p) => ({
                            productId: p.id,
                            name: p.name,
                            quantity: quantities.get(p.id)!,
                            price: p.price,
                        })),
                    },
                },
                include: { items: true },
            });
            break;
        } catch (error) {
            const collision =
                error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
            if (!collision || attempt >= 3) throw error;
        }
    }

    revalidatePath("/admin/orders");
    revalidatePath("/account/orders");

    if (data.channel === "EMAIL") {
        if (!isMailConfigured()) return { orderNumber: order.orderNumber, emailSent: null };
        const emailSent = await sendOrderEmail(
            toSummary(order),
            orderEmail!,
            `${appUrl()}/admin/orders?q=${order.orderNumber}`
        );
        return { orderNumber: order.orderNumber, emailSent };
    }

    return { orderNumber: order.orderNumber };
}

/** Order for the confirmation page, only if it belongs to the signed-in user. */
export async function getMyOrder(orderNumber: string) {
    const user = await requireUser();
    if (!user) return null;

    const order = await prisma.order.findFirst({
        where: { orderNumber, userId: user.id },
        include: { items: true },
    });
    if (!order) return null;

    const settings = await getStoreSettings();
    const summary = toSummary(order);
    const pending = order.status === "PENDING";
    const orderEmail = orderEmailFor(settings);
    return {
        ...summary,
        status: order.status,
        channel: order.channel,
        createdAt: order.createdAt,
        whatsappUrl: pending ? whatsappLink(settings.whatsappNumber, buildOrderText(summary)) : null,
        // Without an SMTP account, email orders are sent from the customer's own mail app
        orderEmail: order.channel === "EMAIL" && !isMailConfigured() ? orderEmail : null,
        mailtoUrl:
            pending && order.channel === "EMAIL" && !isMailConfigured() && orderEmail
                ? mailtoLink(orderEmail, `Order ${summary.orderNumber}`, buildOrderText(summary))
                : null,
    };
}

/** The signed-in customer's own orders. */
export async function getMyOrders() {
    const user = await requireUser();
    if (!user) return [];

    const orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
            items: {
                include: { product: { select: { name: true, images: true, slug: true } } },
            },
        },
    });

    return orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        channel: order.channel,
        createdAt: order.createdAt,
        total: Number(order.total),
        items: order.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: Number(item.price),
            product: item.product,
        })),
    }));
}

export async function getAdminOrders(params?: { status?: string; q?: string }) {
    const admin = await requireAdmin();
    if (!admin) return { orders: [], counts: {} as Record<string, number> };

    const where: Prisma.OrderWhereInput = {};
    const statuses: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (params?.status && statuses.includes(params.status as OrderStatus)) {
        where.status = params.status as OrderStatus;
    }
    const q = params?.q?.trim().slice(0, 80);
    if (q) {
        const digits = q.replace(/\D/g, "");
        where.OR = [
            { orderNumber: { contains: q, mode: "insensitive" } },
            { customerName: { contains: q, mode: "insensitive" } },
            { customerEmail: { contains: q, mode: "insensitive" } },
            ...(digits.length >= 4 ? [{ customerPhone: { contains: digits.slice(-10) } }] : []),
        ];
    }

    const [orders, grouped] = await Promise.all([
        prisma.order.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 200,
            include: {
                items: { select: { id: true, name: true, quantity: true, price: true, product: { select: { name: true } } } },
                user: { select: { name: true, email: true } },
            },
        }),
        prisma.order.groupBy({ by: ["status"], _count: true }),
    ]);

    return {
        orders: orders.map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            status: o.status,
            channel: o.channel,
            paymentMethod: o.paymentMethod,
            paymentStatus: o.paymentStatus,
            subtotal: Number(o.subtotal),
            deliveryFee: Number(o.deliveryFee),
            total: Number(o.total),
            customerName: o.customerName,
            customerPhone: o.customerPhone,
            customerEmail: o.customerEmail,
            address: o.address,
            district: o.district,
            deliveryZone: o.deliveryZone,
            note: o.note,
            createdAt: o.createdAt,
            confirmedAt: o.confirmedAt,
            user: o.user,
            items: o.items.map((i) => ({
                id: i.id,
                name: i.name || i.product.name,
                quantity: i.quantity,
                price: Number(i.price),
            })),
        })),
        counts: Object.fromEntries(grouped.map((g) => [g.status, g._count])) as Record<string, number>,
    };
}

// Allowed admin transitions. Stock is reserved on CONFIRMED and released on CANCELLED.
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING", "SHIPPED", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: [],
    CANCELLED: [],
};

const STOCK_HELD: OrderStatus[] = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    const admin = await requireAdmin();
    if (!admin) return { error: "Unauthorized" };
    if (typeof orderId !== "string" || !Object.hasOwn(TRANSITIONS, status)) return { error: "Invalid request" };

    try {
        await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: { items: true },
            });
            if (!order) throw new Error("Order not found");
            if (!TRANSITIONS[order.status].includes(status)) {
                throw new Error(`Cannot change ${order.status.toLowerCase()} order to ${status.toLowerCase()}`);
            }

            const wasHeld = STOCK_HELD.includes(order.status);
            const willHold = STOCK_HELD.includes(status);

            if (!wasHeld && willHold) {
                for (const item of order.items) {
                    // Conditional decrement: fails instead of going negative
                    const updated = await tx.product.updateMany({
                        where: { id: item.productId, stock: { gte: item.quantity } },
                        data: { stock: { decrement: item.quantity }, soldCount: { increment: item.quantity } },
                    });
                    if (updated.count === 0) {
                        throw new Error(`Not enough stock for ${item.name || "an item"} to confirm this order`);
                    }
                }
            } else if (wasHeld && !willHold) {
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { increment: item.quantity }, soldCount: { decrement: item.quantity } },
                    });
                }
            }

            await tx.order.update({
                where: { id: orderId },
                data: {
                    status,
                    ...(status === "CONFIRMED" ? { confirmedAt: new Date(), confirmedById: admin.id } : {}),
                    ...(status === "CANCELLED" ? { cancelledAt: new Date() } : {}),
                    ...(status === "DELIVERED" && order.paymentMethod === "COD" ? { paymentStatus: "PAID" } : {}),
                },
            });
        });
    } catch (error) {
        return { error: error instanceof Error ? error.message : "Could not update order" };
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/account/orders");
    revalidatePath("/");
    return { success: true };
}

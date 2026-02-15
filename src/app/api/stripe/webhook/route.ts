import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: Request) {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const cartId = session.metadata?.cartId;

        if (!userId || !cartId) {
            return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
        }

        const cart = await prisma.cart.findUnique({
            where: { id: cartId },
            include: {
                items: { include: { product: true } },
            },
        });

        if (!cart) {
            return NextResponse.json({ error: "Cart not found" }, { status: 404 });
        }

        // Create order
        const total = cart.items.reduce(
            (sum, item) => sum + Number(item.product.price) * item.quantity,
            0
        );

        await prisma.order.create({
            data: {
                userId,
                total,
                stripePaymentId: session.payment_intent as string,
                status: "PROCESSING",
                items: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: Number(item.product.price),
                    })),
                },
            },
        });

        // Update stock
        for (const item of cart.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }

        // Clear cart
        await prisma.cartItem.deleteMany({ where: { cartId } });
    }

    return NextResponse.json({ received: true });
}

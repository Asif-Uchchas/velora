import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getMyOrders } from "@/actions/order";
import { ORDER_CHANNEL_LABEL, ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from "@/lib/order-status";
import { formatPrice } from "@/lib/formatters";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage() {
    const orders = await getMyOrders();

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No orders yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Start shopping to see your orders here.
                </p>
                <Link
                    href="/"
                    className="mt-4 text-sm text-primary font-medium hover:underline"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Order History</h2>
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="rounded-xl border bg-card p-6 shadow-premium"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div>
                            <p className="text-xs text-muted-foreground">Order · {ORDER_CHANNEL_LABEL[order.channel]}</p>
                            <p className="text-sm font-mono">{order.orderNumber}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Date</p>
                            <p className="text-sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={`${ORDER_STATUS_COLOR[order.status]} border-0`}>
                                {ORDER_STATUS_LABEL[order.status]}
                            </Badge>
                            {order.status === "PENDING" && order.channel === "WHATSAPP" && (
                                <Link
                                    href={`/checkout/success?order=${order.orderNumber}`}
                                    className="text-xs font-medium text-primary hover:underline"
                                >
                                    Send on WhatsApp again
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                            >
                                <Image
                                    src={item.product.images[0] || "/placeholder.svg"}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

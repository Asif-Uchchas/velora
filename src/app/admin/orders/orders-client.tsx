"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/actions/order";
import { formatPrice } from "@/lib/formatters";
import { toast } from "sonner";

interface Order {
    id: string;
    status: string;
    total: number;
    createdAt: Date;
    user: { name: string | null; email: string };
    items: Array<{
        id: string;
        quantity: number;
        price: number;
        product: { name: string };
    }>;
}

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    PROCESSING: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    SHIPPED: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    DELIVERED: "bg-green-500/10 text-green-600 dark:text-green-400",
    CANCELLED: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export function OrdersClient({ orders }: { orders: Order[] }) {
    const router = useRouter();

    async function handleStatusChange(orderId: string, status: string) {
        const result = await updateOrderStatus(
            orderId,
            status as (typeof statuses)[number]
        );
        if (result.error) toast.error(result.error);
        else {
            toast.success("Order status updated");
            router.refresh();
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">Orders</h1>
                <p className="text-sm text-muted-foreground">
                    Manage customer orders
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-4">
                        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No orders yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Orders will appear here once customers start purchasing.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-xl border bg-card p-6 shadow-premium"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <p className="text-sm font-medium">
                                        {order.user.name || order.user.email}
                                    </p>
                                    <p className="text-xs text-muted-foreground font-mono">
                                        #{order.id.slice(0, 12)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Select
                                        defaultValue={order.status}
                                        onValueChange={(val) => handleStatusChange(order.id, val)}
                                    >
                                        <SelectTrigger className="w-36 h-8 rounded-lg text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {s}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span className="text-sm font-semibold">
                                        {formatPrice(order.total)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span className="text-muted-foreground">
                                            {item.product.name} × {item.quantity}
                                        </span>
                                        <span>{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <p className="mt-3 text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

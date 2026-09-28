"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2, MessageCircle, Search, ShoppingCart, Truck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/actions/order";
import { formatPrice } from "@/lib/formatters";
import { formatBdPhone, toWhatsAppNumber } from "@/lib/phone";
import { ORDER_CHANNEL_LABEL, ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Status = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface Order {
    id: string;
    orderNumber: string;
    status: Status;
    channel: string;
    paymentStatus: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    address: string;
    district: string;
    deliveryZone: string;
    note: string | null;
    createdAt: Date;
    items: Array<{ id: string; name: string; quantity: number; price: number }>;
}

const TABS: Array<{ value: string; label: string }> = [
    { value: "PENDING", label: "Awaiting confirmation" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "ALL", label: "All" },
];

// Primary "next step" per status, mirroring the server's allowed transitions
const NEXT_STEP: Partial<Record<Status, { to: Status; label: string; icon: typeof Check }>> = {
    PENDING: { to: "CONFIRMED", label: "Confirm order", icon: Check },
    CONFIRMED: { to: "SHIPPED", label: "Mark shipped", icon: Truck },
    PROCESSING: { to: "SHIPPED", label: "Mark shipped", icon: Truck },
    SHIPPED: { to: "DELIVERED", label: "Mark delivered", icon: Check },
};

function timeAgo(date: Date) {
    const mins = Math.round((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours} h ago`;
    return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function OrderCard({ order }: { order: Order }) {
    const router = useRouter();
    const [pending, setPending] = useState<Status | null>(null);
    const next = NEXT_STEP[order.status];
    const canCancel = order.status !== "DELIVERED" && order.status !== "CANCELLED";

    async function change(status: Status) {
        if (status === "CANCELLED" && !confirm(`Cancel order ${order.orderNumber}?`)) return;
        setPending(status);
        const result = await updateOrderStatus(order.id, status);
        setPending(null);
        if ("error" in result && result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(`${order.orderNumber}: ${ORDER_STATUS_LABEL[status]}`);
        router.refresh();
    }

    const chatText = `Hi ${order.customerName}, this is Velora about your order ${order.orderNumber} (${formatPrice(order.total)}).`;
    const chatUrl = `https://wa.me/${toWhatsAppNumber(order.customerPhone)}?text=${encodeURIComponent(chatText)}`;

    return (
        <article className="rounded-2xl border bg-card p-5 shadow-premium">
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-medium">{order.orderNumber}</span>
                <Badge variant="outline" className="border-0 bg-muted">
                    {ORDER_CHANNEL_LABEL[order.channel] ?? order.channel}
                </Badge>
                <Badge className={cn("border-0", ORDER_STATUS_COLOR[order.status])}>
                    {ORDER_STATUS_LABEL[order.status]}
                </Badge>
                <span className="ml-auto text-xs text-muted-foreground">{timeAgo(order.createdAt)}</span>
            </div>

            <div className="grid gap-4 text-sm sm:grid-cols-3">
                <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-semibold">{order.customerName}</p>
                    {order.customerPhone && (
                        <a href={`tel:${order.customerPhone}`} className="block font-medium text-primary hover:underline">
                            {formatBdPhone(order.customerPhone)}
                        </a>
                    )}
                    {order.customerEmail && (
                        <a href={`mailto:${order.customerEmail}`} className="block truncate text-muted-foreground hover:underline">
                            {order.customerEmail}
                        </a>
                    )}
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Deliver to</p>
                    <p className="break-words">{order.address}{order.district ? `, ${order.district}` : ""}</p>
                    <p className="text-muted-foreground">
                        {order.deliveryZone === "INSIDE_DHAKA" ? "Inside Dhaka" : "Outside Dhaka"} · {formatPrice(order.deliveryFee)}
                    </p>
                    {order.note && <p className="text-muted-foreground">Note: {order.note}</p>}
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Items</p>
                    {order.items.map((item) => (
                        <p key={item.id}>
                            {item.name} × {item.quantity}{" "}
                            <span className="text-muted-foreground">({formatPrice(item.price * item.quantity)})</span>
                        </p>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
                <p className="mr-auto text-lg font-bold">
                    {formatPrice(order.total)}{" "}
                    <span className="text-xs font-medium text-muted-foreground">
                        COD · {order.paymentStatus === "PAID" ? "paid" : "unpaid"}
                    </span>
                </p>
                {order.customerPhone && (
                    <Button asChild variant="outline" className="h-10 rounded-lg border-green-200 text-green-800 hover:bg-green-50 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950">
                        <a href={chatUrl} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="mr-1.5 h-4 w-4" /> Chat
                        </a>
                    </Button>
                )}
                {canCancel && (
                    <Button
                        variant="outline"
                        className="h-10 rounded-lg text-red-700 hover:bg-red-50 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-950"
                        disabled={pending !== null}
                        onClick={() => change("CANCELLED")}
                    >
                        {pending === "CANCELLED" ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <X className="mr-1.5 h-4 w-4" />}
                        Cancel
                    </Button>
                )}
                {next && (
                    <Button
                        className="h-10 rounded-lg gradient-bg border-0 text-white hover:opacity-90"
                        disabled={pending !== null}
                        onClick={() => change(next.to)}
                    >
                        {pending === next.to ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <next.icon className="mr-1.5 h-4 w-4" />}
                        {next.label}
                    </Button>
                )}
            </div>
        </article>
    );
}

export function OrdersClient({
    orders,
    counts,
    activeStatus,
    query,
}: {
    orders: Order[];
    counts: Record<string, number>;
    activeStatus: string;
    query: string;
}) {
    const router = useRouter();
    const [search, setSearch] = useState(query);
    const [isPending, startTransition] = useTransition();
    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-5 animate-fade-in">
            <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Orders</h1>
                    <p className="text-sm text-muted-foreground">
                        Confirm requests after you&apos;ve talked to the customer. Stock is reserved when you confirm.
                    </p>
                </div>
                <form
                    role="search"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const q = search.trim();
                        startTransition(() =>
                            router.push(q ? `/admin/orders?status=ALL&q=${encodeURIComponent(q)}` : "/admin/orders")
                        );
                    }}
                    className="relative w-full sm:w-72"
                >
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Order #, name or phone"
                        aria-label="Search orders"
                        maxLength={80}
                        className="h-10 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                    />
                </form>
            </div>

            <nav aria-label="Order status" className="-mx-1 flex gap-1 overflow-x-auto border-b px-1 no-scrollbar">
                {TABS.map((tab) => {
                    const count = tab.value === "ALL" ? total : counts[tab.value] ?? 0;
                    const active = activeStatus === tab.value;
                    return (
                        <Link
                            key={tab.value}
                            href={`/admin/orders?status=${tab.value}`}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "flex h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm",
                                active ? "border-primary font-semibold text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab.label}
                            {count > 0 && (
                                <span
                                    className={cn(
                                        "rounded-full px-1.5 text-xs",
                                        tab.value === "PENDING" ? "bg-amber-500 text-white" : "bg-muted"
                                    )}
                                >
                                    {count}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {query && (
                <p className="text-sm text-muted-foreground">
                    Results for <strong className="text-foreground">“{query}”</strong> ·{" "}
                    <Link href="/admin/orders" className="text-primary hover:underline">clear</Link>
                </p>
            )}

            <div className={cn("space-y-4 transition-opacity", isPending && "opacity-60")}>
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                            <ShoppingCart className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold">Nothing here</h3>
                        <p className="mt-1 text-sm text-muted-foreground">No orders in this list right now.</p>
                    </div>
                ) : (
                    orders.map((order) => <OrderCard key={order.id} order={order} />)
                )}
            </div>
        </div>
    );
}

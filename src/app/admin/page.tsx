import {
    DollarSign,
    Package,
    ShoppingCart,
    Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/formatters";
import type { Metadata } from "next";
import Link from "next/link";
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from "@/lib/order-status";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin Dashboard" };

async function getDashboardStats() {
    const [
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        recentOrders,
    ] = await Promise.all([
        prisma.order.aggregate({
            _sum: { total: true },
            where: { status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] } },
        }),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.product.count({ where: { isArchived: false } }),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: { select: { name: true } } } },
            },
        }),
    ]);

    return {
        revenue: Number(totalRevenue._sum.total || 0),
        orders: totalOrders,
        products: totalProducts,
        customers: totalCustomers,
        recentOrders: recentOrders.map((o) => ({
            ...o,
            total: Number(o.total),
        })),
    };
}

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();

    const kpis = [
        {
            title: "Confirmed revenue",
            value: formatPrice(stats.revenue),
            icon: DollarSign,
            hint: "Confirmed, shipped and delivered orders",
        },
        {
            title: "Awaiting confirmation",
            value: stats.orders.toString(),
            icon: ShoppingCart,
            hint: "Order requests to confirm",
            href: "/admin/orders?status=PENDING",
        },
        {
            title: "Products",
            value: stats.products.toString(),
            icon: Package,
            hint: "Active products",
        },
        {
            title: "Customers",
            value: stats.customers.toString(),
            icon: Users,
            hint: "Registered customers",
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Overview of your store performance
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => (
                    <Card key={kpi.title} className="shadow-premium">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {kpi.title}
                            </CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <kpi.icon className="h-4 w-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            {"href" in kpi && kpi.href ? (
                                <Link href={kpi.href} className="mt-1 inline-block text-xs font-medium text-primary hover:underline">
                                    {kpi.hint} →
                                </Link>
                            ) : (
                                <p className="mt-1 text-xs text-muted-foreground">{kpi.hint}</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Orders */}
            <Card className="shadow-premium">
                <CardHeader>
                    <CardTitle className="text-lg">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.recentOrders.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            No orders yet
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stats.recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {order.customerName || order.user.name || order.user.email}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {order.items.length} item{order.items.length !== 1 ? "s" : ""} •{" "}
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={`${ORDER_STATUS_COLOR[order.status]} border-0`}>
                                            {ORDER_STATUS_LABEL[order.status]}
                                        </Badge>
                                        <span className="text-sm font-semibold">
                                            {formatPrice(order.total)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

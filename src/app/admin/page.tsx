import {
    DollarSign,
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/formatters";
import type { Metadata } from "next";

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
            where: { status: { not: "CANCELLED" } },
        }),
        prisma.order.count(),
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

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    PROCESSING: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    SHIPPED: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    DELIVERED: "bg-green-500/10 text-green-600 dark:text-green-400",
    CANCELLED: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();

    const kpis = [
        {
            title: "Total Revenue",
            value: formatPrice(stats.revenue),
            icon: DollarSign,
            change: "+12.5%",
        },
        {
            title: "Total Orders",
            value: stats.orders.toString(),
            icon: ShoppingCart,
            change: "+8.2%",
        },
        {
            title: "Products",
            value: stats.products.toString(),
            icon: Package,
            change: "+3",
        },
        {
            title: "Customers",
            value: stats.customers.toString(),
            icon: Users,
            change: "+24",
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
                            <div className="mt-1 flex items-center text-xs text-green-600">
                                <TrendingUp className="mr-1 h-3 w-3" />
                                {kpi.change} from last month
                            </div>
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
                                            {order.user.name || order.user.email}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {order.items.length} item{order.items.length !== 1 ? "s" : ""} •{" "}
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={`${statusColors[order.status]} border-0`}>
                                            {order.status}
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

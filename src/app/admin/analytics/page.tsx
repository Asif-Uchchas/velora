import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/formatters";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics — Admin" };

async function getAnalytics() {
    const [
        totalRevenue,
        monthlyOrders,
        topProducts,
        revenueByCategory,
    ] = await Promise.all([
        prisma.order.aggregate({
            _sum: { total: true },
            where: { status: { not: "CANCELLED" } },
        }),
        prisma.order.groupBy({
            by: ["status"],
            _count: true,
            _sum: { total: true },
        }),
        prisma.orderItem.groupBy({
            by: ["productId"],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: "desc" } },
            take: 5,
        }),
        prisma.product.findMany({
            select: {
                category: { select: { name: true } },
                orderItems: { select: { price: true, quantity: true } },
            },
        }),
    ]);

    // Get product names for top products
    const topProductsWithNames = await Promise.all(
        topProducts.map(async (tp) => {
            const product = await prisma.product.findUnique({
                where: { id: tp.productId },
                select: { name: true },
            });
            return {
                name: product?.name || "Unknown",
                sold: tp._sum.quantity || 0,
            };
        })
    );

    // Calculate revenue by category
    const categoryRevenue: Record<string, number> = {};
    for (const product of revenueByCategory) {
        const catName = product.category.name;
        const revenue = product.orderItems.reduce(
            (sum, item) => sum + Number(item.price) * item.quantity,
            0
        );
        categoryRevenue[catName] = (categoryRevenue[catName] || 0) + revenue;
    }

    return {
        revenue: Number(totalRevenue._sum.total || 0),
        ordersByStatus: monthlyOrders.map((m) => ({
            status: m.status,
            count: m._count,
            revenue: Number(m._sum.total || 0),
        })),
        topProducts: topProductsWithNames,
        categoryRevenue: Object.entries(categoryRevenue)
            .map(([name, revenue]) => ({ name, revenue }))
            .sort((a, b) => b.revenue - a.revenue),
    };
}

export default async function AdminAnalyticsPage() {
    const analytics = await getAnalytics();

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-sm text-muted-foreground">
                    Insights into your store performance
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {/* Orders by Status */}
                <Card className="shadow-premium">
                    <CardHeader>
                        <CardTitle className="text-base">Orders by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {analytics.ordersByStatus.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                                No order data available
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {analytics.ordersByStatus.map((item) => (
                                    <div
                                        key={item.status}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`h-2 w-2 rounded-full ${item.status === "DELIVERED"
                                                    ? "bg-green-500"
                                                    : item.status === "CANCELLED"
                                                        ? "bg-red-500"
                                                        : item.status === "PROCESSING"
                                                            ? "bg-blue-500"
                                                            : item.status === "SHIPPED"
                                                                ? "bg-purple-500"
                                                                : "bg-yellow-500"
                                                    }`}
                                            />
                                            <span className="text-sm">{item.status}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-medium">{item.count}</span>
                                            <span className="text-xs text-muted-foreground ml-2">
                                                {formatPrice(item.revenue)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="shadow-premium">
                    <CardHeader>
                        <CardTitle className="text-base">Top Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {analytics.topProducts.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                                No sales data available
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {analytics.topProducts.map((product, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-xs font-medium text-primary">
                                                {i + 1}
                                            </span>
                                            <span className="text-sm truncate max-w-[200px]">
                                                {product.name}
                                            </span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {product.sold} sold
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Revenue by Category */}
                <Card className="shadow-premium sm:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Revenue by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {analytics.categoryRevenue.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                                No category data available
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {analytics.categoryRevenue.map((cat) => {
                                    const maxRevenue = analytics.categoryRevenue[0]?.revenue || 1;
                                    const percentage = (cat.revenue / maxRevenue) * 100;
                                    return (
                                        <div key={cat.name}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm">{cat.name}</span>
                                                <span className="text-sm font-medium">
                                                    {formatPrice(cat.revenue)}
                                                </span>
                                            </div>
                                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className="h-full rounded-full gradient-bg transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

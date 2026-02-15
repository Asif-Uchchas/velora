import { getOrders } from "@/actions/order";
import { OrdersClient } from "./orders-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders — Admin" };

export default async function AdminOrdersPage() {
    const orders = await getOrders();
    return <OrdersClient orders={orders} />;
}

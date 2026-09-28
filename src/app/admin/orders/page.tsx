import type { Metadata } from "next";
import { getAdminOrders } from "@/actions/order";
import { OrdersClient } from "./orders-client";

export const metadata: Metadata = { title: "Orders — Admin" };
export const dynamic = "force-dynamic";

interface Props {
    searchParams: Promise<{ status?: string; q?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
    const params = await searchParams;
    // Default to the queue that needs action
    const status = params.q ? params.status : (params.status ?? "PENDING");
    const { orders, counts } = await getAdminOrders({ status: status === "ALL" ? undefined : status, q: params.q });
    return <OrdersClient orders={orders} counts={counts} activeStatus={status ?? "ALL"} query={params.q ?? ""} />;
}

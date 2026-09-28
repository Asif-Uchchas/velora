import { formatTaka } from "@/lib/formatters";
import { formatBdPhone, toWhatsAppNumber } from "@/lib/phone";

export interface OrderSummary {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string | null;
    address: string;
    district: string;
    deliveryZone: "INSIDE_DHAKA" | "OUTSIDE_DHAKA";
    note?: string | null;
    subtotal: number;
    deliveryFee: number;
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
}

export const zoneLabel = (zone: OrderSummary["deliveryZone"]) =>
    zone === "INSIDE_DHAKA" ? "Inside Dhaka" : "Outside Dhaka";

/** Plain-text order used for the WhatsApp message and the email text part. */
export function buildOrderText(order: OrderSummary, adminUrl?: string): string {
    const lines = [
        `🛍️ New order request: ${order.orderNumber}`,
        "",
        ...order.items.map(
            (item, i) => `${i + 1}. ${item.name} × ${item.quantity} = ${formatTaka(item.price * item.quantity)}`
        ),
        "",
        `Subtotal: ${formatTaka(order.subtotal)}`,
        `Delivery (${zoneLabel(order.deliveryZone)}): ${formatTaka(order.deliveryFee)}`,
        `Total (cash on delivery): ${formatTaka(order.total)}`,
        "",
        `Name: ${order.customerName}`,
        `Phone: ${formatBdPhone(order.customerPhone)}`,
        `Address: ${order.address}, ${order.district}`,
    ];
    if (order.note) lines.push(`Note: ${order.note}`);
    if (adminUrl) lines.push("", `Admin: ${adminUrl}`);
    lines.push("", "Please confirm my order.");
    return lines.join("\n");
}

export function mailtoLink(to: string, subject: string, body: string): string {
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function whatsappLink(toPhone: string, text: string): string {
    return `https://wa.me/${toWhatsAppNumber(toPhone)}?text=${encodeURIComponent(text)}`;
}

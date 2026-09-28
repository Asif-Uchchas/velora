import "server-only";
import { prisma } from "@/lib/prisma";

export async function getStoreSettings() {
    return prisma.storeSettings.upsert({
        where: { id: "default" },
        update: {},
        create: { id: "default" },
    });
}

/** Where email orders go: the admin setting first, then env fallbacks. */
export function orderEmailFor(settings: { orderEmail: string | null }): string | null {
    return settings.orderEmail || process.env.ORDER_NOTIFY_EMAIL || process.env.GMAIL_USER || null;
}

export function deliveryFeeFor(
    settings: { deliveryFeeInside: number; deliveryFeeOutside: number },
    zone: "INSIDE_DHAKA" | "OUTSIDE_DHAKA"
) {
    return zone === "INSIDE_DHAKA" ? settings.deliveryFeeInside : settings.deliveryFeeOutside;
}

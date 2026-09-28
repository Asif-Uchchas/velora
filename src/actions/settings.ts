"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { getStoreSettings } from "@/lib/settings";
import { storeSettingsSchema } from "@/lib/validators";

export async function getAdminSettings() {
    if (!(await requireAdmin())) return null;
    return getStoreSettings();
}

export async function updateStoreSettings(formData: FormData) {
    if (!(await requireAdmin())) return { error: "Unauthorized" };

    const parsed = storeSettingsSchema.safeParse({
        whatsappNumber: formData.get("whatsappNumber"),
        orderEmail: formData.get("orderEmail") || undefined,
        deliveryFeeInside: formData.get("deliveryFeeInside"),
        deliveryFeeOutside: formData.get("deliveryFeeOutside"),
    });
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    await prisma.storeSettings.upsert({
        where: { id: "default" },
        update: parsed.data,
        create: { id: "default", ...parsed.data },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/checkout");
    return { success: true };
}

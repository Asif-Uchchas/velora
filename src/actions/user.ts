"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/session";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { profileSchema, registerSchema } from "@/lib/validators";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function registerUser(formData: FormData) {
    if (!(await rateLimit(`register:${await clientIp()}`, 5, 60 * 60))) {
        return { error: "Too many sign-up attempts. Please try again later." };
    }

    const parsed = registerSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone") || undefined,
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { name, email, password, phone } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
        data: { name, email, password: hashedPassword, phone },
    });

    return { success: true };
}

export async function getMyProfile() {
    const user = await requireUser();
    if (!user) return null;
    return prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true, email: true, phone: true },
    });
}

export async function updateProfile(formData: FormData) {
    const user = await requireUser();
    if (!user) return { error: "Unauthorized" };

    const parsed = profileSchema.safeParse({
        name: formData.get("name"),
        phone: formData.get("phone") || undefined,
    });
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    await prisma.user.update({
        where: { id: user.id },
        data: { name: parsed.data.name, phone: parsed.data.phone ?? null },
    });

    revalidatePath("/account/settings");
    revalidatePath("/checkout");
    return { success: true };
}

export async function getUsers() {
    const admin = await requireAdmin();
    if (!admin) return [];

    return prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            image: true,
            createdAt: true,
            _count: { select: { orders: true } },
        },
    });
}

export async function updateUserRole(userId: string, role: "ADMIN" | "CUSTOMER") {
    const admin = await requireAdmin();
    if (!admin) return { error: "Unauthorized" };
    if (role !== "ADMIN" && role !== "CUSTOMER") return { error: "Invalid role" };
    if (userId === admin.id) return { error: "You cannot change your own role" };

    await prisma.user.update({
        where: { id: userId },
        data: { role },
    });

    revalidatePath("/admin/users");
    return { success: true };
}

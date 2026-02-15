"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function registerUser(formData: FormData) {
    const parsed = registerSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
        data: { name, email, password: hashedPassword },
    });

    return { success: true };
}

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    if (!name || name.length < 2) return { error: "Name is required" };

    await prisma.user.update({
        where: { id: session.user.id },
        data: { name },
    });

    revalidatePath("/account/settings");
    return { success: true };
}

export async function getUsers() {
    return prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            createdAt: true,
            _count: { select: { orders: true } },
        },
    });
}

export async function updateUserRole(userId: string, role: "ADMIN" | "CUSTOMER") {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    await prisma.user.update({
        where: { id: userId },
        data: { role },
    });

    revalidatePath("/admin/users");
    return { success: true };
}

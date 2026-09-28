import "server-only";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Re-checks the role against the database instead of trusting the JWT alone,
 * so a demoted admin loses access immediately rather than when the token expires.
 */
export async function requireAdmin() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, role: true },
    });

    return user?.role === "ADMIN" ? user : null;
}

export async function requireUser() {
    const session = await auth();
    return session?.user?.id ? session.user : null;
}

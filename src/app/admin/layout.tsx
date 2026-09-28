import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { AdminShell } from "./admin-shell";

// Admin pages always read live data and must never be prerendered/cached.
export const dynamic = "force-dynamic";

// Server-side guard in addition to middleware: re-checks the role in the database.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    if (!(await requireAdmin())) redirect("/login?callbackUrl=/admin");
    return <AdminShell>{children}</AdminShell>;
}

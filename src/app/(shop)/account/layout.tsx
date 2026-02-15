import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Package, Heart, Settings, User } from "lucide-react";

const accountLinks = [
    { href: "/account/orders", label: "My Orders", icon: Package, description: "View your order history" },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart, description: "Your saved products" },
    { href: "/account/settings", label: "Settings", icon: Settings, description: "Manage your profile" },
];

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) redirect("/login");

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">My Account</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Welcome back, {session.user.name}
                </p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row">
                {/* Sidebar */}
                <aside className="w-full lg:w-64 shrink-0">
                    <nav className="space-y-1">
                        {accountLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                            >
                                <link.icon className="h-4 w-4 text-muted-foreground" />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}

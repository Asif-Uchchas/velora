"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingCart,
    Users,
    BarChart3,
    ArrowLeft,
    Menu,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

function SidebarContent({ pathname }: { pathname: string }) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <Logo />
                <p className="mt-1 text-xs text-muted-foreground">Admin Dashboard</p>
            </div>

            <nav className="flex-1 p-3 space-y-1">
                {adminLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t">
                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Store
                </Link>
            </div>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-card">
                <SidebarContent pathname={pathname} />
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Menu className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                            <SidebarContent pathname={pathname} />
                        </SheetContent>
                    </Sheet>

                    <div className="flex-1" />
                    <ThemeToggle />
                </header>

                {/* Content */}
                <main className="flex-1 p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}

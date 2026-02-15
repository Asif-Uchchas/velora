"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
    ShoppingBag,
    Search,
    User,
    Heart,
    Menu,
    X,
    LogOut,
    Settings,
    Package,
    LayoutDashboard,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart-store";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
];

export function Header() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const itemCount = useCartStore((s) => s.getItemCount());
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
                    ? "glass shadow-premium"
                    : "bg-background/80 backdrop-blur-sm"
                }`}
        >
            <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-8">
                {/* Logo */}
                <Logo />

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted ${pathname === link.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                    <Link href="/products?search=" className="hidden sm:block">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                            <Search className="h-4 w-4" />
                        </Button>
                    </Link>

                    <Link href="/account/wishlist" className="hidden sm:block">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                            <Heart className="h-4 w-4" />
                        </Button>
                    </Link>

                    <Link href="/cart" className="relative">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                            <ShoppingBag className="h-4 w-4" />
                            {mounted && itemCount > 0 && (
                                <Badge className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full p-0 text-[9px] sm:text-[10px] gradient-bg border-0 text-white">
                                    {itemCount > 99 ? '99+' : itemCount}
                                </Badge>
                            )}
                        </Button>
                    </Link>

                    <ThemeToggle />

                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-lg hidden sm:flex"
                                >
                                    <User className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="px-2 py-1.5">
                                    <p className="text-sm font-medium">{session.user.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {session.user.email}
                                    </p>
                                </div>
                                <DropdownMenuSeparator />
                                {session.user.role === "ADMIN" && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Admin Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link href="/account/orders">
                                        <Package className="mr-2 h-4 w-4" />
                                        My Orders
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/account/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="text-destructive"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login" className="hidden sm:block">
                            <Button
                                size="sm"
                                className="ml-2 rounded-lg gradient-bg border-0 text-white hover:opacity-90"
                            >
                                Sign In
                            </Button>
                        </Link>
                    )}

                    {/* Mobile menu */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                                <Menu className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 sm:w-80">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <div className="flex flex-col h-full">
                                {/* Mobile menu header */}
                                <div className="flex items-center justify-between pb-4 border-b">
                                    <span className="text-lg font-bold gradient-text">Menu</span>
                                </div>

                                {/* Mobile navigation links */}
                                <nav className="mt-4 flex flex-col gap-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setOpen(false)}
                                            className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted ${pathname === link.href
                                                    ? "bg-muted text-primary"
                                                    : "text-muted-foreground"
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>

                                {/* Mobile-only links */}
                                <div className="mt-4 pt-4 border-t">
                                    <p className="px-4 text-xs font-medium text-muted-foreground uppercase mb-2">Account</p>
                                    <Link
                                        href="/account/wishlist"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground"
                                    >
                                        <Heart className="h-4 w-4" />
                                        Wishlist
                                    </Link>
                                    <Link
                                        href="/cart"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground"
                                    >
                                        <ShoppingBag className="h-4 w-4" />
                                        Cart ({itemCount})
                                    </Link>
                                    {session ? (
                                        <>
                                            <Link
                                                href="/account/orders"
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground"
                                            >
                                                <Package className="h-4 w-4" />
                                                My Orders
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    signOut();
                                                    setOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted text-destructive"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted text-primary"
                                        >
                                            <User className="h-4 w-4" />
                                            Sign In
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

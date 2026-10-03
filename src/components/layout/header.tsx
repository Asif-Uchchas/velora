"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    ShoppingBag,
    User,
    Heart,
    Menu,
    LogOut,
    Settings,
    Package,
    LayoutDashboard,
    Search,
    ChevronDown,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { categoryIcon } from "@/components/shop/category-icon";

export interface HeaderCategory {
    id: string;
    name: string;
    slug: string;
}

function HeaderSearchForm({ className = "" }: { className?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const current = pathname === "/" ? searchParams.get("q") ?? "" : "";
    const [value, setValue] = useState(current);
    const [prev, setPrev] = useState(current);

    // Follow the URL when it changes elsewhere (chips, "clear all", back button)
    if (current !== prev) {
        setPrev(current);
        setValue(current);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const q = value.trim();
        // On the shop page keep the other filters; elsewhere start a fresh search
        const params = new URLSearchParams(pathname === "/" ? searchParams.toString() : "");
        if (q) params.set("q", q);
        else params.delete("q");
        params.delete("page");
        params.delete("search");
        const qs = params.toString();
        router.push(qs ? `/?${qs}` : "/", { scroll: pathname !== "/" });
    }

    return (
        <form role="search" onSubmit={submit} className={`flex h-11 w-full overflow-hidden rounded-xl border bg-card focus-within:ring-[3px] focus-within:ring-ring/30 ${className}`}>
            <input
                type="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                maxLength={100}
                placeholder="Search for products, categories and more…"
                aria-label="Search products"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            <button
                type="submit"
                aria-label="Search"
                className="flex w-12 shrink-0 items-center justify-center bg-foreground text-background transition-opacity hover:opacity-90"
            >
                <Search className="h-4 w-4" />
            </button>
        </form>
    );
}

function HeaderSearch({ className }: { className?: string }) {
    return (
        <Suspense fallback={<div className={`h-11 w-full rounded-xl border bg-card ${className ?? ""}`} />}>
            <HeaderSearchForm className={className} />
        </Suspense>
    );
}

function LabelledIcon({ icon: Icon, label, badge }: { icon: typeof User; label: string; badge?: number }) {
    return (
        <span className="relative flex items-center gap-2 text-sm">
            <span className="relative">
                <Icon className="h-5 w-5" />
                {badge ? (
                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full gradient-bg px-1 text-[10px] font-semibold text-white">
                        {badge > 99 ? "99+" : badge}
                    </span>
                ) : null}
            </span>
            <span className="hidden whitespace-nowrap lg:inline">{label}</span>
        </span>
    );
}

export function Header({ categories }: { categories: HeaderCategory[] }) {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const hydrated = useHydrated();
    const count = useCartStore((s) => s.getItemCount());
    const itemCount = hydrated ? count : 0;

    return (
        <header className="z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 md:sticky md:top-0">
            {/* Row 1: brand, search, account */}
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:gap-8 lg:px-8">
                <Logo />

                <HeaderSearch className="hidden md:flex md:max-w-xl lg:max-w-2xl" />

                <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-5">
                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="hidden rounded-lg p-2 hover:bg-muted md:block" aria-label="Account menu">
                                <LabelledIcon icon={User} label="Account" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="font-normal">
                                    <p className="text-sm font-medium">{session.user.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {session.user.role === "ADMIN" && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Admin dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link href="/account/orders">
                                        <Package className="mr-2 h-4 w-4" />
                                        My orders
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/account/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login" className="hidden rounded-lg p-2 hover:bg-muted md:block">
                            <LabelledIcon icon={User} label="Sign in" />
                        </Link>
                    )}

                    <Link href="/account/wishlist" className="rounded-lg p-2 hover:bg-muted" aria-label="Wishlist">
                        <LabelledIcon icon={Heart} label="Wishlist" />
                    </Link>

                    <Link
                        href="/cart"
                        className="rounded-lg p-2 hover:bg-muted"
                        aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"}
                    >
                        <LabelledIcon icon={ShoppingBag} label="Cart" badge={itemCount} />
                    </Link>

                    <ThemeToggle />

                    {/* Mobile: account & extra links (main navigation is the bottom bar) */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg md:hidden" aria-label="Open menu">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 sm:w-80">
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                            <nav className="mt-10 flex flex-col gap-1 px-2">
                                <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Shop</p>
                                {categories.map((c) => {
                                    const Icon = categoryIcon(c.slug);
                                    return (
                                        <Link
                                            key={c.id}
                                            href={`/?category=${c.slug}`}
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
                                        >
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                            {c.name}
                                        </Link>
                                    );
                                })}
                                <p className="mt-4 px-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Account</p>
                                {session ? (
                                    <>
                                        {session.user.role === "ADMIN" && (
                                            <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted">
                                                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                                                Admin dashboard
                                            </Link>
                                        )}
                                        <Link href="/account/orders" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted">
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                            My orders
                                        </Link>
                                        <Link href="/account/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted">
                                            <Settings className="h-4 w-4 text-muted-foreground" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setOpen(false);
                                                signOut();
                                            }}
                                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-destructive hover:bg-muted"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign out
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted">
                                        <User className="h-4 w-4" />
                                        Sign in
                                    </Link>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Mobile search */}
            <div className="px-4 pb-3 md:hidden">
                <HeaderSearch />
            </div>

            {/* Row 2: categories (desktop) */}
            <nav aria-label="Categories" className="hidden border-t md:block">
                <div className="mx-auto flex h-11 max-w-7xl items-center gap-1 overflow-x-auto px-4 text-sm no-scrollbar lg:px-8">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mr-3 flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 font-medium hover:bg-muted">
                            <Menu className="h-4 w-4" />
                            All categories
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-60">
                            {categories.map((c) => {
                                const Icon = categoryIcon(c.slug);
                                return (
                                    <DropdownMenuItem key={c.id} asChild>
                                        <Link href={`/?category=${c.slug}`}>
                                            <Icon className="mr-2 h-4 w-4" />
                                            {c.name}
                                        </Link>
                                    </DropdownMenuItem>
                                );
                            })}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/categories">Browse all categories</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {categories.map((c) => (
                        <Link
                            key={c.id}
                            href={`/?category=${c.slug}`}
                            className="shrink-0 rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            {c.name}
                        </Link>
                    ))}
                    <Link
                        href="/?sale=1&sort=discount"
                        className="ml-auto shrink-0 rounded-lg px-3 py-1.5 font-medium text-primary hover:bg-primary/10"
                    >
                        Deals
                    </Link>
                </div>
            </nav>
        </header>
    );
}

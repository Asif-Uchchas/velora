"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/stores/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

/** Phone-only tab bar, like a shopping app. Hidden from md up, where the header carries navigation. */
export function BottomNav() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const hydrated = useHydrated();
    const count = useCartStore((s) => s.getItemCount());
    const itemCount = hydrated ? count : 0;

    const items = [
        { href: "/", label: "Home", icon: Home, active: pathname === "/" },
        { href: "/categories", label: "Categories", icon: LayoutGrid, active: pathname.startsWith("/categories") },
        { href: "/cart", label: "Cart", icon: ShoppingBag, active: pathname === "/cart", badge: itemCount },
        { href: "/account/wishlist", label: "Wishlist", icon: Heart, active: pathname === "/account/wishlist" },
        {
            href: session ? "/account" : "/login",
            label: session ? "Account" : "Sign in",
            icon: User,
            active: pathname === "/account" || pathname === "/account/orders" || pathname === "/account/settings",
        },
    ];

    return (
        <nav
            aria-label="Main"
            className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur md:hidden"
        >
            <ul className="mx-auto grid h-16 max-w-md grid-cols-5">
                {items.map((item) => (
                    <li key={item.label}>
                        <Link
                            href={item.href}
                            aria-current={item.active ? "page" : undefined}
                            className={cn(
                                "flex h-full flex-col items-center justify-center gap-1 text-[11px]",
                                item.active ? "font-semibold text-primary" : "text-muted-foreground"
                            )}
                        >
                            <span className="relative">
                                <item.icon className="h-5 w-5" />
                                {item.badge ? (
                                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full gradient-bg px-1 text-[10px] font-semibold text-white">
                                        {item.badge > 99 ? "99+" : item.badge}
                                    </span>
                                ) : null}
                            </span>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

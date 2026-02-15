import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const footerLinks = {
    Shop: [
        { href: "/products", label: "All Products" },
        { href: "/categories", label: "Categories" },
        { href: "/products?featured=true", label: "Featured" },
        { href: "/products?sort=newest", label: "New Arrivals" },
    ],
    Account: [
        { href: "/account/orders", label: "My Orders" },
        { href: "/account/wishlist", label: "Wishlist" },
        { href: "/account/settings", label: "Settings" },
        { href: "/cart", label: "Cart" },
    ],
    Company: [
        { href: "#", label: "About Us" },
        { href: "#", label: "Contact" },
        { href: "#", label: "Privacy Policy" },
        { href: "#", label: "Terms of Service" },
    ],
};

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Logo />
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                            Premium e-commerce platform crafted for the modern shopper.
                            Beautiful products, seamless experience.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="text-sm font-semibold">{title}</h3>
                            <ul className="mt-4 space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Velora. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <span className="text-xs text-muted-foreground">
                            Built with Next.js & Stripe
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

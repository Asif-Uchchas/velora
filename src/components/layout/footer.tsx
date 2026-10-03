import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { getStoreSettings, orderEmailFor } from "@/lib/settings";
import { formatPrice } from "@/lib/formatters";
import { formatBdPhone, toWhatsAppNumber } from "@/lib/phone";

const shopLinks = [
    { href: "/", label: "All products" },
    { href: "/categories", label: "Categories" },
    { href: "/?featured=1", label: "Featured" },
    { href: "/?sort=newest", label: "New arrivals" },
    { href: "/?sale=1&sort=discount", label: "Deals" },
];

const accountLinks = [
    { href: "/account/orders", label: "My orders" },
    { href: "/account/wishlist", label: "Wishlist" },
    { href: "/account/settings", label: "Settings" },
    { href: "/cart", label: "Cart" },
];

export async function Footer() {
    const settings = await getStoreSettings().catch(() => null);
    const email = settings ? orderEmailFor(settings) : null;

    return (
        <footer className="border-t bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
                    <div className="space-y-4">
                        <Logo />
                        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                            Everyday essentials, chosen with care. Cash on delivery to all 64 districts of Bangladesh.
                        </p>
                        <p className="font-display text-lg italic text-foreground/80">Shop smart. Live better.</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Shop</h3>
                        <ul className="mt-4 space-y-2.5">
                            {shopLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Account</h3>
                        <ul className="mt-4 space-y-2.5">
                            {accountLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Help</h3>
                        <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                            {settings && (
                                <li>
                                    <a
                                        href={`https://wa.me/${toWhatsAppNumber(settings.whatsappNumber)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary"
                                    >
                                        WhatsApp {formatBdPhone(settings.whatsappNumber)}
                                    </a>
                                </li>
                            )}
                            {email && (
                                <li>
                                    <a href={`mailto:${email}`} className="break-all hover:text-primary">
                                        {email}
                                    </a>
                                </li>
                            )}
                            {settings && (
                                <li>
                                    Delivery {formatPrice(settings.deliveryFeeInside)} in Dhaka,{" "}
                                    {formatPrice(settings.deliveryFeeOutside)} outside
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
                    <p>&copy; {new Date().getFullYear()} Velora. All rights reserved.</p>
                    <p>Cash on delivery · Order on WhatsApp</p>
                </div>
            </div>
        </footer>
    );
}

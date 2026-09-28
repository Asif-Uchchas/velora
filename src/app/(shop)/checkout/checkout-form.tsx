"use client";

import { useEffect, useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Mail, MessageCircle, Phone, QrCode, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { placeOrder } from "@/actions/order";
import { formatPrice } from "@/lib/formatters";
import { formatBdPhone } from "@/lib/phone";
import { BD_DISTRICTS, zoneForDistrict, type District } from "@/lib/districts";
import { cn } from "@/lib/utils";

interface Props {
    profile: { name: string; email: string; phone: string | null };
    fees: { inside: number; outside: number };
    emailAvailable: boolean;
}

type Channel = "WHATSAPP" | "EMAIL";

export function CheckoutForm({ profile, fees, emailAvailable }: Props) {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const mounted = useHydrated();
    const [submitting, setSubmitting] = useState<Channel | null>(null);
    const [district, setDistrict] = useState<District>("Dhaka");
    const [form, setForm] = useState({ customerName: profile.name, address: "", note: "" });

    // Cart lives in localStorage, so wait for hydration before deciding it's empty
    useEffect(() => {
        if (mounted && items.length === 0 && !submitting) router.replace("/cart");
    }, [mounted, items.length, submitting, router]);

    if (!mounted || items.length === 0) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const zone = zoneForDistrict(district);
    const deliveryFee = zone === "INSIDE_DHAKA" ? fees.inside : fees.outside;
    const subtotal = getTotal();
    const hasPhone = Boolean(profile.phone);

    async function submit(channel: Channel) {
        if (!hasPhone) {
            toast.error("Add your phone number first so we can reach you.");
            return;
        }
        if (form.customerName.trim().length < 2 || form.address.trim().length < 8) {
            toast.error("Please enter your name and full delivery address.");
            return;
        }

        setSubmitting(channel);
        try {
            const result = await placeOrder({
                channel,
                items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
                customerName: form.customerName,
                address: form.address,
                district,
                note: form.note || undefined,
            });

            if ("error" in result) {
                toast.error(result.error);
                if (result.needsPhone) router.push("/account/settings?next=/checkout");
                setSubmitting(null);
                return;
            }

            clearCart();
            const params = new URLSearchParams({ order: result.orderNumber });
            if (channel === "WHATSAPP") params.set("send", "1");
            if (channel === "EMAIL") {
                if (result.emailSent === null) params.set("send", "1"); // open the customer's mail app
                else if (!result.emailSent) params.set("mail", "failed");
            }
            router.replace(`/checkout/success?${params.toString()}`);
        } catch {
            toast.error("Something went wrong. Please try again.");
            setSubmitting(null);
        }
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10 lg:px-8 animate-fade-in">
            <Link href="/cart" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" /> Back to cart
            </Link>
            <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Delivery &amp; order</h1>

            <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
                <div className="space-y-6">
                    {/* 1. Delivery */}
                    <section className="rounded-2xl border bg-card p-5 shadow-premium sm:p-6" aria-labelledby="delivery-heading">
                        <h2 id="delivery-heading" className="mb-4 text-base font-semibold">1. Delivery details</h2>

                        <div className="mb-4 flex items-center gap-3 rounded-xl bg-muted/60 p-3 text-sm">
                            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            {hasPhone ? (
                                <>
                                    <span className="flex-1">
                                        We&apos;ll contact you on <strong>{formatBdPhone(profile.phone!)}</strong>
                                    </span>
                                    <Link href="/account/settings?next=/checkout" className="font-medium text-primary hover:underline">
                                        Change
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <span className="flex-1">
                                        Add your WhatsApp number to your account before ordering.
                                    </span>
                                    <Link
                                        href="/account/settings?next=/checkout"
                                        className="rounded-lg bg-primary px-3 py-1.5 font-medium text-primary-foreground hover:opacity-90"
                                    >
                                        Add number
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="customerName">Full name</Label>
                                <Input
                                    id="customerName"
                                    autoComplete="name"
                                    maxLength={80}
                                    value={form.customerName}
                                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                                    className="h-11 rounded-lg"
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="address">Full address</Label>
                                <Textarea
                                    id="address"
                                    autoComplete="street-address"
                                    maxLength={300}
                                    rows={2}
                                    placeholder="House, road, area, thana"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className="rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="district">District</Label>
                                <select
                                    id="district"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value as District)}
                                    className="h-11 w-full rounded-lg border bg-card px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                                >
                                    {BD_DISTRICTS.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="note">Note (optional)</Label>
                                <Input
                                    id="note"
                                    maxLength={500}
                                    placeholder="e.g. call before delivery"
                                    value={form.note}
                                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                                    className="h-11 rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2" role="group" aria-label="Delivery zone">
                            {(
                                [
                                    { z: "INSIDE_DHAKA", label: "Inside Dhaka", eta: "1–2 days", fee: fees.inside },
                                    { z: "OUTSIDE_DHAKA", label: "Outside Dhaka", eta: "3–5 days", fee: fees.outside },
                                ] as const
                            ).map((opt) => (
                                <div
                                    key={opt.z}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl border p-3.5",
                                        zone === opt.z ? "border-2 border-primary bg-primary/5" : "opacity-60"
                                    )}
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{opt.label}</p>
                                        <p className="text-xs text-muted-foreground">{opt.eta}</p>
                                    </div>
                                    <span className="text-sm font-semibold">{formatPrice(opt.fee)}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">Delivery zone is set from your district.</p>
                    </section>

                    {/* 2. How to order */}
                    <section className="rounded-2xl border bg-card p-5 shadow-premium sm:p-6" aria-labelledby="method-heading">
                        <h2 id="method-heading" className="text-base font-semibold">2. How would you like to place the order?</h2>
                        <p className="mb-4 mt-1 text-sm text-muted-foreground">
                            No payment now. We confirm with you first, then you pay cash on delivery.
                        </p>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => submit("WHATSAPP")}
                                disabled={submitting !== null || !hasPhone}
                                className="flex w-full items-center gap-4 rounded-2xl border-2 border-green-700 bg-green-50 p-4 text-left transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-green-950/40 dark:hover:bg-green-950/60"
                            >
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-700 text-white">
                                    {submitting === "WHATSAPP" ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-6 w-6" />}
                                </span>
                                <span className="flex-1">
                                    <span className="block text-base font-semibold">Order on WhatsApp</span>
                                    <span className="block text-sm text-muted-foreground">
                                        Opens WhatsApp with your full order ready to send. Fastest reply.
                                    </span>
                                </span>
                                <span className="hidden rounded-full bg-green-700 px-2.5 py-1 text-xs font-semibold text-white sm:inline">
                                    Recommended
                                </span>
                            </button>

                            {emailAvailable && (
                            <button
                                type="button"
                                onClick={() => submit("EMAIL")}
                                disabled={submitting !== null || !hasPhone}
                                className="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    {submitting === "EMAIL" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
                                </span>
                                <span className="flex-1">
                                    <span className="block text-base font-semibold">Order by email</span>
                                    <span className="block text-sm text-muted-foreground">
                                        Opens your email with the order ready to send; the store replies by email or WhatsApp.
                                    </span>
                                </span>
                            </button>
                            )}

                            <div
                                aria-disabled="true"
                                className="flex w-full items-center gap-4 rounded-2xl border border-dashed bg-muted/40 p-4 text-muted-foreground"
                            >
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                                    <QrCode className="h-5 w-5" />
                                </span>
                                <span className="flex-1">
                                    <span className="block text-base font-semibold">Pay with Bangla QR</span>
                                    <span className="block text-sm">bKash, Nagad, Rocket and bank apps: scan and pay.</span>
                                </span>
                                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">Coming soon</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Summary */}
                <aside className="h-fit rounded-2xl border bg-card p-5 shadow-premium sm:p-6 lg:sticky lg:top-24" aria-labelledby="summary-heading">
                    <h2 id="summary-heading" className="mb-4 text-base font-semibold">Order summary</h2>
                    <ul className="space-y-3">
                        {items.map((item) => (
                            <li key={item.productId} className="flex items-center gap-3">
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                                </div>
                                <div className="min-w-0 flex-1 text-sm">
                                    <p className="truncate font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                                </div>
                                <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                            </li>
                        ))}
                    </ul>
                    <Separator className="my-4" />
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Subtotal</dt>
                            <dd>{formatPrice(subtotal)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Delivery ({zone === "INSIDE_DHAKA" ? "Inside Dhaka" : "Outside Dhaka"})
                            </dt>
                            <dd>{formatPrice(deliveryFee)}</dd>
                        </div>
                    </dl>
                    <Separator className="my-4" />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPrice(subtotal + deliveryFee)}</span>
                    </div>
                    <div className="mt-4 flex gap-2.5 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                        Cash on delivery. Prices and stock are re-checked on our side when you place the order.
                    </div>
                </aside>
            </div>
        </div>
    );
}

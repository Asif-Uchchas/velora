import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AlertTriangle, CheckCircle2, Mail } from "lucide-react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { getMyOrder } from "@/actions/order";
import { formatPrice } from "@/lib/formatters";
import { zoneLabel } from "@/lib/order-message";
import { SendOrderButton } from "./send-order-button";

export const metadata: Metadata = { title: "Order received" };
export const dynamic = "force-dynamic";

interface Props {
    searchParams: Promise<{ order?: string; send?: string; mail?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
    const { order: orderNumber, send, mail } = await searchParams;
    const session = await auth();
    if (!session) redirect("/login");
    if (!orderNumber || !/^VL-[A-Z0-9-]{4,30}$/.test(orderNumber)) notFound();

    const order = await getMyOrder(orderNumber);
    if (!order) notFound();

    const isWhatsApp = order.channel === "WHATSAPP";

    return (
        <div className="mx-auto max-w-xl px-4 py-10 sm:py-16 animate-fade-in">
            <div className="rounded-2xl border bg-card p-6 shadow-premium sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                    <CheckCircle2 className="h-9 w-9 shrink-0 text-green-600" aria-hidden="true" />
                    <div>
                        <h1 className="text-xl font-bold sm:text-2xl">
                            {isWhatsApp
                                ? "One last step: send it on WhatsApp"
                                : order.mailtoUrl
                                    ? "One last step: send the email"
                                    : "Order request received"}
                        </h1>
                        <p className="font-mono text-sm text-muted-foreground">{order.orderNumber}</p>
                    </div>
                </div>

                {isWhatsApp && order.whatsappUrl && (
                    <div className="mb-6 space-y-3">
                        <p className="text-sm text-muted-foreground">
                            WhatsApp opens with your order already written. Just press <strong>send</strong>. We&apos;ll
                            confirm availability and delivery with you there.
                        </p>
                        <SendOrderButton
                            href={order.whatsappUrl}
                            orderNumber={order.orderNumber}
                            autoOpen={send === "1"}
                            channel="whatsapp"
                        />
                    </div>
                )}

                {!isWhatsApp && order.mailtoUrl && (
                    <div className="mb-6 space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Your email app opens with the order already written. Just press <strong>send</strong>. The
                            store replies by email or WhatsApp to confirm.
                        </p>
                        <SendOrderButton
                            href={order.mailtoUrl}
                            orderNumber={order.orderNumber}
                            autoOpen={send === "1"}
                            channel="email"
                        />
                        <p className="text-xs text-muted-foreground">
                            Email didn&apos;t open? Send your order number <strong className="font-mono">{order.orderNumber}</strong>{" "}
                            to <span className="select-all font-medium text-foreground">{order.orderEmail}</span>. Your order
                            is already saved.
                        </p>
                    </div>
                )}

                {!isWhatsApp && !order.mailtoUrl && (
                    <div className="mb-6 flex gap-3 rounded-xl bg-muted/60 p-4 text-sm">
                        {mail === "failed" ? (
                            <>
                                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                                <p>
                                    Your order is saved and the store can see it, but the notification email didn&apos;t go
                                    through. We&apos;ll still contact you, or message us on WhatsApp to speed things up.
                                </p>
                            </>
                        ) : (
                            <>
                                <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                <p>
                                    We&apos;ve emailed your order to the store. They&apos;ll get back to you by email or
                                    WhatsApp to confirm.
                                </p>
                            </>
                        )}
                    </div>
                )}

                <ul className="space-y-2 text-sm">
                    {order.items.map((item, i) => (
                        <li key={i} className="flex justify-between gap-4">
                            <span className="text-muted-foreground">
                                {item.name} × {item.quantity}
                            </span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                        </li>
                    ))}
                </ul>
                <Separator className="my-4" />
                <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">Delivery ({zoneLabel(order.deliveryZone)})</dt>
                        <dd>{formatPrice(order.deliveryFee)}</dd>
                    </div>
                    <div className="flex justify-between text-base font-bold">
                        <dt>Total (cash on delivery)</dt>
                        <dd>{formatPrice(order.total)}</dd>
                    </div>
                </dl>
                <p className="mt-4 text-xs text-muted-foreground">
                    Deliver to: {order.customerName}, {order.address}, {order.district}
                </p>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <Button asChild variant="outline" className="h-11 flex-1 rounded-lg">
                        <Link href="/account/orders">View my orders</Link>
                    </Button>
                    <Button asChild variant="ghost" className="h-11 flex-1 rounded-lg">
                        <Link href="/">Continue shopping</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

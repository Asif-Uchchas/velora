import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMyProfile } from "@/actions/user";
import { getStoreSettings, orderEmailFor } from "@/lib/settings";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
    const profile = await getMyProfile();
    if (!profile) redirect("/login?callbackUrl=/checkout");

    const settings = await getStoreSettings();

    return (
        <CheckoutForm
            profile={{ name: profile.name ?? "", email: profile.email, phone: profile.phone }}
            fees={{ inside: settings.deliveryFeeInside, outside: settings.deliveryFeeOutside }}
            emailAvailable={Boolean(orderEmailFor(settings))}
        />
    );
}

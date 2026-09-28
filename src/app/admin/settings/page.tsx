import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSettings } from "@/actions/settings";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Store settings — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
    const settings = await getAdminSettings();
    if (!settings) redirect("/");

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">Store settings</h1>
                <p className="text-sm text-muted-foreground">Where orders are sent and what delivery costs.</p>
            </div>
            <SettingsForm
                initial={{
                    whatsappNumber: settings.whatsappNumber.replace(/^\+88/, ""),
                    orderEmail: settings.orderEmail ?? "",
                    deliveryFeeInside: settings.deliveryFeeInside,
                    deliveryFeeOutside: settings.deliveryFeeOutside,
                }}
                mailConfigured={Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)}
            />
        </div>
    );
}

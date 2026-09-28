"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateStoreSettings } from "@/actions/settings";

interface Props {
    initial: { whatsappNumber: string; orderEmail: string; deliveryFeeInside: number; deliveryFeeOutside: number };
    mailConfigured: boolean;
}

export function SettingsForm({ initial, mailConfigured }: Props) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);
        const result = await updateStoreSettings(new FormData(e.currentTarget));
        setSaving(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Settings saved");
        router.refresh();
    }

    return (
        <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
            <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-premium">
                <h2 className="font-semibold">Order notifications</h2>
                <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">Store WhatsApp number</Label>
                    <Input id="whatsappNumber" name="whatsappNumber" type="tel" required defaultValue={initial.whatsappNumber} placeholder="01XXXXXXXXX" className="h-11 rounded-lg" />
                    <p className="text-xs text-muted-foreground">WhatsApp orders are sent to this number.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="orderEmail">Order email</Label>
                    <Input id="orderEmail" name="orderEmail" type="email" defaultValue={initial.orderEmail} placeholder="orders@yourstore.com" className="h-11 rounded-lg" />
                    <p className="text-xs text-muted-foreground">
                        Email orders go here. Leave empty to hide the email option (unless GMAIL_USER is set).
                    </p>
                </div>
                {!mailConfigured && (
                    <p className="flex gap-2 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        No Gmail App Password is set, so &ldquo;Order by email&rdquo; opens the customer&apos;s own email app
                        addressed to the order email above. To have the site send the email itself, set GMAIL_USER and
                        GMAIL_APP_PASSWORD in Vercel.
                    </p>
                )}
            </section>

            <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-premium">
                <h2 className="font-semibold">Delivery charges (৳)</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="deliveryFeeInside">Inside Dhaka</Label>
                        <Input id="deliveryFeeInside" name="deliveryFeeInside" type="number" min={0} max={10000} required defaultValue={initial.deliveryFeeInside} className="h-11 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deliveryFeeOutside">Outside Dhaka</Label>
                        <Input id="deliveryFeeOutside" name="deliveryFeeOutside" type="number" min={0} max={10000} required defaultValue={initial.deliveryFeeOutside} className="h-11 rounded-lg" />
                    </div>
                </div>
            </section>

            <Button type="submit" disabled={saving} className="h-11 rounded-lg gradient-bg border-0 px-6 text-white hover:opacity-90">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save settings
            </Button>
        </form>
    );
}

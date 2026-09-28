"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMyProfile, updateProfile } from "@/actions/user";
import { safeRedirectPath } from "@/lib/utils";
import { toast } from "sonner";

function SettingsForm() {
    const { update } = useSession();
    const router = useRouter();
    const next = safeRedirectPath(useSearchParams().get("next"));
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<{ name: string | null; email: string; phone: string | null } | null>(null);

    useEffect(() => {
        getMyProfile().then(setProfile);
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateProfile(formData);

        if (result.error) {
            toast.error(result.error);
            setLoading(false);
            return;
        }

        toast.success("Profile updated");
        await update();
        setLoading(false);
        if (next) router.push(next);
    }

    if (!profile) {
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {next === "/checkout" && !profile.phone && (
                <p className="rounded-lg bg-primary/10 p-3 text-sm text-primary">
                    Add your WhatsApp number so the store can confirm your order, then you&apos;ll go straight back to checkout.
                </p>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    maxLength={80}
                    defaultValue={profile.name || ""}
                    className="h-11 rounded-lg"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp / mobile number</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    maxLength={20}
                    defaultValue={profile.phone?.replace(/^\+88/, "") || ""}
                    className="h-11 rounded-lg"
                />
                <p className="text-xs text-muted-foreground">
                    Needed to place orders. We only use it to confirm and deliver your orders.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled className="h-11 rounded-lg bg-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="rounded-lg gradient-bg border-0 text-white hover:opacity-90"
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {next === "/checkout" ? "Save and continue to checkout" : "Save Changes"}
            </Button>
        </form>
    );
}

export default function SettingsPage() {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
            <div className="max-w-md">
                <Suspense>
                    <SettingsForm />
                </Suspense>
            </div>
        </div>
    );
}

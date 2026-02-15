"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/actions/user";
import { toast } from "sonner";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateProfile(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Profile updated");
            await update();
        }
        setLoading(false);
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

            <div className="max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={session?.user?.name || ""}
                            className="h-11 rounded-lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={session?.user?.email || ""}
                            disabled
                            className="h-11 rounded-lg bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                            Email cannot be changed
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg gradient-bg border-0 text-white hover:opacity-90"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    );
}

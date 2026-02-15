"use client";

import { useRouter } from "next/navigation";
import { Users as UsersIcon, Shield, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserRole } from "@/actions/user";
import { toast } from "sonner";

interface UserData {
    id: string;
    name: string | null;
    email: string;
    role: string;
    image: string | null;
    createdAt: Date;
    _count: { orders: number };
}

export function UsersClient({ users }: { users: UserData[] }) {
    const router = useRouter();

    async function handleRoleToggle(userId: string, currentRole: string) {
        const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
        const result = await updateUserRole(userId, newRole as "ADMIN" | "CUSTOMER");
        if (result.error) toast.error(result.error);
        else {
            toast.success(`User role updated to ${newRole}`);
            router.refresh();
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">Users</h1>
                <p className="text-sm text-muted-foreground">
                    Manage user accounts and roles
                </p>
            </div>

            {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-4">
                        <UsersIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No users yet</h3>
                </div>
            ) : (
                <div className="grid gap-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-premium"
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="gradient-bg text-white text-sm">
                                    {user.name?.[0] || user.email[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                    {user.name || "—"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                </p>
                            </div>
                            <div className="text-right text-xs text-muted-foreground hidden sm:block">
                                <p>{user._count.orders} orders</p>
                                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                            <Badge
                                className={
                                    user.role === "ADMIN"
                                        ? "gradient-bg border-0 text-white"
                                        : "bg-muted text-muted-foreground border-0"
                                }
                            >
                                {user.role === "ADMIN" ? (
                                    <Shield className="mr-1 h-3 w-3" />
                                ) : (
                                    <User className="mr-1 h-3 w-3" />
                                )}
                                {user.role}
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-lg text-xs"
                                onClick={() => handleRoleToggle(user.id, user.role)}
                            >
                                {user.role === "ADMIN" ? "Demote" : "Promote"}
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

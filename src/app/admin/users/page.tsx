import { getUsers } from "@/actions/user";
import { UsersClient } from "./users-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Users — Admin" };

export default async function AdminUsersPage() {
    const users = await getUsers();
    return <UsersClient users={users} />;
}

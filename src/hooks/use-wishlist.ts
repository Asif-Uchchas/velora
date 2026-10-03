"use client";

import { useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { create } from "zustand";
import { toast } from "sonner";
import { getWishlistProductIds, toggleWishlist } from "@/actions/wishlist";

interface WishlistState {
    ids: string[];
    status: "idle" | "loading" | "ready";
    userId: string | null;
    load: (userId: string) => Promise<void>;
    reset: () => void;
    set: (productId: string, inList: boolean) => void;
}

// One shared copy for the whole page, so a grid of 30 cards makes one request, not 30.
const useWishlistStore = create<WishlistState>((set, get) => ({
    ids: [],
    status: "idle",
    userId: null,
    load: async (userId) => {
        if (get().userId === userId && get().status !== "idle") return;
        set({ status: "loading", userId });
        try {
            const ids = await getWishlistProductIds();
            if (get().userId === userId) set({ ids, status: "ready" });
        } catch {
            if (get().userId === userId) set({ status: "ready" });
        }
    },
    reset: () => set({ ids: [], status: "idle", userId: null }),
    set: (productId, inList) =>
        set((s) => ({
            ids: inList ? [...new Set([...s.ids, productId])] : s.ids.filter((id) => id !== productId),
        })),
}));

export function useWishlist() {
    const { data: session, status: authStatus } = useSession();
    const userId = session?.user?.id ?? null;
    const { ids, status, load, reset, set } = useWishlistStore();

    useEffect(() => {
        if (authStatus === "loading") return;
        if (userId) load(userId);
        else reset();
    }, [authStatus, userId, load, reset]);

    const toggleItem = useCallback(
        async (productId: string) => {
            if (!userId) {
                toast.error("Please sign in to save items");
                return { success: false, added: false };
            }
            const wasIn = useWishlistStore.getState().ids.includes(productId);
            set(productId, !wasIn); // optimistic
            try {
                const result = await toggleWishlist(productId);
                if ("error" in result && result.error) {
                    set(productId, wasIn);
                    toast.error(result.error);
                    return { success: false, added: false };
                }
                const added = Boolean(result.added);
                set(productId, added);
                toast.success(added ? "Saved to wishlist" : "Removed from wishlist");
                return { success: true, added };
            } catch {
                set(productId, wasIn);
                toast.error("Couldn't update your wishlist. Please try again.");
                return { success: false, added: false };
            }
        },
        [userId, set]
    );

    const isInWishlist = useCallback((productId: string) => ids.includes(productId), [ids]);

    return {
        wishlistItems: ids,
        isLoading: status === "loading",
        toggleItem,
        isInWishlist,
    };
}

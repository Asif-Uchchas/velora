"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Updates shop filters in the URL; the server component re-renders with new results. */
export function useShopQuery() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const update = useCallback(
        (changes: Record<string, string | null | undefined>) => {
            const params = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(changes)) {
                if (value === null || value === undefined || value === "") params.delete(key);
                else params.set(key, value);
            }
            params.delete("page");
            const qs = params.toString();
            startTransition(() => {
                router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
            });
        },
        [router, pathname, searchParams]
    );

    const clear = useCallback(() => {
        startTransition(() => router.replace(pathname, { scroll: false }));
    }, [router, pathname]);

    return { searchParams, update, clear, isPending };
}

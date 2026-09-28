"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** False during SSR and the hydration render, true afterwards (for localStorage-backed UI). */
export function useHydrated() {
    return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

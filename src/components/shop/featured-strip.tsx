"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "velora-featured-strip-hidden";

interface Props {
    products: Array<{ id: string; slug: string; name: string; images: string[] }>;
}

/** Slim, dismissible promo row above the product grid (replaces the old landing hero). */
export function FeaturedStrip({ products }: Props) {
    const [dismissed, setDismissed] = useState(false);
    const hiddenBefore = useSyncExternalStore(
        () => () => {},
        () => {
            try {
                return sessionStorage.getItem(STORAGE_KEY) === "1";
            } catch {
                return false; // storage unavailable: keep showing it
            }
        },
        () => false
    );

    if (dismissed || hiddenBefore || products.length === 0) return null;

    function dismiss() {
        setDismissed(true);
        try {
            sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
            // ignore
        }
    }

    return (
        <section
            aria-label="Featured"
            className="relative flex items-center gap-4 overflow-hidden rounded-2xl bg-[#1E1B4B] px-4 py-3 text-white sm:gap-6 sm:px-6 sm:py-4"
        >
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">This week</p>
                <p className="line-clamp-2 text-sm font-semibold leading-snug sm:truncate sm:text-lg">
                    Order on WhatsApp: confirmed fast, cash on delivery
                </p>
            </div>
            <div className="hidden gap-2 sm:flex">
                {products.slice(0, 3).map((p) => (
                    <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        className="relative h-14 w-14 overflow-hidden rounded-xl bg-indigo-900 ring-1 ring-white/10 transition-transform hover:scale-105"
                        title={p.name}
                    >
                        {p.images[0] && (
                            <Image src={p.images[0]} alt={p.name} fill sizes="56px" className="object-cover" />
                        )}
                    </Link>
                ))}
            </div>
            <Link
                href="/?featured=1"
                scroll={false}
                className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#1E1B4B] hover:bg-white/90 sm:px-4 sm:text-sm"
            >
                See featured
            </Link>
            <button
                type="button"
                onClick={dismiss}
                aria-label="Hide banner"
                className="shrink-0 rounded-lg p-2 text-indigo-300 hover:bg-white/10 hover:text-white"
            >
                <X className="h-4 w-4" />
            </button>
        </section>
    );
}

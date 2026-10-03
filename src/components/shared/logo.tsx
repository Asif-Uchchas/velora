import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className = "" }: { className?: string }) {
    return (
        <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label="Velora home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg font-display text-base font-semibold text-white">
                V
            </span>
            <span className="font-display text-xl font-medium tracking-[0.22em] text-foreground">VELORA</span>
        </Link>
    );
}

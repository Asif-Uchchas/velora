"use client";

import { useEffect } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    href: string;
    orderNumber: string;
    autoOpen: boolean;
    channel: "whatsapp" | "email";
}

/** Opens WhatsApp or the customer's email app with the order prefilled. */
export function SendOrderButton({ href, orderNumber, autoOpen, channel }: Props) {
    // Open automatically once per order; the button stays as a fallback
    // (and for when the user comes back to this page).
    useEffect(() => {
        if (!autoOpen) return;
        const key = `velora-${channel}-opened:${orderNumber}`;
        try {
            if (sessionStorage.getItem(key)) return;
            sessionStorage.setItem(key, "1");
        } catch {
            // storage unavailable: still open once
        }
        window.location.href = href;
    }, [autoOpen, href, orderNumber, channel]);

    const isWhatsApp = channel === "whatsapp";
    const Icon = isWhatsApp ? MessageCircle : Mail;

    return (
        <a
            href={href}
            {...(isWhatsApp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={cn(
                "flex h-12 w-full items-center justify-center gap-2 rounded-xl text-base font-semibold text-white transition",
                isWhatsApp ? "bg-green-700 hover:bg-green-800" : "gradient-bg hover:opacity-90"
            )}
        >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {isWhatsApp ? "Send order on WhatsApp" : "Send order by email"}
        </a>
    );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    const router = useRouter();
    
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in px-4">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                404
            </h1>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                Page not found
            </h2>
            <p className="mt-2 text-muted-foreground max-w-[500px]">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been
                moved, deleted, or never existed.
            </p>
            <div className="mt-8 flex gap-4">
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                </Button>
                <Link href="/">
                    <Button className="gradient-bg border-0 text-white hover:opacity-90">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}

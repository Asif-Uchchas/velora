import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
    return (
        <Link href="/" className={`flex items-center gap-2 ${className}`}>
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                <span className="text-sm font-bold text-white">V</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
                Vel<span className="gradient-text">ora</span>
            </span>
        </Link>
    );
}

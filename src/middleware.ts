import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        if (session.user.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Protect account routes
    if (pathname.startsWith("/account")) {
        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        if (session) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/account/:path*", "/login", "/register"],
};

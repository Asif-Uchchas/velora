import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Fixed-window rate limiter backed by Postgres, so limits hold across
 * serverless instances without extra infrastructure.
 * Returns true when the call is allowed.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
    // Single atomic upsert using only the database clock (UTC, matching Prisma's DateTime storage):
    // reset the window if it expired, otherwise increment.
    const rows = await prisma.$queryRaw<{ count: number }[]>`
        INSERT INTO "RateLimit" ("key", "count", "windowStart")
        VALUES (${key}, 1, (now() AT TIME ZONE 'UTC'))
        ON CONFLICT ("key") DO UPDATE SET
            "count" = CASE
                WHEN "RateLimit"."windowStart" < (now() AT TIME ZONE 'UTC') - make_interval(secs => ${windowSeconds})
                THEN 1 ELSE "RateLimit"."count" + 1 END,
            "windowStart" = CASE
                WHEN "RateLimit"."windowStart" < (now() AT TIME ZONE 'UTC') - make_interval(secs => ${windowSeconds})
                THEN (now() AT TIME ZONE 'UTC') ELSE "RateLimit"."windowStart" END
        RETURNING "count"
    `;

    return (rows[0]?.count ?? 1) <= limit;
}

/** Best-effort client IP from Vercel's forwarding headers. */
export async function clientIp(): Promise<string> {
    const h = await headers();
    return (
        h.get("x-real-ip") ||
        h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
    );
}

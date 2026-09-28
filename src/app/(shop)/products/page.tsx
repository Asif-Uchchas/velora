import { redirect } from "next/navigation";

interface Props {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// The shop now lives at "/". Keep old /products links (and their filters) working.
export default async function ProductsPage({ searchParams }: Props) {
    const params = await searchParams;
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (typeof value === "string") qs.set(key === "search" ? "q" : key, value);
    }
    const query = qs.toString();
    redirect(query ? `/?${query}` : "/");
}

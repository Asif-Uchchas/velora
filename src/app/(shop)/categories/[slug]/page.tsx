import { redirect } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

// Category browsing now lives in the main shop view with its filters.
export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    redirect(`/?category=${encodeURIComponent(slug)}`);
}

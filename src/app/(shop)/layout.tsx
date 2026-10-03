import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { getCategories } from "@/actions/category";

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const categories = await getCategories().catch(() => []);

    return (
        <div className="flex min-h-screen flex-col pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0">
            <Header categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))} />
            <main className="flex-1">{children}</main>
            <Footer />
            <BottomNav />
        </div>
    );
}

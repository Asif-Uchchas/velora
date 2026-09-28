import { CartSync } from "@/components/shared/cart-sync";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <CartSync />
            {children}
        </>
    );
}

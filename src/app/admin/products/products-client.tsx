"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Package, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createProduct, deleteProduct } from "@/actions/product";
import { formatPrice } from "@/lib/formatters";
import { toast } from "sonner";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    stock: number;
    isFeatured: boolean;
    isArchived: boolean;
    category: { name: string };
}

interface Category {
    id: string;
    name: string;
}

export function ProductsClient({
    products,
    categories,
}: {
    products: Product[];
    categories: Category[];
}) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.set("isFeatured", String(isFeatured));
        formData.set("isArchived", "false");

        const imageUrl = formData.get("imageUrl") as string;
        formData.set("images", JSON.stringify(imageUrl ? [imageUrl] : []));
        formData.delete("imageUrl");

        const result = await createProduct(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Product created");
            setDialogOpen(false);
            router.refresh();
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Archive this product?")) return;
        const result = await deleteProduct(id);
        if (result.error) toast.error(result.error);
        else {
            toast.success("Product archived");
            router.refresh();
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your product catalog
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-lg gradient-bg border-0 text-white hover:opacity-90">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input name="name" required className="rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea name="description" required className="rounded-lg" rows={3} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Price ($)</Label>
                                    <Input name="price" type="number" step="0.01" required className="rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Compare Price ($)</Label>
                                    <Input name="comparePrice" type="number" step="0.01" className="rounded-lg" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Stock</Label>
                                    <Input name="stock" type="number" required className="rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select name="categoryId" required>
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Image URL</Label>
                                <Input name="imageUrl" type="url" placeholder="https://..." className="rounded-lg" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Featured</Label>
                                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg gradient-bg border-0 text-white"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Product
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="max-w-sm rounded-lg"
            />

            {/* Product List */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-4">
                        <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No products found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {search ? "Try a different search term" : "Create your first product"}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filtered.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-premium"
                        >
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                                {product.images[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Package className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-sm truncate">{product.name}</h3>
                                    {product.isFeatured && (
                                        <Badge className="gradient-bg border-0 text-white text-[10px]">
                                            Featured
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {product.category.name} • Stock: {product.stock}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-sm">{formatPrice(product.price)}</p>
                                {product.comparePrice && (
                                    <p className="text-xs text-muted-foreground line-through">
                                        {formatPrice(product.comparePrice)}
                                    </p>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(product.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

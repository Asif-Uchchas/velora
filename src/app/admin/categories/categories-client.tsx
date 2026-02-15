"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, FolderTree, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createCategory, deleteCategory } from "@/actions/category";
import { toast } from "sonner";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    _count: { products: number };
}

export function CategoriesClient({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await createCategory(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Category created");
            setDialogOpen(false);
            router.refresh();
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this category?")) return;
        const result = await deleteCategory(id);
        if (result.error) toast.error(result.error);
        else {
            toast.success("Category deleted");
            router.refresh();
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage product categories
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-lg gradient-bg border-0 text-white hover:opacity-90">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input name="name" required className="rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description (optional)</Label>
                                <Textarea name="description" className="rounded-lg" rows={3} />
                            </div>
                            <div className="space-y-2">
                                <Label>Image URL (optional)</Label>
                                <Input name="image" type="url" placeholder="https://..." className="rounded-lg" />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg gradient-bg border-0 text-white"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Category
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-4">
                        <FolderTree className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No categories yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create your first product category
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="rounded-xl border bg-card p-6 shadow-premium hover-lift"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-medium">{category.name}</h3>
                                    {category.description && (
                                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                            {category.description}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-primary font-medium">
                                        {category._count.products} products
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleDelete(category.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

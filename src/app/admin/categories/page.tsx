import { getCategories } from "@/actions/category";
import { CategoriesClient } from "./categories-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
    const categories = await getCategories();
    return <CategoriesClient categories={categories} />;
}

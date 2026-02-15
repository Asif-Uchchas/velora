import { z } from "zod";

// Auth
export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// Product
export const productSchema = z.object({
    name: z.string().min(2, "Product name is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.coerce.number().positive("Price must be positive"),
    comparePrice: z.coerce.number().positive().optional().nullable(),
    images: z.array(z.string().url()).min(1, "At least one image is required"),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
    categoryId: z.string().min(1, "Category is required"),
    isFeatured: z.boolean().default(false),
    isArchived: z.boolean().default(false),
});

// Category
export const categorySchema = z.object({
    name: z.string().min(2, "Category name is required"),
    description: z.string().optional(),
    image: z.string().url().optional().nullable(),
});

// Cart
export const addToCartSchema = z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
    cartItemId: z.string().min(1),
    quantity: z.coerce.number().int().positive(),
});

// Order
export const updateOrderStatusSchema = z.object({
    orderId: z.string().min(1),
    status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

// Address
export const addressSchema = z.object({
    label: z.string().optional(),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    isDefault: z.boolean().default(false),
});

// Review
export const reviewSchema = z.object({
    productId: z.string().min(1),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().optional(),
});

// Profile
export const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
});

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;

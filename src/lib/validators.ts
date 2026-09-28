import { z } from "zod";
import { normalizeBdPhone } from "@/lib/phone";
import { BD_DISTRICTS } from "@/lib/districts";

// Optional BD mobile number: empty -> undefined, otherwise normalized to +8801XXXXXXXXX
const optionalBdPhone = z
    .string()
    .trim()
    .max(20)
    .optional()
    .transform((v, ctx) => {
        if (!v) return undefined;
        const phone = normalizeBdPhone(v);
        if (!phone) {
            ctx.addIssue({ code: "custom", message: "Enter a valid Bangladeshi mobile number (01XXXXXXXXX)" });
            return z.NEVER;
        }
        return phone;
    });

// Auth
export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email address").max(254),
    // Keep 6 here so accounts created before the 8-char rule can still sign in
    password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export const registerSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
    email: z.string().trim().toLowerCase().email("Invalid email address").max(254),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password is too long"),
    phone: optionalBdPhone,
});

// Product
export const productSchema = z.object({
    name: z.string().trim().min(2, "Product name is required").max(160),
    description: z.string().min(10, "Description must be at least 10 characters").max(10000),
    price: z.coerce.number().positive("Price must be positive").max(10_000_000),
    comparePrice: z.coerce.number().positive().max(10_000_000).optional().nullable(),
    images: z
        .array(z.string().url().startsWith("https://", "Image URLs must use https"))
        .min(1, "At least one image is required")
        .max(12),
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
    status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
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
    comment: z.string().max(2000).optional(),
});

// Profile
export const profileSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
    phone: optionalBdPhone,
});

// Checkout: the client only sends product ids + quantities; prices come from the DB.
export const placeOrderSchema = z.object({
    channel: z.enum(["WHATSAPP", "EMAIL"]),
    items: z
        .array(
            z.object({
                productId: z.string().min(1).max(64),
                quantity: z.number().int().min(1).max(20),
            })
        )
        .min(1, "Your cart is empty")
        .max(50, "Too many items in one order"),
    customerName: z.string().trim().min(2, "Enter your name").max(80),
    address: z.string().trim().min(8, "Enter your full address").max(300),
    district: z.enum(BD_DISTRICTS, { message: "Choose your district" }),
    note: z.string().trim().max(500).optional(),
});

export const storeSettingsSchema = z.object({
    whatsappNumber: z
        .string()
        .trim()
        .transform((v, ctx) => {
            const phone = normalizeBdPhone(v);
            if (!phone) {
                ctx.addIssue({ code: "custom", message: "Enter a valid Bangladeshi WhatsApp number" });
                return z.NEVER;
            }
            return phone;
        }),
    orderEmail: z
        .string()
        .trim()
        .toLowerCase()
        .max(254)
        .optional()
        .transform((v) => v || null)
        .pipe(z.string().email("Invalid email").nullable()),
    deliveryFeeInside: z.coerce.number().int().min(0).max(10000),
    deliveryFeeOutside: z.coerce.number().int().min(0).max(10000),
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
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

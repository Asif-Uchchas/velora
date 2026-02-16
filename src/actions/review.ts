"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { reviewSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createReview(data: {
  productId: string;
  rating: number;
  comment?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in to leave a review" };
  }

  // Validate input
  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Check if user has purchased the product
  const hasPurchased = await hasUserPurchasedProduct(data.productId);
  if (!hasPurchased) {
    return { error: "You can only review products you have purchased" };
  }

  // Check if user has already reviewed this product
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: data.productId,
      },
    },
  });

  if (existingReview) {
    // Update existing review
    const review = await prisma.review.update({
      where: { id: existingReview.id },
      data: {
        rating: data.rating,
        comment: data.comment || null,
      },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });

    revalidatePath(`/products/${data.productId}`);
    return {
      success: true,
      review: {
        ...review,
        createdAt: review.createdAt,
      },
    };
  }

  // Create new review
  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      productId: data.productId,
      rating: data.rating,
      comment: data.comment || null,
    },
    include: {
      user: {
        select: { name: true, image: true },
      },
    },
  });

  revalidatePath(`/products/${data.productId}`);
  return {
    success: true,
    review: {
      ...review,
      createdAt: review.createdAt,
    },
  };
}

export async function hasUserPurchasedProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      status: {
        in: ["DELIVERED", "SHIPPED"],
      },
    },
    include: {
      items: {
        where: {
          productId: productId,
        },
      },
    },
  });

  return orders.some((order) => order.items.length > 0);
}

export async function getUserReview(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const review = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: productId,
      },
    },
    include: {
      user: {
        select: { name: true, image: true },
      },
    },
  });

  if (!review) return null;

  return {
    ...review,
    createdAt: review.createdAt,
  };
}

export async function getProductReviews(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { name: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map((review) => ({
    ...review,
    createdAt: review.createdAt,
  }));
}

export async function deleteReview(reviewId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.userId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  revalidatePath(`/products/${review.productId}`);
  return { success: true };
}

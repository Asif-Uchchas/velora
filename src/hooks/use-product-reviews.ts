"use client";

import { useState, useEffect, useCallback } from "react";
import { createReview, hasUserPurchasedProduct, getUserReview } from "@/actions/review";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

export function useProductReviews(productId: string) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPurchaseAndReview = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has purchased the product
        const purchased = await hasUserPurchasedProduct(productId);
        setHasPurchased(purchased);

        // Check if user has already reviewed
        const existingReview = await getUserReview(productId);
        setUserReview(existingReview);
      } catch (error) {
        console.error("Failed to check purchase status:", error);
      }
    };

    checkPurchaseAndReview();
  }, [productId, session?.user]);

  const submitReview = useCallback(
    async (rating: number, comment: string) => {
      if (!session?.user) {
        toast.error("Please sign in to leave a review");
        return { success: false };
      }

      try {
        const result = await createReview({
          productId,
          rating,
          comment: comment || undefined,
        });

        if (result.error) {
          toast.error(result.error);
          return { success: false };
        }

        toast.success("Review submitted successfully!");
        
        // Update local state
        if (result.review) {
          setUserReview(result.review);
          setReviews((prev) => [result.review!, ...prev]);
        }

        return { success: true };
      } catch (error) {
        toast.error("Failed to submit review");
        return { success: false };
      }
    },
    [productId, session?.user]
  );

  return {
    reviews,
    hasPurchased,
    userReview,
    isLoading,
    submitReview,
  };
}

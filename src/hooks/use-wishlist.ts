"use client";

import { useState, useEffect, useCallback } from "react";
import { toggleWishlist, getWishlist } from "@/actions/wishlist";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  productId: string;
}

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist on mount
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const wishlist = await getWishlist();
        if (wishlist) {
          setWishlistItems(wishlist.items.map((item) => item.productId));
        }
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const toggleItem = useCallback(async (productId: string) => {
    try {
      const result = await toggleWishlist(productId);
      
      if (result.error) {
        toast.error(result.error);
        return { success: false, added: false };
      }

      if (result.added) {
        setWishlistItems((prev) => [...prev, productId]);
        toast.success("Added to wishlist!", {
          icon: "❤️",
        });
      } else {
        setWishlistItems((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from wishlist", {
          icon: "💔",
        });
      }

      return { success: true, added: result.added };
    } catch (error) {
      toast.error("Failed to update wishlist");
      return { success: false, added: false };
    }
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlistItems.includes(productId),
    [wishlistItems]
  );

  return {
    wishlistItems,
    isLoading,
    toggleItem,
    isInWishlist,
  };
}

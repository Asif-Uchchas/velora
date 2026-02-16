"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, X, MessageCircle, ThumbsUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useProductReviews } from "@/hooks/use-product-reviews";

interface ReviewSectionProps {
  productId: string;
  initialReviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: {
      name: string | null;
      image: string | null;
    };
  }>;
  averageRating: number;
  totalReviews: number;
}

export function ReviewSection({
  productId,
  initialReviews,
  averageRating,
  totalReviews,
}: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { hasPurchased, userReview, submitReview } = useProductReviews(productId);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    const result = await submitReview(rating, comment);
    setIsSubmitting(false);

    if (result.success) {
      setIsWritingReview(false);
      setRating(0);
      setComment("");
      // Refresh reviews
      window.location.reload();
    }
  };

  return (
    <section className="mt-16 sm:mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Customer Reviews</h2>
          <p className="text-muted-foreground mt-1">
            {totalReviews === 0
              ? "No reviews yet"
              : `${totalReviews} ${totalReviews === 1 ? "review" : "reviews"} • Average rating: ${averageRating.toFixed(1)}`}
          </p>
        </div>

        {session?.user && hasPurchased && !userReview && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setIsWritingReview(true)}
              className="gradient-bg text-white rounded-xl"
            >
              <Star className="w-4 h-4 mr-2" />
              Write a Review
            </Button>
          </motion.div>
        )}

        {session?.user && hasPurchased && userReview && (
          <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg">
            ✓ You have already reviewed this product
          </div>
        )}

        {session?.user && !hasPurchased && (
          <div className="text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Purchase to review
          </div>
        )}
      </div>

      {/* Write Review Form */}
      {isWritingReview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-card border rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Write Your Review</h3>
            <button
              onClick={() => setIsWritingReview(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Rating Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Review (optional)
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="min-h-[120px] rounded-xl"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting || rating === 0}
                className="gradient-bg text-white rounded-xl"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsWritingReview(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reviews Grid */}
      {reviews.length > 0 ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-2xl">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
          <p className="text-muted-foreground">
            Be the first to review this product after purchasing!
          </p>
        </div>
      )}
    </section>
  );
}

function ReviewCard({
  review,
  index,
}: {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: {
      name: string | null;
      image: string | null;
    };
  };
  index: number;
}) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0">
          {review.user.image ? (
            <img
              src={review.user.image}
              alt={review.user.name || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
              {review.user.name?.[0] || "?"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{review.user.name || "Anonymous"}</p>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {review.comment && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {review.comment}
        </p>
      )}

      {/* Helpful Button */}
      <div className="flex items-center gap-2 pt-3 border-t">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-colors ${
            liked
              ? "bg-primary/10 text-primary"
              : "hover:bg-muted text-muted-foreground"
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
          Helpful
        </motion.button>
      </div>
    </motion.div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { reviewsApi, Review, ReviewsResponse } from '@/services/reviewsApi';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reviewsApi.getReviews(productId);
      setReviewsData(data);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validation
    if (rating === 0) {
      setFormError('Please select a rating');
      return;
    }
    if (!reviewText.trim()) {
      setFormError('Please write a review');
      return;
    }
    
    try {
      setSubmitting(true);
      await reviewsApi.createReview({
        productId,
        rating,
        text: reviewText,
      });
      
      // Reset form
      setRating(0);
      setReviewText('');
      
      // Refresh reviews
      await fetchReviews();
      toast.success('Review submitted successfully!');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-muted"></div>
        <div className="h-24 rounded bg-muted"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={fetchReviews} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <section className="mt-16">
      <h2 className="mb-8 text-2xl font-bold text-foreground">Ratings & Reviews</h2>
      
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 text-center">
              <span className="text-5xl font-bold text-foreground">
                {reviewsData?.averageRating.toFixed(1) || '0.0'}
              </span>
              <span className="text-2xl text-muted-foreground">/5</span>
            </div>
            <div className="mb-2 flex justify-center">
              <StarRating rating={reviewsData?.averageRating || 0} size="lg" />
            </div>
            <p className="text-center text-muted-foreground">
              Based on {reviewsData?.totalReviews || 0} review{reviewsData?.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Reviews List & Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Review Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-foreground">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Your Rating
                </label>
                <StarRating
                  rating={rating}
                  interactive
                  onChange={setRating}
                  size="lg"
                />
              </div>
              
              <div>
                <label htmlFor="review-text" className="mb-2 block text-sm font-medium text-foreground">
                  Your Review
                </label>
                <Textarea
                  id="review-text"
                  placeholder="Share your experience with this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  className="resize-none"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {reviewText.length}/1000 characters
                </p>
              </div>
              
              {formError && (
                <p className="text-sm text-destructive" role="alert">
                  {formError}
                </p>
              )}
              
              <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </motion.div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsData?.reviews.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              reviewsData?.reviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

interface ReviewCardProps {
  review: Review;
  index: number;
}

const ReviewCard = ({ review, index }: ReviewCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{review.userName}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(review.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
      <p className="text-muted-foreground">{review.text}</p>
    </motion.div>
  );
};

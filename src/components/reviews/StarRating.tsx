import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export const StarRating = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: StarRatingProps) => {
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (!interactive || !onChange) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(index + 1);
    } else if (e.key === 'ArrowRight' && index < maxRating - 1) {
      e.preventDefault();
      onChange(Math.min(rating + 1, maxRating));
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      onChange(Math.max(rating - 1, 1));
    }
  };

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Rate this product' : `Rating: ${rating} out of ${maxRating} stars`}
    >
      {[...Array(maxRating)].map((_, index) => {
        const isFilled = index < Math.floor(rating);
        const isPartial = index === Math.floor(rating) && rating % 1 > 0;
        
        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(index + 1)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={cn(
              'relative transition-transform',
              interactive && 'cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded',
              !interactive && 'cursor-default'
            )}
            role={interactive ? 'radio' : undefined}
            aria-checked={interactive ? index + 1 === rating : undefined}
            aria-label={interactive ? `${index + 1} star${index + 1 !== 1 ? 's' : ''}` : undefined}
            tabIndex={interactive ? (index + 1 === rating || (rating === 0 && index === 0) ? 0 : -1) : -1}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled || isPartial
                  ? 'fill-warning text-warning'
                  : 'fill-muted/30 text-muted'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

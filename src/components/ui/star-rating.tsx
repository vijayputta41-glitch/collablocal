import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

export function StarRating({ rating, size = 16, showValue = true }: StarRatingProps) {
  const fullStars = Math.floor(rating);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

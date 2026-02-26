import { useTranslation } from '@/contexts/TranslationContext';
import type { Product } from '@shared/schema';

interface ReviewsSectionProps {
  product: Product;
}

export function ReviewsSection({ product }: ReviewsSectionProps) {
  const { t } = useTranslation();
  const displayedReviews = product.reviews.slice(0, 6);
  
  return (
    <div className="border-t border-tiktok-border bg-white px-4 py-6" data-testid="section-reviews">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-tiktok-black">
          {t.ratingsAndReviews} ({product.reviewCount})
        </h2>
        <button className="text-sm text-blue-600 hover:underline font-semibold" data-testid="button-write-review">
          {t.writeReview}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-xs text-tiktok-black w-2">{stars}</span>
              <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-tiktok-black h-full"
                  style={{ width: `${product.ratingDistribution[stars as keyof typeof product.ratingDistribution]}%` }}
                  data-testid={`rating-bar-${stars}`}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-tiktok-black mb-1">{product.rating}</div>
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-lg ${i < Math.floor(product.rating) ? 'text-[#FF2A52]' : 'text-gray-300'}`}>★</span>
            ))}
          </div>
          <p className="text-xs text-tiktok-gray">{product.reviewCount} {t.reviewsText}*</p>
        </div>
      </div>
      
      <p className="text-xs text-tiktok-gray mb-4">
        {t.reviewsDisclaimer}
      </p>
      
      <div className="mb-6">
        <h3 className="text-sm text-tiktok-gray mb-3">{t.imagesFromReviews}</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {product.reviewImages.slice(0, 9).map((img, idx) => (
            <img 
              key={idx}
              src={img}
              alt={`Customer photo ${idx + 1}`}
              className="w-[calc(33.333%-0.333rem)] flex-shrink-0 aspect-square object-cover rounded snap-start"
              data-testid={`review-photo-${idx}`}
            />
          ))}
        </div>
      </div>
      
      <p className="text-xs text-tiktok-gray mb-4" data-testid="text-viewing-count">
        Viewing 1-{displayedReviews.length} of {product.reviewCount} reviews
      </p>
      
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0" data-testid={`review-${review.id}`}>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-base ${i < review.rating ? 'text-[#FF2A52]' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            
            <h4 className="font-semibold text-sm text-tiktok-black mb-2">{review.title}</h4>
            
            <p className="text-xs text-tiktok-gray mb-3">
              {review.author} · {review.date}
            </p>
            
            <p className="text-sm text-tiktok-black mb-3 leading-relaxed">{review.content}</p>
            
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto mb-3">
                {review.images.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img}
                    alt={`Review photo ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded border border-gray-200"
                    data-testid={`review-image-${review.id}-${idx}`}
                  />
                ))}
              </div>
            )}
            
            {review.verifiedPurchase && (
              <p className="text-xs text-tiktok-gray mb-2">
                <span className="font-semibold">{t.verifiedPurchase}</span>
              </p>
            )}
            
            <p className="text-xs text-tiktok-gray">{review.helpful} {t.peopleFoundHelpful}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

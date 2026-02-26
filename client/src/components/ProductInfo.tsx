import { Star, Heart } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface ProductInfoProps {
  brand: string;
  name: string;
  rating: number;
  reviewCount: number;
  lovesCount: string;
  price: number;
  originalValue: number;
  installmentPrice: number;
  installmentCount: number;
  inStock: boolean;
}

export function ProductInfo({
  brand,
  name,
  rating,
  reviewCount,
  lovesCount,
  price,
  originalValue,
  installmentPrice,
  installmentCount,
  inStock
}: ProductInfoProps) {
  const { t } = useTranslation();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => {
      const isFilled = index < Math.floor(rating);
      
      return (
        <Star
          key={index}
          className={`w-4 h-4 ${
            isFilled
              ? 'fill-[#FF2A52] text-[#FF2A52]'
              : 'fill-none text-gray-300'
          }`}
        />
      );
    });
  };

  return (
    <div className="px-4 pt-4 pb-4 space-y-3 bg-white" data-testid="product-info">
      <div className="space-y-2">
        <div className="inline-block">
          <span
            className="text-[10px] font-bold px-2.5 py-1 bg-[#FF2A52] text-white"
            style={{ borderRadius: '2px' }}
          >
            AMOSTRA GRÁTIS
          </span>
        </div>

        <h2 className="text-[13px] font-bold text-black" data-testid="text-brand">
          {brand}
        </h2>
        
        <h1 className="text-[16px] leading-[1.3] font-normal text-black" data-testid="text-product-name">
          {name}
        </h1>
        
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <div className="flex items-center gap-1">
            {renderStars(rating)}
            <span className="text-black font-semibold ml-1" data-testid="text-review-count">{reviewCount}</span>
          </div>
          <button 
            className="flex items-center gap-1 hover:opacity-70 transition-opacity"
            data-testid="button-loves"
          >
            <Heart className="w-4 h-4 text-[#FF2A52]" />
            <span className="font-semibold text-black" data-testid="text-loves-count">{lovesCount} {t.loves}</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="font-bold text-[#FF2A52]" data-testid="text-price">
          <span className="text-[14px]">R$ </span>
          <span className="text-[22px]">0</span>
          <span className="text-[14px] font-normal">,00</span>
        </span>
        <span className="text-[14px] text-gray-400/70 line-through">
          R${price.toFixed(2).replace('.', ',')}
        </span>
      </div>
    </div>
  );
}

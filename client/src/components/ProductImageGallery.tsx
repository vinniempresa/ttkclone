import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import type { ProductImage } from '@shared/schema';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const VISIBLE_DOTS = 5;

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const itemWidth = containerWidth * 0.75 + 12; // 75% width + gap
      const index = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(Math.min(index, images.length - 1));
    }
  };

  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const itemWidth = containerWidth * 0.75 + 12; // 75% width + gap
      scrollContainerRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  const getVisibleDotIndices = () => {
    const totalImages = images.length;
    if (totalImages <= VISIBLE_DOTS) {
      return images.map((_, i) => i);
    }
    
    const start = Math.max(0, Math.min(currentIndex - Math.floor(VISIBLE_DOTS / 2), totalImages - VISIBLE_DOTS));
    return Array.from({ length: VISIBLE_DOTS }, (_, i) => start + i);
  };

  const visibleDots = getVisibleDotIndices();

  return (
    <div className="w-full bg-white relative overflow-hidden">
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto snap-x snap-mandatory scrollbar-hide flex gap-3 scroll-smooth px-4"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          data-testid="gallery-main"
        >
          {images.map((image, index) => (
            <div 
              key={index}
              className="flex-shrink-0 snap-start relative"
              style={{ width: '75%', aspectRatio: '1/1' }}
            >
              <div className="w-full h-full rounded overflow-hidden bg-white shadow-lg">
                {image.type === 'video' ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={image.url}
                      alt={`${productName} - Video thumbnail`}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      data-testid={`img-product-video-${index}`}
                    />
                    <button 
                      className="absolute inset-0 flex items-center justify-center hover:opacity-90 transition-opacity"
                      data-testid={`button-play-video-${index}`}
                      aria-label={t.playVideo}
                    >
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-tiktok-black ml-0.5" fill="currentColor" />
                      </div>
                    </button>
                  </div>
                ) : (
                  <img 
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-contain p-4"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    data-testid={`img-product-${index}`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="absolute top-2 right-4 flex gap-0.5 z-10" data-testid="gallery-dots">
          {visibleDots.map((dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => scrollToImage(dotIndex)}
              className={`rounded-full transition-all focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-1 ${
                currentIndex === dotIndex 
                  ? 'bg-tiktok-black w-3 h-1' 
                  : 'bg-gray-400 w-1 h-1'
              }`}
              data-testid={`dot-${dotIndex}`}
              aria-label={`${t.goToImage} ${dotIndex + 1}`}
              aria-current={currentIndex === dotIndex ? 'true' : undefined}
              aria-pressed={currentIndex === dotIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

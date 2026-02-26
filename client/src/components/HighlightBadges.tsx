import type { Highlight } from '@shared/schema';
import { useTranslation } from '@/contexts/TranslationContext';

interface HighlightBadgesProps {
  highlights: Highlight[];
}

export function HighlightBadges({ highlights }: HighlightBadgesProps) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white py-6">
      <div className="px-4 pt-6 border-t border-tiktok-border mx-4">
        <h2 className="text-[16px] font-semibold text-tiktok-black mb-4">{t.highlights}</h2>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {highlights.map((highlight, index) => (
            <button 
              key={index}
              className="flex flex-col items-center gap-2 min-w-[80px] hover:opacity-70 transition-opacity"
              data-testid={`button-highlight-${index}`}
              aria-label={highlight.label}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src={highlight.icon} 
                  alt={highlight.label}
                  className="w-10 h-10"
                  data-testid={`icon-highlight-${index}`}
                />
              </div>
              <span className="text-[11px] text-center text-tiktok-black leading-tight" data-testid={`text-highlight-label-${index}`}>
                {highlight.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-tiktok-border mx-4 mt-6"></div>
    </div>
  );
}

import { ChevronRight } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

export function Breadcrumb() {
  const { t } = useTranslation();
  
  return (
    <nav className="px-4 pt-2 pb-1 bg-white text-xs flex items-center gap-1 text-tiktok-gray opacity-70">
      <a 
        href="#" 
        className="hover:underline"
        data-testid="link-breadcrumb-makeup"
      >
        {t.makeup}
      </a>
      <ChevronRight className="w-3 h-3" />
      <a 
        href="#" 
        className="hover:underline"
        data-testid="link-breadcrumb-value-sets"
      >
        {t.valueGiftSets}
      </a>
    </nav>
  );
}

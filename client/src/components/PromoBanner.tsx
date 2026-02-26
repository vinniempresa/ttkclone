import { useTranslation } from '@/contexts/TranslationContext';

export function PromoBanner() {
  const { t } = useTranslation();
  
  return (
    <div className="bg-[#FF2A52] text-white text-center px-4 py-1.5 text-sm">
      <p data-testid="text-promo">
        Escolha até <strong>3 produtos</strong> totalmente <strong>GRÁTIS</strong>!
      </p>
    </div>
  );
}

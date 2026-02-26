import { createContext, useContext, ReactNode } from 'react';
import { getTranslations, type Translations, type LanguageCode } from '@/lib/translations';

interface TranslationContextType {
  language: LanguageCode;
  t: Translations;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const language: LanguageCode = 'pt';
  const t = getTranslations(language);

  return (
    <TranslationContext.Provider
      value={{
        language,
        t,
        isLoading: false
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

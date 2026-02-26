import { createContext, useContext, ReactNode } from 'react';
import { currencyService, BRL_CURRENCY, type CurrencyInfo, type ConversionResult } from '@/lib/currency';

interface CurrencyContextType {
  currency: CurrencyInfo;
  baseCurrency: CurrencyInfo;
  convertPrice: (amount: number) => Promise<ConversionResult>;
  formatPrice: (result: ConversionResult) => string;
  isLoading: boolean;
  countryCode: string | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const convertPrice = async (amount: number): Promise<ConversionResult> => {
    return { value: amount, currency: 'BRL', success: true };
  };

  const formatPrice = (result: ConversionResult): string => {
    return currencyService.formatPrice(result.value);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency: BRL_CURRENCY,
        baseCurrency: BRL_CURRENCY,
        convertPrice,
        formatPrice,
        isLoading: false,
        countryCode: 'BR'
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  symbolPosition: 'before' | 'after';
}

export interface ConversionRates {
  [currency: string]: number;
}

export interface ConversionResult {
  value: number;
  currency: string;
  success: boolean;
}

export const BRL_CURRENCY: CurrencyInfo = {
  code: 'BRL',
  symbol: 'R$',
  name: 'Real Brasileiro',
  symbolPosition: 'before'
};

class CurrencyService {
  async convert(amount: number, _fromCurrency: string, _toCurrency: string): Promise<ConversionResult> {
    return { value: amount, currency: 'BRL', success: true };
  }

  formatPrice(amount: number, _currencyCode?: string): string {
    const formatted = amount.toFixed(2).replace('.', ',');
    return `R$${formatted}`;
  }

  getCurrencyForCountry(_countryCode: string): CurrencyInfo {
    return BRL_CURRENCY;
  }

  async fetchRates(): Promise<ConversionRates> {
    return { BRL: 1.0 };
  }

  clearCache(): void {}
}

export const currencyService = new CurrencyService();

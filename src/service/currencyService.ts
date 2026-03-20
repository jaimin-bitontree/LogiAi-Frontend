export type ExchangeRates = Record<string, number>;

export const FALLBACK_RATES: ExchangeRates = {
  USD: 1.0,
  EUR: 1.08,
  GBP: 1.27,
  INR: 0.012,
  CNY: 0.138,
  JPY: 0.0067,
  AED: 0.272,
  SGD: 0.745,
};

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  const response = await fetch(
    "https://api.frankfurter.app/latest?from=USD",
    { signal: AbortSignal.timeout(5000) }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch rates: ${response.status}`);
  }

  const data = await response.json();

  // Add USD itself — frankfurter omits the base currency
  return { USD: 1.0, ...data.rates };
}

/**
 * Converts any amount + currency to USD.
 * frankfurter rates: 1 USD = X foreign → foreign to USD = value / rate
 *
 * Example: toUSD("500", "EUR", { EUR: 0.92 }) → 543.48
 */
export function toUSD(
  amount: string | number,
  currency: string,
  rates: ExchangeRates
): number {
  const value = parseFloat(String(amount));
  if (isNaN(value)) return 0;
  if (currency === "USD") return value;

  const rate = rates[currency];
  if (!rate) {
    console.warn(`[CurrencyService] No rate for ${currency}, skipping`);
    return 0;
  }

  return value / rate;
}
// hooks/useCurrencyRates.ts

import { useQuery } from "@tanstack/react-query";
import {
  fetchExchangeRates,
  FALLBACK_RATES,
  type ExchangeRates,
} from "../service/currencyService";

export function useCurrencyRates() {
  const { data, isLoading, isError } = useQuery<ExchangeRates>({
    queryKey: ["exchangeRates"],        // unique key — TanStack caches by this
    queryFn: fetchExchangeRates,
    staleTime: 1000 * 60 * 60,          // treat rates as fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24,        // keep in cache for 24 hours
    retry: 2,                           // retry twice before giving up
    placeholderData: FALLBACK_RATES,    // use fallback while loading
  });

  return {
    rates: data ?? FALLBACK_RATES,      // always returns something safe
    isLoading,
    isError,
  };
}
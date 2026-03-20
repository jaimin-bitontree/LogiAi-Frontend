import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { fetchExchangeRates } from './service/currencyService'
import { AuthProvider } from './context/AuthContext'
import { HashRouter } from "react-router-dom";

const queryClient = new QueryClient()

void queryClient
  .prefetchQuery({
    queryKey: ['exchangeRates'],
    queryFn: fetchExchangeRates,
    staleTime: 1000 * 60 * 60,
  })
  .catch(() => {
    // The dashboard hook already falls back to static rates.
  })

createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <HashRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </HashRouter>
</StrictMode>
)

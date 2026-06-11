import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PortfolioData } from "@/lib/types";
import { SEED_FALLBACK } from "@/lib/seedFallback";

interface PortfolioContextValue {
  data: PortfolioData;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["portfolio"],
    queryFn: api.getPortfolio,
    staleTime: 60_000,
    retry: 1,
    placeholderData: SEED_FALLBACK,
  });

  return (
    <PortfolioContext.Provider
      value={{
        data: data ?? SEED_FALLBACK,
        isLoading,
        isError,
        refetch,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}

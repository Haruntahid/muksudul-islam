import type { PortfolioData } from "./types";
import { toPortfolioFallback } from "./transformPortfolio";

export const SEED_FALLBACK: PortfolioData = toPortfolioFallback();

import { Currency } from '../types';
import { CURRENCY_RATES } from '../data/mockData';

export function getCurrencySymbol(currency: Currency): string {
  const found = CURRENCY_RATES.find((c) => c.code === currency);
  return found ? found.symbol : '$';
}

/**
 * Format amount with currency symbol and locale separators
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

  return `${symbol}${formattedNumber}`;
}

/**
 * Convert an amount from source currency to target currency
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = CURRENCY_RATES.find((c) => c.code === fromCurrency)?.rateToUsd || 1;
  const toRate = CURRENCY_RATES.find((c) => c.code === toCurrency)?.rateToUsd || 1;

  // Convert source to USD first, then USD to target
  const amountInUsd = amount / fromRate;
  return amountInUsd * toRate;
}

/**
 * Helper to display progress percentage safely capped at 100
 */
export function calculateProgress(raised: number, goal: number): number {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

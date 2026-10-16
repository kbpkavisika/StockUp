import type { Item } from '../types/item';

export type StockStatus = 'in' | 'low' | 'out';

export const stockStatus = (item: Pick<Item, 'quantity' | 'low_stock_threshold'>): StockStatus => {
  if (item.quantity <= 0) return 'out';
  if (item.quantity <= item.low_stock_threshold) return 'low';
  return 'in';
};

export const STOCK_LABELS: Record<StockStatus, string> = {
  in: 'In stock',
  low: 'Low stock',
  out: 'Out of stock',
};

const priceFormat = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const quantityFormat = new Intl.NumberFormat();

export const formatPrice = (cents: number | null) => (cents === null ? '—' : priceFormat.format(cents / 100));

export const formatQuantity = (quantity: number) => quantityFormat.format(quantity);

/** Editable text for a price field, e.g. 1250 → "12.50" */
export const priceToInput = (cents: number | null) => (cents === null ? '' : (cents / 100).toFixed(2));

/** "12", "12.5" or "12.50" → cents; "" → null; anything else → undefined (invalid) */
export const parsePrice = (text: string): number | null | undefined => {
  const value = text.trim().replace(/,/g, '');
  if (value === '') return null;
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return undefined;
  return Math.round(Number(value) * 100);
};

/** Whole numbers ≥ 0 only; anything else → undefined (invalid) */
export const parseCount = (text: string): number | undefined => {
  const value = text.trim().replace(/,/g, '');
  if (!/^\d+$/.test(value)) return undefined;
  const count = Number(value);
  return Number.isSafeInteger(count) ? count : undefined;
};

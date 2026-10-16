/** Same shape as desktop_app/src/backend/database.ts so both apps share one data model */
export interface Item {
  id: number;
  name: string;
  description: string;
  sku: string | null;
  quantity: number;
  /** Stored in cents to avoid floating-point rounding; null when no price is set */
  price_cents: number | null;
  category: string | null;
  /** Quantity at or below which the item counts as low stock */
  low_stock_threshold: number;
  timestamp: string;
}

export interface ItemInput {
  name: string;
  description: string;
  sku: string | null;
  quantity: number;
  priceCents: number | null;
  category: string | null;
  lowStockThreshold: number;
}

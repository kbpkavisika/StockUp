import type { Item } from '../types/item';

export type SortKey = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'quantity-asc' | 'quantity-desc' | 'price-asc' | 'price-desc';

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'name-asc', label: 'Name A–Z' },
  { key: 'name-desc', label: 'Name Z–A' },
  { key: 'quantity-asc', label: 'Lowest stock' },
  { key: 'quantity-desc', label: 'Highest stock' },
  { key: 'price-asc', label: 'Lowest price' },
  { key: 'price-desc', label: 'Highest price' },
];

const byName = (a: Item, b: Item) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true });
const byTime = (a: Item, b: Item) => a.timestamp.localeCompare(b.timestamp) || a.id - b.id;
const byQuantity = (a: Item, b: Item) => a.quantity - b.quantity || byName(a, b);
// Items without a price always sort last
const byPrice = (direction: 1 | -1) => (a: Item, b: Item) => {
  if (a.price_cents === null || b.price_cents === null) {
    return (a.price_cents === null ? 1 : 0) - (b.price_cents === null ? 1 : 0) || byName(a, b);
  }
  return direction * (a.price_cents - b.price_cents) || byName(a, b);
};

const comparators: Record<SortKey, (a: Item, b: Item) => number> = {
  newest: (a, b) => byTime(b, a),
  oldest: byTime,
  'name-asc': byName,
  'name-desc': (a, b) => byName(b, a),
  'quantity-asc': byQuantity,
  'quantity-desc': (a, b) => byQuantity(b, a),
  'price-asc': byPrice(1),
  'price-desc': byPrice(-1),
};

export const sortItems = (items: Item[], key: SortKey) => [...items].sort(comparators[key]);

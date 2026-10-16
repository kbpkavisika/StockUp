import type { Item } from '../../backend/database';

export type SortKey = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'name-asc', label: 'Name A–Z' },
  { key: 'name-desc', label: 'Name Z–A' },
];

const byName = (a: Item, b: Item) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true });
const byTime = (a: Item, b: Item) => a.timestamp.localeCompare(b.timestamp) || a.id - b.id;

const comparators: Record<SortKey, (a: Item, b: Item) => number> = {
  newest: (a, b) => byTime(b, a),
  oldest: byTime,
  'name-asc': byName,
  'name-desc': (a, b) => byName(b, a),
};

export const sortItems = (items: Item[], key: SortKey) => [...items].sort(comparators[key]);

export type Density = 'comfortable' | 'compact';

export const readDensity = (): Density => {
  try {
    return localStorage.getItem('tableDensity') === 'compact' ? 'compact' : 'comfortable';
  } catch {
    return 'comfortable';
  }
};

export const saveDensity = (density: Density) => {
  try {
    localStorage.setItem('tableDensity', density);
  } catch {
    // Preference just won't persist
  }
};

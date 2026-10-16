import { openDatabaseSync } from 'expo-sqlite';
import type { Item, ItemInput } from '../types/item';

const db = openDatabaseSync('items.db');

/**
 * Schema migrations, applied in order. PRAGMA user_version records how many have run,
 * so append new entries here — never edit or reorder existing ones.
 */
const migrations: string[] = [
  // 1 — original schema (IF NOT EXISTS so databases from before migrations upgrade cleanly)
  `CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
   CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);`,
  // 2 — match the desktop schema: title → name, plus stock fields
  `ALTER TABLE items RENAME COLUMN title TO name;
   ALTER TABLE items ADD COLUMN sku TEXT;
   ALTER TABLE items ADD COLUMN quantity INTEGER NOT NULL DEFAULT 0;
   ALTER TABLE items ADD COLUMN price_cents INTEGER;
   ALTER TABLE items ADD COLUMN category TEXT;
   ALTER TABLE items ADD COLUMN low_stock_threshold INTEGER NOT NULL DEFAULT 5;
   CREATE UNIQUE INDEX items_sku_unique ON items(sku COLLATE NOCASE) WHERE sku IS NOT NULL;`,
];

function migrate() {
  const applied = db.getFirstSync<{ user_version: number }>('PRAGMA user_version;')?.user_version ?? 0;
  if (applied >= migrations.length) return;
  db.withTransactionSync(() => {
    migrations.slice(applied).forEach((sql) => db.execSync(sql));
    db.execSync(`PRAGMA user_version = ${migrations.length};`);
  });
}

migrate();

// Lets screens refresh when data changes elsewhere (e.g. Undo from a toast after leaving the form)
const listeners = new Set<() => void>();

export function subscribeToItems(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const notify = () => listeners.forEach((listener) => listener());

const toRow = (input: ItemInput) => [
  input.name,
  input.description,
  input.sku,
  input.quantity,
  input.priceCents,
  input.category,
  input.lowStockThreshold,
];

export function getItems(searchQuery = ''): Item[] {
  const query = searchQuery.trim();
  if (!query) {
    return db.getAllSync<Item>('SELECT * FROM items ORDER BY timestamp DESC, id DESC;');
  }
  const pattern = `%${query}%`;
  return db.getAllSync<Item>(
    'SELECT * FROM items WHERE name LIKE ? OR description LIKE ? OR sku LIKE ? OR category LIKE ? ORDER BY timestamp DESC, id DESC;',
    [pattern, pattern, pattern, pattern],
  );
}

export function getItem(id: number): Item | null {
  return db.getFirstSync<Item>('SELECT * FROM items WHERE id = ?;', [id]);
}

export function addItem(input: ItemInput) {
  db.runSync(
    'INSERT INTO items (name, description, sku, quantity, price_cents, category, low_stock_threshold) VALUES (?, ?, ?, ?, ?, ?, ?);',
    toRow(input),
  );
  notify();
}

export function updateItem(id: number, input: ItemInput) {
  db.runSync(
    'UPDATE items SET name = ?, description = ?, sku = ?, quantity = ?, price_cents = ?, category = ?, low_stock_threshold = ? WHERE id = ?;',
    [...toRow(input), id],
  );
  notify();
}

export function deleteItem(id: number) {
  db.runSync('DELETE FROM items WHERE id = ?;', [id]);
  notify();
}

/** Re-inserts a deleted row with its original id and timestamp (used by Undo) */
export function restoreItem(item: Item) {
  db.runSync(
    'INSERT OR IGNORE INTO items (id, name, description, sku, quantity, price_cents, category, low_stock_threshold, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
    [item.id, item.name, item.description, item.sku, item.quantity, item.price_cents, item.category, item.low_stock_threshold, item.timestamp],
  );
  notify();
}

/** True when another item already uses this SKU (case-insensitive) */
export function isSkuTaken(sku: string, excludeId?: number): boolean {
  return db.getFirstSync('SELECT 1 FROM items WHERE sku = ? COLLATE NOCASE AND id != ? LIMIT 1;', [sku, excludeId ?? -1]) !== null;
}

export function getCategories(): string[] {
  return db
    .getAllSync<{ category: string }>(
      "SELECT DISTINCT category FROM items WHERE category IS NOT NULL AND category != '' ORDER BY category COLLATE NOCASE;",
    )
    .map((row) => row.category);
}

export type ThemePreference = 'system' | 'light' | 'dark';

export function getThemeSetting(): ThemePreference {
  const row = db.getFirstSync<{ value: string }>('SELECT value FROM settings WHERE key = ?;', ['theme']);
  return row?.value === 'dark' || row?.value === 'light' ? row.value : 'system';
}

export function setThemeSetting(theme: ThemePreference) {
  if (theme === 'system') {
    db.runSync('DELETE FROM settings WHERE key = ?;', ['theme']);
  } else {
    db.runSync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?);', ['theme', theme]);
  }
}

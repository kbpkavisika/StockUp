const runtimeRequire = (window as unknown as { require: (name: string) => unknown }).require;
const Database = runtimeRequire('better-sqlite3') as typeof import('better-sqlite3');
const { ipcRenderer } = runtimeRequire('electron') as { ipcRenderer: { sendSync: (channel: string) => string } };

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

/** Resolved by the main process: the per-user app data folder (see electron.js) */
const dbPath: string = ipcRenderer.sendSync('stockup:get-db-path');
const db = new Database(dbPath);

/**
 * Schema migrations, applied in order. PRAGMA user_version records how many have run,
 * so append new entries here — never edit or reorder existing ones.
 */
const migrations: string[] = [
  // 1 — original schema (IF NOT EXISTS so databases from before migrations upgrade cleanly)
  `CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );`,
  // 2 — stock fields
  `ALTER TABLE items ADD COLUMN sku TEXT;
   ALTER TABLE items ADD COLUMN quantity INTEGER NOT NULL DEFAULT 0;
   ALTER TABLE items ADD COLUMN price_cents INTEGER;
   ALTER TABLE items ADD COLUMN category TEXT;
   ALTER TABLE items ADD COLUMN low_stock_threshold INTEGER NOT NULL DEFAULT 5;
   CREATE UNIQUE INDEX items_sku_unique ON items(sku COLLATE NOCASE) WHERE sku IS NOT NULL;`,
];

export const initDB = () => {
  const applied = db.pragma('user_version', { simple: true }) as number;
  if (applied >= migrations.length) return;
  db.transaction(() => {
    migrations.slice(applied).forEach((sql) => db.exec(sql));
    db.pragma(`user_version = ${migrations.length}`);
  })();
};

const COLUMNS = 'name, description, sku, quantity, price_cents, category, low_stock_threshold';

const toRow = (input: ItemInput) => [
  input.name,
  input.description,
  input.sku,
  input.quantity,
  input.priceCents,
  input.category,
  input.lowStockThreshold,
];

export const getItems = (): Item[] => {
  return db.prepare('SELECT * FROM items ORDER BY timestamp DESC').all() as Item[];
};

export const addItem = (input: ItemInput) => {
  db.prepare(`INSERT INTO items (${COLUMNS}) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(...toRow(input));
};

export const updateItem = (id: number, input: ItemInput) => {
  db.prepare(
    'UPDATE items SET name = ?, description = ?, sku = ?, quantity = ?, price_cents = ?, category = ?, low_stock_threshold = ? WHERE id = ?',
  ).run(...toRow(input), id);
};

export const deleteItem = (id: number) => {
  db.prepare('DELETE FROM items WHERE id = ?').run(id);
};

export const deleteItems = (ids: number[]) => {
  const remove = db.prepare('DELETE FROM items WHERE id = ?');
  db.transaction((list: number[]) => list.forEach((id) => remove.run(id)))(ids);
};

// Re-inserts deleted rows with their original id and timestamp (used by Undo)
export const restoreItems = (items: Item[]) => {
  const insert = db.prepare(
    `INSERT OR IGNORE INTO items (id, ${COLUMNS}, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  db.transaction((list: Item[]) =>
    list.forEach((item) =>
      insert.run(
        item.id,
        item.name,
        item.description,
        item.sku,
        item.quantity,
        item.price_cents,
        item.category,
        item.low_stock_threshold,
        item.timestamp,
      ),
    ),
  )(items);
};

export const searchItems = (query: string): Item[] => {
  const pattern = `%${query}%`;
  return db
    .prepare(
      'SELECT * FROM items WHERE name LIKE ? OR description LIKE ? OR sku LIKE ? OR category LIKE ? ORDER BY timestamp DESC',
    )
    .all(pattern, pattern, pattern, pattern) as Item[];
};

/** True when another item already uses this SKU (case-insensitive) */
export const isSkuTaken = (sku: string, excludeId?: number): boolean => {
  const row = db
    .prepare('SELECT 1 FROM items WHERE sku = ? COLLATE NOCASE AND id != ? LIMIT 1')
    .get(sku, excludeId ?? -1);
  return row !== undefined;
};

export const getCategories = (): string[] => {
  const rows = db
    .prepare("SELECT DISTINCT category FROM items WHERE category IS NOT NULL AND category != '' ORDER BY category COLLATE NOCASE")
    .all() as { category: string }[];
  return rows.map((row) => row.category);
};

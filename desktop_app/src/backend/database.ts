const runtimeRequire = (window as any).require;
const Database = runtimeRequire('better-sqlite3');
const path = runtimeRequire('path');
const nodeProcess = runtimeRequire('process');

export interface Item {
  id: number;
  name: string;
  quantity: number;
  category: string;
  description: string;
  timestamp: string;
}

const dbPath = path.join(nodeProcess.cwd(), 'inventory.db');
const db = new Database(dbPath);

export const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      category TEXT,
      description TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const getItems = (): Item[] => {
  return db.prepare('SELECT * FROM items ORDER BY timestamp DESC').all() as Item[];
};

export const addItem = (name: string, quantity: number, category: string, description: string) => {
  db.prepare('INSERT INTO items (name, quantity, category, description) VALUES (?, ?, ?, ?)').run(name, quantity, category, description);
};

export const updateItem = (id: number, name: string, quantity: number, category: string, description: string) => {
  db.prepare('UPDATE items SET name = ?, quantity = ?, category = ?, description = ? WHERE id = ?').run(name, quantity, category, description, id);
};

export const deleteItem = (id: number) => {
  db.prepare('DELETE FROM items WHERE id = ?').run(id);
};

export const searchItems = (query: string): Item[] => {
  return db.prepare('SELECT * FROM items WHERE name LIKE ? OR description LIKE ? ORDER BY timestamp DESC').all(`%${query}%`, `%${query}%`) as Item[];
};

export const getCategories = (): string[] => {
  return db.prepare('SELECT DISTINCT category FROM items WHERE category IS NOT NULL').all().map((row: any) => row.category);
};
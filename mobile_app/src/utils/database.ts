import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('items.db');

export interface Item {
  id: number;
  title: string;
  description: string;
  timestamp: string;
}

export const initDatabase = (onReady?: () => void) => {
  db.execSync(
    'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);'
  );
  db.execSync('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);');
  if (onReady) {
    onReady();
  }
};

export const getItems = (callback: (items: Item[]) => void) => {
  const rows = db.getAllSync<Item>('SELECT * FROM items ORDER BY timestamp DESC;');
  callback(rows);
};

export const addItem = (title: string, description: string) => {
  db.runSync('INSERT INTO items (title, description) VALUES (?, ?);', [title, description]);
};

export const updateItem = (id: number, title: string, description: string) => {
  db.runSync('UPDATE items SET title = ?, description = ? WHERE id = ?;', [title, description, id]);
};

export const deleteItem = (id: number) => {
  db.runSync('DELETE FROM items WHERE id = ?;', [id]);
};

export const searchItems = (query: string, callback: (items: Item[]) => void) => {
  const rows = db.getAllSync<Item>(
    'SELECT * FROM items WHERE title LIKE ? OR description LIKE ? ORDER BY timestamp DESC;',
    [`%${query}%`, `%${query}%`]
  );
  callback(rows);
};

export const getSetting = (key: string, callback: (value: string | null) => void) => {
  const row = db.getFirstSync<{ value: string }>('SELECT value FROM settings WHERE key = ?;', [key]);
  callback(row ? row.value : null);
};

export const setSetting = (key: string, value: string) => {
  db.runSync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?);', [key, value]);
};
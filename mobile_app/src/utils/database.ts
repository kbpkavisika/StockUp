import { openDatabaseSync } from 'expo-sqlite';
import type { Item } from '../types/item';

const db = openDatabaseSync('items.db');
let isInitialized = false;

export function initializeDatabase() {
  if (isInitialized) return;

  db.execSync(
    'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);'
  );
  db.execSync('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);');

  isInitialized = true;
}

export function getItems(searchQuery = ''): Item[] {
  const query = searchQuery.trim();
  if (!query) {
    return db.getAllSync<Item>('SELECT * FROM items ORDER BY timestamp DESC, id DESC;');
  }

  return db.getAllSync<Item>(
    'SELECT * FROM items WHERE title LIKE ? OR description LIKE ? ORDER BY timestamp DESC, id DESC;',
    [`%${query}%`, `%${query}%`]
  );
}

export function addItem(title: string, description: string) {
  db.runSync('INSERT INTO items (title, description) VALUES (?, ?);', [title.trim(), description.trim()]);
}

export function updateItem(id: number, title: string, description: string) {
  db.runSync('UPDATE items SET title = ?, description = ? WHERE id = ?;', [title.trim(), description.trim(), id]);
}

export function deleteItem(id: number) {
  db.runSync('DELETE FROM items WHERE id = ?;', [id]);
}

export function getThemeSetting(): 'light' | 'dark' | null {
  const row = db.getFirstSync<{ value: string }>('SELECT value FROM settings WHERE key = ?;', ['theme']);
  if (!row) return null;

  return row.value === 'dark' ? 'dark' : 'light';
}

export function setThemeSetting(theme: 'light' | 'dark') {
  db.runSync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?);', ['theme', theme]);
}
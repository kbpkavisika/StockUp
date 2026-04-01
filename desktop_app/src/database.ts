import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

export interface Item {
  id: number;
  name: string;
  quantity: number;
  category: string;
  description: string;
  timestamp: string;
}

const dbPath = path.join(app.getPath('userData'), 'inventory.db');
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
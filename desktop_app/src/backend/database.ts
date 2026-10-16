const runtimeRequire = (window as unknown as { require: (name: string) => unknown }).require;
const Database = runtimeRequire('better-sqlite3') as typeof import('better-sqlite3');
const path = runtimeRequire('path') as { join: (...parts: string[]) => string };
const nodeProcess = runtimeRequire('process') as { cwd: () => string };

export interface Item {
  id: number;
  name: string;
  description: string;
  timestamp: string;
}

export const dbPath: string = path.join(nodeProcess.cwd(), 'inventory.db');
const db = new Database(dbPath);

export const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const getItems = (): Item[] => {
  return db.prepare('SELECT * FROM items ORDER BY timestamp DESC').all() as Item[];
};

export const addItem = (name: string, description: string) => {
  db.prepare('INSERT INTO items (name, description) VALUES (?, ?)').run(name, description);
};

export const updateItem = (id: number, name: string, description: string) => {
  db.prepare('UPDATE items SET name = ?, description = ? WHERE id = ?').run(name, description, id);
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
  const insert = db.prepare('INSERT OR IGNORE INTO items (id, name, description, timestamp) VALUES (?, ?, ?, ?)');
  db.transaction((list: Item[]) => list.forEach((item) => insert.run(item.id, item.name, item.description, item.timestamp)))(items);
};

export const searchItems =(query: string): Item[] => {
  return db.prepare('SELECT * FROM items WHERE name LIKE ? OR description LIKE ? ORDER BY timestamp DESC').all(`%${query}%`, `%${query}%`) as Item[];
};
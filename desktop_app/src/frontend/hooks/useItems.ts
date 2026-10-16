import { useState, useEffect, useCallback, useRef } from 'react';
import {
  initDB,
  getItems,
  addItem,
  updateItem,
  deleteItems,
  restoreItems,
  searchItems,
  type Item,
} from '../../backend/database';

export function useItems(onError: (message: string) => void) {
  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState('');
  const onErrorRef = useRef(onError);
  const queryRef = useRef('');

  const trimmedQuery = query.trim();

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    queryRef.current = trimmedQuery;
  }, [trimmedQuery]);

  const attempt = useCallback((label: string, action: () => void) => {
    try {
      action();
      return true;
    } catch (error) {
      onErrorRef.current(`${label}: ${(error as Error).message}`);
      return false;
    }
  }, []);

  // Always reloads with the latest search, even when called from an older closure (e.g. Undo)
  const loadItems = useCallback(() => {
    attempt("Couldn't load items", () => {
      const current = queryRef.current;
      setItems(current ? searchItems(current) : getItems());
    });
  }, [attempt]);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = attempt("Couldn't open the database", initDB);
      if (!initialized.current) return;
    }
    loadItems();
  }, [attempt, loadItems, trimmedQuery]);

  const mutate = (label: string, action: () => void) => {
    const ok = attempt(label, action);
    loadItems();
    return ok;
  };

  return {
    items,
    query,
    setQuery,
    handleAdd: (name: string, description: string) =>
      mutate("Couldn't add item", () => addItem(name, description)),
    handleUpdate: (id: number, name: string, description: string) =>
      mutate("Couldn't save changes", () => updateItem(id, name, description)),
    handleDelete: (ids: number[]) =>
      mutate("Couldn't delete", () => deleteItems(ids)),
    handleRestore: (deleted: Item[]) =>
      mutate("Couldn't restore", () => restoreItems(deleted)),
  };
}

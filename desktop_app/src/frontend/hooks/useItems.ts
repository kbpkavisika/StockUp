import { useState, useEffect } from 'react';
import {
  initDB,
  getItems,
  addItem,
  updateItem,
  deleteItem,
  searchItems,
  type Item,
} from '../../backend/database';

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);

  const loadItems = () => {
    const allItems = getItems();
    setItems(allItems);
  };

  useEffect(() => {
    initDB();
    loadItems();
  }, []);

  const handleAdd = (name: string, description: string) => {
    if (name) {
      addItem(name, description);
      loadItems();
    }
  };

  const handleUpdate = (id: number, name: string, description: string) => {
    if (name) {
      updateItem(id, name, description);
      loadItems();
    }
  };

  const handleDelete = (id: number) => {
    deleteItem(id);
    loadItems();
  };

  const handleSearch = (query: string) => {
    if (query) {
      const results = searchItems(query);
      setItems(results);
    } else {
      loadItems();
    }
  };

  return {
    items,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleSearch
  };
}
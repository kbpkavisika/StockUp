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
    try {
      const allItems = getItems();
      setItems(allItems);
    } catch (error) {
      window.alert('Error loading items: ' + (error as Error).message);
    }
  };

  useEffect(() => {
    try {
      initDB();
      loadItems();
    } catch (error) {
      window.alert('Error initializing database: ' + (error as Error).message);
    }
  }, []);

  const handleAdd = (name: string, description: string) => {
    if (name) {
      try {
        addItem(name, description);
        loadItems();
      } catch (error) {
        window.alert('Error adding item: ' + (error as Error).message);
      }
    }
  };

  const handleUpdate = (id: number, name: string, description: string) => {
    if (name) {
      try {
        updateItem(id, name, description);
        loadItems();
      } catch (error) {
        window.alert('Error updating item: ' + (error as Error).message);
      }
    }
  };

  const handleDelete = (id: number) => {
    try {
      deleteItem(id);
      loadItems();
    } catch (error) {
      window.alert('Error deleting item: ' + (error as Error).message);
    }
  };

  const handleSearch = (query: string) => {
    try {
      if (query) {
        const results = searchItems(query);
        setItems(results);
      } else {
        loadItems();
      }
    } catch (error) {
      window.alert('Error searching items: ' + (error as Error).message);
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
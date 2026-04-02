import { useState, useEffect } from 'react';
import {
  initDB,
  getItems,
  addItem,
  updateItem,
  deleteItem,
  searchItems,
  getCategories,
  type Item,
} from '../../backend/database';

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const loadItems = () => {
    const allItems = getItems();
    setItems(allItems);
  };

  const loadCategories = () => {
    const cats = getCategories();
    setCategories(cats);
  };

  useEffect(() => {
    initDB();
    loadItems();
    loadCategories();
  }, []);

  const handleAdd = (name: string, quantity: number, category: string, description: string) => {
    if (name && quantity > 0) {
      addItem(name, quantity, category, description);
      loadItems();
      loadCategories();
    }
  };

  const handleUpdate = (id: number, name: string, quantity: number, category: string, description: string) => {
    if (name && quantity > 0) {
      updateItem(id, name, quantity, category, description);
      loadItems();
      loadCategories();
    }
  };

  const handleDelete = (id: number) => {
    deleteItem(id);
    loadItems();
    loadCategories();
  };

  const handleSearch = (query: string) => {
    if (query) {
      const results = searchItems(query);
      setItems(results);
    } else {
      loadItems();
    }
  };

  const handleFilter = (category: string) => {
    if (category) {
      const filtered = getItems().filter(item => item.category === category);
      setItems(filtered);
    } else {
      loadItems();
    }
  };

  return {
    items,
    categories,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleSearch,
    handleFilter
  };
}
import { useState, useEffect } from 'react';
import { getItems, addItem, updateItem, deleteItem, searchItems, getCategories } from './database';
import type { Item } from './database';
import './App.css';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [form, setForm] = useState({ name: '', quantity: 0, category: '', description: '' });

  useEffect(() => {
    loadItems();
    loadCategories();
  }, []);

  const loadItems = () => {
    const allItems = getItems();
    setItems(allItems);
  };

  const loadCategories = () => {
    const cats = getCategories();
    setCategories(cats);
  };

  const handleSearch = () => {
    if (searchQuery) {
      const results = searchItems(searchQuery);
      setItems(results);
    } else {
      loadItems();
    }
  };

  const handleFilter = () => {
    if (filterCategory) {
      const filtered = getItems().filter(item => item.category === filterCategory);
      setItems(filtered);
    } else {
      loadItems();
    }
  };

  const handleAdd = () => {
    if (form.name && form.quantity > 0) {
      addItem(form.name, form.quantity, form.category, form.description);
      setForm({ name: '', quantity: 0, category: '', description: '' });
      loadItems();
      loadCategories();
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setForm({ name: item.name, quantity: item.quantity, category: item.category, description: item.description });
  };

  const handleUpdate = () => {
    if (editingItem && form.name && form.quantity > 0) {
      updateItem(editingItem.id, form.name, form.quantity, form.category, form.description);
      setEditingItem(null);
      setForm({ name: '', quantity: 0, category: '', description: '' });
      loadItems();
      loadCategories();
    }
  };

  const handleDelete = (id: number) => {
    deleteItem(id);
    loadItems();
    loadCategories();
  };

  const filteredItems = items.filter(item => 
    (!filterCategory || item.category === filterCategory)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory Manager</h1>
      
      {/* Search and Filter */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2">Search</button>
        
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border p-2">
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button onClick={handleFilter} className="bg-green-500 text-white px-4 py-2">Filter</button>
      </div>
      
      {/* Form */}
      <div className="mb-4 p-4 border">
        <h2>{editingItem ? 'Edit Item' : 'Add Item'}</h2>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={editingItem ? handleUpdate : handleAdd} className="bg-blue-500 text-white px-4 py-2">
          {editingItem ? 'Update' : 'Add'}
        </button>
        {editingItem && <button onClick={() => { setEditingItem(null); setForm({ name: '', quantity: 0, category: '', description: '' }); }} className="bg-gray-500 text-white px-4 py-2 ml-2">Cancel</button>}
      </div>
      
      {/* Items List */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <tr key={item.id} className={item.quantity < 5 ? 'bg-red-100' : ''}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{item.category}</td>
              <td className="border p-2">{item.description}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-2 py-1 mr-2">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

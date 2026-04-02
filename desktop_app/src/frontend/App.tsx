import { useState, useContext } from 'react';
import { useItems } from './hooks/useItems';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import SearchFilter from './components/SearchFilter';
import type { Item } from '../backend/database';
import { ThemeContext } from './ThemeContext';

function App() {
  const { items, categories, handleAdd, handleUpdate, handleDelete, handleSearch, handleFilter } = useItems();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [form, setForm] = useState({ name: '', quantity: 0, category: '', description: '' });

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setForm({ name: item.name, quantity: item.quantity, category: item.category, description: item.description });
  };

  const handleFormSubmit = () => {
    if (form.name && form.quantity > 0) {
      if (editingItem) {
        handleUpdate(editingItem.id, form.name, form.quantity, form.category, form.description);
        setEditingItem(null);
      } else {
        handleAdd(form.name, form.quantity, form.category, form.description);
      }
      setForm({ name: '', quantity: 0, category: '', description: '' });
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setForm({ name: '', quantity: 0, category: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Inventory Manager</h1>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
        
        <SearchFilter
          searchQuery={searchQuery}
          filterCategory={filterCategory}
          categories={categories}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterCategory}
          onSearch={() => handleSearch(searchQuery)}
          onFilter={() => handleFilter(filterCategory)}
        />
        
        <ItemForm
          name={form.name}
          quantity={form.quantity}
          category={form.category}
          description={form.description}
          isEditing={!!editingItem}
          onNameChange={(value) => setForm({ ...form, name: value })}
          onQuantityChange={(value) => setForm({ ...form, quantity: value })}
          onCategoryChange={(value) => setForm({ ...form, category: value })}
          onDescriptionChange={(value) => setForm({ ...form, description: value })}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
        
        <ItemList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;

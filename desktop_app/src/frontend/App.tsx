import { useState, useContext, useEffect } from 'react';
import { useItems } from './hooks/useItems';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import SearchFilter from './components/SearchFilter';
import type { Item } from '../backend/database';
import { ThemeContext } from './ThemeContext';

function App() {
  const { items, handleAdd, handleUpdate, handleDelete, handleSearch } = useItems();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setForm({ name: item.name, description: item.description });
  };

  const handleFormSubmit = () => {
    if (!form.name.trim()) {
      setFormError('Name is required');
      return;
    }
    setFormError('');
    if (editingItem) {
      handleUpdate(editingItem.id, form.name, form.description);
      setEditingItem(null);
    } else {
      handleAdd(form.name, form.description);
    }
    setForm({ name: '', description: '' });
  };

  const handleCancel = () => {
    setEditingItem(null);
    setForm({ name: '', description: '' });
    setFormError('');
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
          onSearchChange={setSearchQuery}
        />
        
        <ItemForm
          name={form.name}
          description={form.description}
          isEditing={!!editingItem}
          error={formError}
          onNameChange={(value) => setForm({ ...form, name: value })}
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

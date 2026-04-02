interface SearchFilterProps {
  searchQuery: string;
  filterCategory: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onSearch: () => void;
  onFilter: () => void;
}

export default function SearchFilter({
  searchQuery,
  filterCategory,
  categories,
  onSearchChange,
  onFilterChange,
  onSearch,
  onFilter
}: SearchFilterProps) {
  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border p-2"
      />
      <button onClick={onSearch} className="bg-blue-500 text-white px-4 py-2">Search</button>
      
      <select value={filterCategory} onChange={(e) => onFilterChange(e.target.value)} className="border p-2">
        <option value="">All Categories</option>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <button onClick={onFilter} className="bg-green-500 text-white px-4 py-2">Filter</button>
    </div>
  );
}
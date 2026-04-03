interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  onSearch
}: SearchFilterProps) {
  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border p-2 dark:bg-gray-800 dark:text-white"
      />
      <button onClick={onSearch} className="bg-blue-500 text-white px-4 py-2">Search</button>
    </div>
  );
}
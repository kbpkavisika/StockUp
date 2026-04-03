interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function SearchFilter({
  searchQuery,
  onSearchChange
}: SearchFilterProps) {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border p-2 dark:bg-gray-800 dark:text-white w-full"
      />
    </div>
  );
}
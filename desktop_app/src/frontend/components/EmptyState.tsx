import Icon from './Icon';
import { Button } from './ui';

/** DESIGN.md §06 Empty state — first run, or a search with no results */
export default function EmptyState({ query, onClearSearch, onAdd }: { query: string; onClearSearch: () => void; onAdd: () => void }) {
  if (query) {
    return (
      <div className="flex flex-col items-center px-16 py-16 text-center">
        <Icon name="search" size={24} className="text-secondary" />
        <h2 className="mt-4 break-all text-h3 font-semibold">No matches for “{query}”</h2>
        <p className="mt-2 text-caption text-secondary">Try a different name or description.</p>
        <Button variant="ghost" className="mt-4" onClick={onClearSearch}>
          Clear search
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-16 py-16 text-center">
      <Icon name="box" size={24} className="text-secondary" />
      <h2 className="mt-4 text-h2 font-bold">No items yet</h2>
      <p className="mt-2 text-caption text-secondary">Add your first item to start tracking stock.</p>
      <Button variant="primary" icon="plus" className="mt-6" onClick={onAdd}>
        Add item
      </Button>
    </div>
  );
}

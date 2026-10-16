import { useRef } from 'react';
import type { RefObject } from 'react';
import { SORT_OPTIONS, type SortKey } from '../utils/sort';
import Icon from './Icon';
import { useMenuAnchor } from '../hooks/useMenuAnchor';
import { IconButton, Menu } from './ui';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  searchRef: RefObject<HTMLInputElement | null>;
}

/** Toolbar search field + sort chip — DESIGN.md §06 Inputs / Filter chips */
export default function SearchFilter({ searchQuery, onSearchChange, sort, onSortChange, searchRef }: SearchFilterProps) {
  const sortMenu = useMenuAnchor();
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const sortLabel = SORT_OPTIONS.find((option) => option.key === sort)?.label;
  const customSort = sort !== 'newest';

  return (
    <>
      <div className="relative w-80">
        <Icon name="search" size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
        <input
          ref={searchRef}
          type="text"
          role="searchbox"
          aria-label="Search items"
          placeholder="Search items"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Escape') return;
            if (searchQuery) onSearchChange('');
            else event.currentTarget.blur();
          }}
          className="h-10 w-full rounded-full border-[1.5px] border-transparent bg-surface-sunken pl-10 pr-11 text-body text-primary transition-colors duration-[120ms] placeholder:text-secondary focus:border-primary focus:bg-surface"
        />
        {searchQuery && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <IconButton icon="close" label="Clear search" shortcut="Esc" onClick={() => onSearchChange('')} />
          </div>
        )}
      </div>

      <button
        ref={sortButtonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={!!sortMenu.anchor}
        onClick={(event) => (sortMenu.anchor ? sortMenu.close() : sortMenu.openAt(event.currentTarget))}
        className={`inline-flex h-8 items-center gap-1.5 rounded-md pl-3 pr-2 text-[13px] text-primary transition-colors duration-[120ms] ease-out ${
          customSort
            ? 'border-[1.5px] border-primary bg-surface-sunken font-semibold'
            : 'border border-border-strong bg-surface font-medium hover:bg-surface-muted'
        }`}
      >
        Sort: {sortLabel}
        <Icon name="chevron" size={16} />
      </button>
      {sortMenu.anchor && (
        <Menu
          anchor={sortMenu.anchor}
          placement="bottom-start"
          header="Sort by"
          label="Sort by"
          triggerRef={sortButtonRef}
          onClose={sortMenu.close}
          items={SORT_OPTIONS.map((option) => ({
            label: option.label,
            selected: option.key === sort,
            onSelect: () => onSortChange(option.key),
          }))}
        />
      )}
    </>
  );
}

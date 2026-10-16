import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Item } from '../../backend/database';
import { formatTimestamp } from '../utils/format';
import type { Density, SortKey } from '../utils/sort';
import Icon from './Icon';
import { useMenuAnchor } from '../hooks/useMenuAnchor';
import { Checkbox, IconButton, Menu } from './ui';

const PAGE_SIZE = 50;

interface ItemListProps {
  items: Item[];
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  selected: Set<number>;
  onSelectedChange: (selected: Set<number>) => void;
  density: Density;
  headerRaised: boolean;
  onEdit: (item: Item) => void;
  onDelete: (items: Item[]) => void;
}

/** Inventory data table — DESIGN.md §06 Data table + Pagination */
export default function ItemList({
  items,
  sort,
  onSortChange,
  selected,
  onSelectedChange,
  density,
  headerRaised,
  onEdit,
  onDelete,
}: ItemListProps) {
  const [page, setPage] = useState(1);
  const [menuItem, setMenuItem] = useState<Item | null>(null);
  const [menuAtPointer, setMenuAtPointer] = useState(false);
  const rowMenu = useMenuAnchor();
  const menuTriggerRef = useRef<HTMLElement | null>(null);
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = items.slice(start, start + PAGE_SIZE);

  const selectedOnPage = pageItems.filter((item) => selected.has(item.id)).length;
  const allSelected = pageItems.length > 0 && selectedOnPage === pageItems.length;

  const setRows = (ids: number[], checked: boolean) => {
    const next = new Set(selected);
    ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
    onSelectedChange(next);
  };

  const toggleRow = (item: Item) => setRows([item.id], !selected.has(item.id));

  // Delete acts on the whole selection when the row is part of it
  const deleteTargets = (item: Item) =>
    selected.has(item.id) ? items.filter((candidate) => selected.has(candidate.id)) : [item];

  const openMenu = (item: Item, trigger: HTMLElement | null, point?: { x: number; y: number }) => {
    menuTriggerRef.current = trigger;
    setMenuItem(item);
    setMenuAtPointer(!!point);
    if (point) rowMenu.openAtPoint(point.x, point.y);
    else if (trigger) rowMenu.openAt(trigger);
  };

  const closeMenu = () => {
    rowMenu.close();
    setMenuItem(null);
  };

  const focusRow = (index: number) => {
    bodyRef.current?.querySelectorAll<HTMLTableRowElement>('tr')[index]?.focus();
  };

  const onRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, item: Item, index: number) => {
    if (event.target !== event.currentTarget) return;
    const mod = event.ctrlKey || event.metaKey;
    if (mod && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      setRows(pageItems.map((row) => row.id), true);
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusRow(Math.min(index + 1, pageItems.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusRow(Math.max(index - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        focusRow(0);
        break;
      case 'End':
        event.preventDefault();
        focusRow(pageItems.length - 1);
        break;
      case 'Enter':
        event.preventDefault();
        onEdit(item);
        break;
      case 'Delete':
        event.preventDefault();
        onDelete(deleteTargets(item));
        break;
      case ' ':
        event.preventDefault();
        toggleRow(item);
        break;
      case 'ContextMenu':
      case 'F10':
        if (event.key === 'F10' && !event.shiftKey) break;
        event.preventDefault();
        openMenu(item, event.currentTarget.querySelector<HTMLElement>('[data-row-more]'));
        break;
    }
  };

  const cell = `${density === 'compact' ? 'h-10' : 'h-12'} border-b border-border px-3`;
  const headerCell = `sticky top-0 z-10 h-10 border-b border-border bg-surface-sunken px-3 text-left text-overline font-bold uppercase text-secondary transition-shadow duration-[120ms] ${
    headerRaised ? 'shadow-e2' : ''
  }`;

  return (
    <div className="overflow-clip rounded-lg border border-border bg-surface">
      <table className="w-full table-fixed border-separate border-spacing-0 text-body">
        <colgroup>
          <col className="w-12" />
          <col className="w-[32%]" />
          <col />
          <col className="w-44" />
          <col className="w-24" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={`${headerCell} pl-4 pr-1`}>
              <Checkbox
                checked={allSelected}
                indeterminate={selectedOnPage > 0 && !allSelected}
                label="Select all items on this page"
                onChange={(checked) => setRows(pageItems.map((item) => item.id), checked)}
              />
            </th>
            <SortHeader
              label="Name"
              className={headerCell}
              direction={sort === 'name-asc' ? 'asc' : sort === 'name-desc' ? 'desc' : null}
              onClick={() => onSortChange(sort === 'name-asc' ? 'name-desc' : 'name-asc')}
            />
            <th scope="col" className={headerCell}>
              Description
            </th>
            <SortHeader
              label="Added"
              className={headerCell}
              direction={sort === 'oldest' ? 'asc' : sort === 'newest' ? 'desc' : null}
              onClick={() => onSortChange(sort === 'newest' ? 'oldest' : 'newest')}
            />
            <th scope="col" className={`${headerCell} text-right`}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody ref={bodyRef}>
          {pageItems.map((item, index) => {
            const isSelected = selected.has(item.id);
            const menuOpen = menuItem?.id === item.id && !!rowMenu.anchor;
            return (
              <tr
                key={item.id}
                tabIndex={0}
                aria-selected={isSelected}
                onKeyDown={(event) => onRowKeyDown(event, item, index)}
                onDoubleClick={() => onEdit(item)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  openMenu(item, null, { x: event.clientX, y: event.clientY });
                }}
                className={`group outline-offset-[-3px] transition-colors duration-[120ms] [&:last-child>td]:border-b-0 ${
                  isSelected ? 'bg-surface-sunken' : 'hover:bg-surface-muted'
                }`}
              >
                <td className={`${cell} relative pl-4 pr-1`} onClick={() => toggleRow(item)}>
                  {isSelected && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-primary" />}
                  <Checkbox checked={isSelected} label={`Select ${item.name}`} tabIndex={-1} onChange={() => toggleRow(item)} />
                </td>
                <td className={`${cell} truncate font-semibold`} title={item.name}>
                  {item.name}
                </td>
                <td className={`${cell} truncate text-secondary`} title={item.description || undefined}>
                  {item.description || '—'}
                </td>
                <td className={`${cell} whitespace-nowrap font-mono text-caption text-secondary`}>{formatTimestamp(item.timestamp)}</td>
                <td className={`${cell} pr-3 text-right`}>
                  <div
                    className={`inline-flex gap-1 transition-opacity duration-[120ms] ${
                      menuOpen ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100 group-hover:opacity-100'
                    }`}
                  >
                    <IconButton
                      icon="edit"
                      label="Edit"
                      shortcut="Enter"
                      tabIndex={-1}
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(item);
                      }}
                    />
                    <IconButton
                      icon="more"
                      label="More actions"
                      tabIndex={-1}
                      data-row-more=""
                      aria-haspopup="menu"
                      aria-expanded={menuOpen}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (menuOpen) closeMenu();
                        else openMenu(item, event.currentTarget);
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex h-14 items-center justify-between border-t border-border px-4">
        <span className="font-mono text-caption text-secondary">
          {start + 1}–{start + pageItems.length} of {items.length}
        </span>
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="flex items-center gap-1">
            <IconButton
              icon="chevron-left"
              label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            />
            {pageList(currentPage, totalPages).map((entry, index) =>
              entry === 'gap' ? (
                <span key={`gap-${index}`} className="w-8 text-center text-secondary">
                  …
                </span>
              ) : (
                <button
                  key={entry}
                  type="button"
                  aria-current={entry === currentPage ? 'page' : undefined}
                  onClick={() => setPage(entry)}
                  className={`h-8 min-w-8 rounded-md px-2 text-label font-semibold transition-colors duration-[120ms] ${
                    entry === currentPage ? 'bg-primary text-on-primary' : 'text-primary hover:bg-surface-sunken'
                  }`}
                >
                  {entry}
                </button>
              ),
            )}
            <IconButton
              icon="chevron-right"
              label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            />
          </nav>
        )}
      </div>

      {rowMenu.anchor && menuItem && (
        <Menu
          anchor={rowMenu.anchor}
          placement={menuAtPointer ? 'bottom-start' : 'bottom-end'}
          label={`Actions for ${menuItem.name}`}
          triggerRef={menuTriggerRef}
          onClose={closeMenu}
          items={[
            { label: 'Edit', icon: 'edit', shortcut: 'Enter', onSelect: () => onEdit(menuItem) },
            {
              label: selected.has(menuItem.id) ? 'Deselect' : 'Select',
              icon: 'check',
              shortcut: 'Space',
              onSelect: () => toggleRow(menuItem),
            },
            {
              label: 'Delete',
              icon: 'delete',
              shortcut: 'Del',
              destructive: true,
              dividerBefore: true,
              onSelect: () => onDelete(deleteTargets(menuItem)),
            },
          ]}
        />
      )}
    </div>
  );
}

function SortHeader({
  label,
  className,
  direction,
  onClick,
}: {
  label: string;
  className: string;
  direction: 'asc' | 'desc' | null;
  onClick: () => void;
}) {
  return (
    <th scope="col" className={className} aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'}>
      <button
        type="button"
        onClick={onClick}
        className={`-mx-1 inline-flex items-center gap-1 rounded-sm px-1 uppercase transition-colors duration-[120ms] hover:text-primary ${
          direction ? 'text-primary' : ''
        }`}
      >
        {label}
        {direction && <Icon name={direction === 'asc' ? 'arrow-up' : 'arrow-down'} size={14} />}
      </button>
    </th>
  );
}

/** Page numbers with ellipses, e.g. 1 … 4 5 6 … 12 */
function pageList(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const pages = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) result.push('gap');
    result.push(page);
  });
  return result;
}

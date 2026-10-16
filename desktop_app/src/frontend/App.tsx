import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Item, ItemInput } from '../backend/database';
import ConfirmDialog from './components/ConfirmDialog';
import EmptyState from './components/EmptyState';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import PageHeader from './components/PageHeader';
import SearchFilter from './components/SearchFilter';
import Settings from './components/Settings';
import Sidebar, { type Page } from './components/Sidebar';
import Toasts, { type ToastAction, type ToastData } from './components/Toasts';
import { Button } from './components/ui';
import { useItems } from './hooks/useItems';
import { useMediaQuery } from './hooks/useMediaQuery';
import { ThemeContext } from './theme';
import { plural } from './utils/format';
import { readDensity, saveDensity, sortItems, type Density, type SortKey } from './utils/sort';

function App() {
  const { toggleTheme } = useContext(ThemeContext);

  const [toasts, setToasts] = useState<ToastData[]>([]);
  const nextToastId = useRef(0);
  const showToast = useCallback((message: string, action?: ToastAction) => {
    nextToastId.current += 1;
    const toast = { id: nextToastId.current, message, action };
    setToasts((current) => [...current, toast].slice(-3));
  }, []);
  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const { items, query, setQuery, handleAdd, handleUpdate, handleDelete, handleRestore } = useItems(showToast);

  const [page, setPage] = useState<Page>('items');
  const [sort, setSort] = useState<SortKey>('newest');
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [editor, setEditor] = useState<{ item: Item | null } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Item[] | null>(null);
  const [density, setDensity] = useState<Density>(readDensity);
  const [headerRaised, setHeaderRaised] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Sidebar collapses to a rail below 1024px; a manual toggle holds until the breakpoint changes
  const compactWindow = useMediaQuery('(max-width: 1023px)');
  const [sidebarOverride, setSidebarOverride] = useState<{ compact: boolean; collapsed: boolean } | null>(null);
  const collapsed = sidebarOverride?.compact === compactWindow ? sidebarOverride.collapsed : compactWindow;
  const toggleSidebar = () => setSidebarOverride({ compact: compactWindow, collapsed: !collapsed });

  const sortedItems = useMemo(() => sortItems(items, sort), [items, sort]);
  const selectedItems = sortedItems.filter((item) => selected.has(item.id));
  const overlayOpen = !!editor || !!pendingDelete;

  const openEditor = (item: Item | null) => setEditor({ item });

  const focusSearch = () => {
    setPage('items');
    requestAnimationFrame(() => searchRef.current?.focus());
  };

  const saveItem = (input: ItemInput) => {
    const existing = editor?.item;
    const ok = existing ? handleUpdate(existing.id, input) : handleAdd(input);
    if (ok) showToast(existing ? 'Changes saved' : 'Item added');
    return ok;
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const deleted = pendingDelete;
    setPendingDelete(null);
    if (!handleDelete(deleted.map((item) => item.id))) return;
    setSelected((current) => {
      const next = new Set(current);
      deleted.forEach((item) => next.delete(item.id));
      return next;
    });
    showToast(deleted.length === 1 ? 'Item deleted' : `${plural(deleted.length, 'item')} deleted`, {
      label: 'Undo',
      onClick: () => {
        if (handleRestore(deleted)) showToast(deleted.length === 1 ? 'Item restored' : `${plural(deleted.length, 'item')} restored`);
      },
    });
  };

  // Global shortcuts — DESIGN.md §07 Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
      const key = event.key.toLowerCase();
      if (event.shiftKey && key === 'l') {
        event.preventDefault();
        toggleTheme();
      } else if (key === '\\') {
        event.preventDefault();
        setSidebarOverride({ compact: compactWindow, collapsed: !collapsed });
      } else if (overlayOpen || event.shiftKey) {
        return;
      } else if (key === 'k' || key === 'f') {
        event.preventDefault();
        focusSearch();
      } else if (key === 'n') {
        event.preventDefault();
        setPage('items');
        setEditor({ item: null });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const trimmedQuery = query.trim();
  const showTable = sortedItems.length > 0;
  const showToolbar = showTable || !!trimmedQuery;
  const pagePadding = 'px-6 min-[1024px]:px-8';

  return (
    <div className="flex h-full bg-surface font-sans text-primary">
      <Sidebar page={page} collapsed={collapsed} onNavigate={setPage} onToggleCollapsed={toggleSidebar} />

      <main className="flex min-w-0 flex-1 flex-col">
        {page === 'settings' ? (
          <Settings
            density={density}
            onDensityChange={(next) => {
              setDensity(next);
              saveDensity(next);
            }}
          />
        ) : (
          <>
            <PageHeader title="Items" meta={trimmedQuery ? plural(sortedItems.length, 'result') : plural(sortedItems.length, 'item')}>
              <Button variant="primary" icon="plus" onClick={() => openEditor(null)}>
                Add item
              </Button>
            </PageHeader>

            {showToolbar && (
              <div className={`flex h-14 shrink-0 items-center gap-2 ${pagePadding}`}>
                {selectedItems.length > 0 ? (
                  <>
                    <span className="text-label font-semibold">{selectedItems.length} selected</span>
                    <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                      Clear selection
                    </Button>
                    <Button variant="destructive-ghost" size="sm" icon="delete" className="ml-auto" onClick={() => setPendingDelete(selectedItems)}>
                      Delete
                    </Button>
                  </>
                ) : (
                  <SearchFilter searchQuery={query} onSearchChange={setQuery} sort={sort} onSortChange={setSort} searchRef={searchRef} />
                )}
              </div>
            )}

            <div
              className={`flex-1 overflow-auto pb-6 min-[1024px]:pb-8 ${pagePadding}`}
              onScroll={(event) => setHeaderRaised(event.currentTarget.scrollTop > 0)}
            >
              <div className="max-w-[1440px]">
                {showTable ? (
                  <ItemList
                    key={`${trimmedQuery}|${sort}`}
                    items={sortedItems}
                    sort={sort}
                    onSortChange={setSort}
                    selected={selected}
                    onSelectedChange={setSelected}
                    density={density}
                    headerRaised={headerRaised}
                    onEdit={openEditor}
                    onDelete={setPendingDelete}
                  />
                ) : (
                  <EmptyState query={trimmedQuery} onClearSearch={() => setQuery('')} onAdd={() => openEditor(null)} />
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {editor && <ItemForm item={editor.item} onSave={saveItem} onClose={() => setEditor(null)} />}

      {pendingDelete && (
        <ConfirmDialog
          title={pendingDelete.length === 1 ? `Delete “${pendingDelete[0].name}”?` : `Delete ${plural(pendingDelete.length, 'item')}?`}
          body={`This removes ${pendingDelete.length === 1 ? 'it' : 'them'} from your inventory. You can undo right after.`}
          confirmLabel={pendingDelete.length === 1 ? 'Delete item' : `Delete ${plural(pendingDelete.length, 'item')}`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;

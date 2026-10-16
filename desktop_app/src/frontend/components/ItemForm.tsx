import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import type { Item } from '../../backend/database';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { shortcut } from '../utils/format';
import ConfirmDialog from './ConfirmDialog';
import { Button, Field, IconButton, TextArea, TextInput } from './ui';

interface ItemFormProps {
  /** The item being edited, or null when adding a new one */
  item: Item | null;
  /** Returns true when the save succeeded so the panel can close */
  onSave: (name: string, description: string) => boolean;
  onClose: () => void;
}

/** Add / edit side panel — DESIGN.md §06 Side panel */
export default function ItemForm({ item, onSave, onClose }: ItemFormProps) {
  const [name, setName] = useState(item?.name ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [error, setError] = useState('');
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const formId = useId();

  const dirty = name !== (item?.name ?? '') || description !== (item?.description ?? '');

  const requestClose = () => {
    if (dirty) setConfirmDiscard(true);
    else onClose();
  };

  const trapKeys = useFocusTrap(panelRef, requestClose, nameRef);

  const submit = () => {
    if (!name.trim()) {
      setError('Name is required');
      nameRef.current?.focus();
      return;
    }
    if (onSave(name.trim(), description.trim())) onClose();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      submit();
      return;
    }
    trapKeys(event);
  };

  return createPortal(
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 animate-fade-in bg-scrim" onMouseDown={requestClose} />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
        className="absolute inset-y-0 right-0 flex w-[480px] max-w-full animate-panel-in flex-col bg-surface shadow-e4 dark:bg-surface-muted"
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border pl-6 pr-4">
          <h2 id={titleId} className="text-h2 font-bold">
            {item ? 'Edit item' : 'Add item'}
          </h2>
          <IconButton icon="close" label="Close" shortcut="Esc" onClick={requestClose} />
        </header>

        <form
          id={formId}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="flex-1 space-y-4 overflow-y-auto p-6"
        >
          <Field label="Name" required error={error}>
            {({ id, invalid, describedBy }) => (
              <TextInput
                ref={nameRef}
                id={id}
                invalid={invalid}
                aria-describedby={describedBy}
                aria-required="true"
                autoComplete="off"
                placeholder="e.g. Blue hoodie"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (error) setError('');
                }}
              />
            )}
          </Field>
          <Field label="Description">
            {({ id }) => (
              <TextArea
                id={id}
                placeholder="Size, colour, supplier, notes…"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            )}
          </Field>
        </form>

        <footer className="flex h-[72px] shrink-0 items-center gap-2 border-t border-border px-6">
          <span className="mr-auto font-mono text-[12px] text-secondary">{shortcut('Enter')} to save</span>
          <Button variant="secondary" onClick={requestClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form={formId}>
            {item ? 'Save changes' : 'Add item'}
          </Button>
        </footer>
      </aside>

      {confirmDiscard && (
        <ConfirmDialog
          title="Discard changes?"
          body={item ? "Your edits to this item won't be saved." : "This item won't be added."}
          confirmLabel="Discard"
          onConfirm={onClose}
          onCancel={() => setConfirmDiscard(false)}
        />
      )}
    </div>,
    document.body,
  );
}

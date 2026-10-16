import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { getCategories, isSkuTaken, type Item, type ItemInput } from '../../backend/database';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { shortcut } from '../utils/format';
import { parseCount, parsePrice, priceToInput } from '../utils/stock';
import ConfirmDialog from './ConfirmDialog';
import { Button, Field, IconButton, TextArea, TextInput } from './ui';

interface ItemFormProps {
  /** The item being edited, or null when adding a new one */
  item: Item | null;
  /** Returns true when the save succeeded so the panel can close */
  onSave: (input: ItemInput) => boolean;
  onClose: () => void;
}

type FormValues = {
  name: string;
  sku: string;
  category: string;
  quantity: string;
  lowStockThreshold: string;
  price: string;
  description: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const DEFAULT_LOW_STOCK = 5;

const initialValues = (item: Item | null): FormValues => ({
  name: item?.name ?? '',
  sku: item?.sku ?? '',
  category: item?.category ?? '',
  quantity: item ? String(item.quantity) : '0',
  lowStockThreshold: String(item?.low_stock_threshold ?? DEFAULT_LOW_STOCK),
  price: priceToInput(item?.price_cents ?? null),
  description: item?.description ?? '',
});

const WHOLE_NUMBER = 'Enter a whole number, 0 or more';

/** Checks the form and returns either the values to save or the errors to show */
const validate = (values: FormValues, itemId?: number): { input: ItemInput } | { errors: FormErrors } => {
  const errors: FormErrors = {};
  const name = values.name.trim();
  const sku = values.sku.trim();
  const quantity = parseCount(values.quantity);
  const lowStockThreshold = parseCount(values.lowStockThreshold);
  const priceCents = parsePrice(values.price);

  if (!name) errors.name = 'Name is required';
  if (sku && isSkuTaken(sku, itemId)) errors.sku = 'Another item already uses this SKU';
  if (quantity === undefined) errors.quantity = WHOLE_NUMBER;
  if (lowStockThreshold === undefined) errors.lowStockThreshold = WHOLE_NUMBER;
  if (priceCents === undefined) errors.price = 'Enter a price like 12.50';

  if (Object.keys(errors).length > 0 || quantity === undefined || lowStockThreshold === undefined || priceCents === undefined) {
    return { errors };
  }
  return {
    input: {
      name,
      description: values.description.trim(),
      sku: sku || null,
      quantity,
      priceCents,
      category: values.category.trim() || null,
      lowStockThreshold,
    },
  };
};

/** Add / edit side panel — DESIGN.md §06 Side panel */
export default function ItemForm({ item, onSave, onClose }: ItemFormProps) {
  const [initial] = useState(() => initialValues(item));
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [categories] = useState(getCategories);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const formId = useId();
  const categoryListId = useId();

  const dirty = (Object.keys(values) as (keyof FormValues)[]).some((key) => values[key] !== initial[key]);

  const requestClose = () => {
    if (dirty) setConfirmDiscard(true);
    else onClose();
  };

  const trapKeys = useFocusTrap(panelRef, requestClose, nameRef);

  const update = (key: keyof FormValues) => (value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = () => {
    const result = validate(values, item?.id);
    if ('errors' in result) {
      setErrors(result.errors);
      requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    if (onSave(result.input)) onClose();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      submit();
      return;
    }
    trapKeys(event);
  };

  const numberClass = 'text-right font-mono';

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
          <Field label="Name" required error={errors.name}>
            {({ id, invalid, describedBy }) => (
              <TextInput
                ref={nameRef}
                id={id}
                invalid={invalid}
                aria-describedby={describedBy}
                aria-required="true"
                autoComplete="off"
                placeholder="e.g. Blue hoodie"
                value={values.name}
                onChange={(event) => update('name')(event.target.value)}
              />
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="SKU" error={errors.sku}>
              {({ id, invalid, describedBy }) => (
                <TextInput
                  id={id}
                  invalid={invalid}
                  aria-describedby={describedBy}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="e.g. HD-BLU-M"
                  className="font-mono"
                  value={values.sku}
                  onChange={(event) => update('sku')(event.target.value)}
                />
              )}
            </Field>
            <Field label="Category">
              {({ id }) => (
                <>
                  <TextInput
                    id={id}
                    list={categoryListId}
                    autoComplete="off"
                    placeholder="e.g. Apparel"
                    value={values.category}
                    onChange={(event) => update('category')(event.target.value)}
                  />
                  <datalist id={categoryListId}>
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </>
              )}
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Quantity" error={errors.quantity}>
              {({ id, invalid, describedBy }) => (
                <TextInput
                  id={id}
                  invalid={invalid}
                  aria-describedby={describedBy}
                  inputMode="numeric"
                  autoComplete="off"
                  className={numberClass}
                  value={values.quantity}
                  onChange={(event) => update('quantity')(event.target.value)}
                />
              )}
            </Field>
            <Field label="Low stock at" error={errors.lowStockThreshold} hint="Flags the item at or below this">
              {({ id, invalid, describedBy }) => (
                <TextInput
                  id={id}
                  invalid={invalid}
                  aria-describedby={describedBy}
                  inputMode="numeric"
                  autoComplete="off"
                  className={numberClass}
                  value={values.lowStockThreshold}
                  onChange={(event) => update('lowStockThreshold')(event.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Unit price" error={errors.price}>
              {({ id, invalid, describedBy }) => (
                <TextInput
                  id={id}
                  invalid={invalid}
                  aria-describedby={describedBy}
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0.00"
                  className={numberClass}
                  value={values.price}
                  onChange={(event) => update('price')(event.target.value)}
                />
              )}
            </Field>
          </div>

          <Field label="Description">
            {({ id }) => (
              <TextArea
                id={id}
                placeholder="Size, colour, supplier, notes…"
                value={values.description}
                onChange={(event) => update('description')(event.target.value)}
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

import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { Button, IconButton } from './ui';

interface ConfirmDialogProps {
  title: string;
  body: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Centred dialog — DESIGN.md §06 Dialog. Destructive dialogs focus Cancel and ignore scrim clicks. */
export default function ConfirmDialog({ title, body, confirmLabel, destructive = true, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const bodyId = useId();
  const onKeyDown = useFocusTrap(dialogRef, onCancel, destructive ? cancelRef : undefined);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-scrim p-6"
      onMouseDown={(event) => {
        if (!destructive && event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        role={destructive ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="w-[400px] max-w-full animate-dialog-in rounded-lg bg-surface p-6 shadow-e4 dark:bg-surface-muted"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="break-words text-h2 font-bold">
            {title}
          </h2>
          <IconButton icon="close" label="Close" shortcut="Esc" onClick={onCancel} className="-mr-2 -mt-1" />
        </div>
        <p id={bodyId} className="mt-4 text-body">
          {body}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={destructive ? 'destructive' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

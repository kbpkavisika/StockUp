import { useEffect, useState } from 'react';
import Icon from './Icon';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastData {
  id: number;
  message: string;
  action?: ToastAction;
}

const TOAST_DURATION = 4000;

/** Bottom-right toast stack — DESIGN.md §06 Toast */
export default function Toasts({ toasts, onDismiss }: { toasts: ToastData[]; onDismiss: (id: number) => void }) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[70] flex flex-col items-end gap-2" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <ToastView key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastView({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => onDismiss(toast.id), TOAST_DURATION);
    return () => window.clearTimeout(timer);
  }, [paused, toast.id, onDismiss]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="pointer-events-auto flex w-[360px] animate-toast-in items-center gap-3 rounded-lg bg-primary py-2 pl-4 pr-2 text-body text-on-primary shadow-e3"
    >
      <span className="flex-1 py-1.5">{toast.message}</span>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action?.onClick();
            onDismiss(toast.id);
          }}
          className="rounded-sm px-1 font-semibold underline decoration-[1.5px] underline-offset-[3px]"
        >
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => onDismiss(toast.id)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

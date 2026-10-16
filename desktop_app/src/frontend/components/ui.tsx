import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ComponentProps, HTMLAttributes, KeyboardEvent, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { toAnchor, type AnchorRect } from '../hooks/useMenuAnchor';
import Icon, { type IconName } from './Icon';

/* ---------- Buttons — DESIGN.md §06 ---------- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'destructive-ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover disabled:bg-border disabled:text-disabled',
  secondary: 'border-[1.5px] border-primary bg-surface text-primary hover:bg-surface-muted active:bg-surface-sunken disabled:border-border disabled:bg-surface disabled:text-disabled',
  ghost: 'text-primary hover:bg-surface-sunken disabled:bg-transparent disabled:text-disabled',
  destructive: 'bg-danger text-white hover:bg-danger-hover disabled:bg-border disabled:text-disabled',
  'destructive-ghost': 'text-error hover:bg-error-tint disabled:bg-transparent disabled:text-disabled',
};

const buttonSizes: Record<ButtonSize, string> = {
  lg: 'h-11 px-5 text-body',
  md: 'h-10 px-5 text-body',
  sm: 'h-8 px-3.5 text-label-sm',
};

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
};

export function Button({ variant = 'secondary', size = 'md', icon, type = 'button', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,border-color,color,transform] duration-[120ms] ease-out active:scale-[.98] disabled:cursor-not-allowed disabled:active:scale-100 ${buttonSizes[size]} ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

type IconButtonProps = ComponentProps<'button'> & {
  icon: IconName;
  label: string;
  shortcut?: string;
  size?: 'sm' | 'md';
  tooltipSide?: Placement;
};

/** Icon-only button: always carries an aria-label and a tooltip */
export function IconButton({ icon, label, shortcut, size = 'sm', tooltipSide = 'bottom', type = 'button', className = '', ...props }: IconButtonProps) {
  return (
    <Tooltip label={label} shortcut={shortcut} placement={tooltipSide}>
      <button
        type={type}
        aria-label={label}
        className={`inline-flex shrink-0 items-center justify-center rounded-full text-secondary transition-colors duration-[120ms] ease-out hover:bg-surface-sunken hover:text-primary disabled:cursor-not-allowed disabled:text-disabled disabled:hover:bg-transparent ${size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'} ${className}`}
        {...props}
      >
        <Icon name={icon} size={size === 'sm' ? 16 : 20} />
      </button>
    </Tooltip>
  );
}

/* ---------- Floating layer (tooltips, menus) ---------- */

type Placement = 'bottom' | 'bottom-start' | 'bottom-end' | 'right';

const EDGE = 8;

function Floating({
  anchor,
  placement,
  gap,
  elementRef,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  anchor: AnchorRect;
  placement: Placement;
  gap: number;
  elementRef: RefObject<HTMLDivElement | null>;
}) {
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    let top: number;
    let left: number;
    if (placement === 'right') {
      left = anchor.right + gap;
      top = (anchor.top + anchor.bottom) / 2 - height / 2;
    } else {
      top = anchor.bottom + gap;
      if (top + height > window.innerHeight - EDGE) top = anchor.top - gap - height;
      if (placement === 'bottom-start') left = anchor.left;
      else if (placement === 'bottom-end') left = anchor.right - width;
      else left = (anchor.left + anchor.right) / 2 - width / 2;
    }
    left = Math.min(Math.max(left, EDGE), window.innerWidth - width - EDGE);
    top = Math.min(Math.max(top, EDGE), window.innerHeight - height - EDGE);
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
    element.style.visibility = 'visible';
  }, [anchor, placement, gap, elementRef]);

  return createPortal(
    <div ref={elementRef} style={{ position: 'fixed', top: 0, left: 0, visibility: 'hidden', ...style }} {...props} />,
    document.body,
  );
}

/* ---------- Tooltip ---------- */

export function Tooltip({
  label,
  shortcut,
  placement = 'bottom',
  children,
}: {
  label: string;
  shortcut?: string;
  placement?: Placement;
  children: ReactNode;
}) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);

  const show = (delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (triggerRef.current) setAnchor(toAnchor(triggerRef.current));
    }, delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setAnchor(null);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <span
      ref={triggerRef}
      className="inline-flex"
      onMouseEnter={() => show(500)}
      onMouseLeave={hide}
      onFocus={(event) => {
        if (event.target.matches(':focus-visible')) show(0);
      }}
      onBlur={hide}
      onMouseDown={hide}
    >
      {children}
      {anchor && (
        <Floating
          anchor={anchor}
          placement={placement}
          gap={8}
          elementRef={bubbleRef}
          role="tooltip"
          className="pointer-events-none z-[60] flex max-w-[240px] items-center gap-2 rounded-sm bg-primary px-2 py-1 text-[12px] leading-4 text-on-primary"
        >
          {label}
          {shortcut && <span className="font-mono text-[11px] opacity-80">{shortcut}</span>}
        </Floating>
      )}
    </span>
  );
}

/* ---------- Menu / dropdown / context menu ---------- */

export interface MenuItem {
  label: string;
  icon?: IconName;
  shortcut?: string;
  selected?: boolean;
  destructive?: boolean;
  dividerBefore?: boolean;
  onSelect: () => void;
}

export function Menu({
  anchor,
  placement = 'bottom-end',
  header,
  label,
  items,
  triggerRef,
  onClose,
}: {
  anchor: AnchorRect;
  placement?: Placement;
  header?: string;
  label: string;
  items: MenuItem[];
  triggerRef?: RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    menuRef.current?.focus();
    const dismiss = () => onCloseRef.current();
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef?.current?.contains(target)) return;
      dismiss();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('scroll', dismiss, true);
    window.addEventListener('resize', dismiss);
    window.addEventListener('blur', dismiss);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('scroll', dismiss, true);
      window.removeEventListener('resize', dismiss);
      window.removeEventListener('blur', dismiss);
      previouslyFocused?.focus();
    };
  }, [triggerRef]);

  const select = (item: MenuItem) => {
    onClose();
    item.onSelect();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActive((index) => (index >= last ? 0 : index + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActive((index) => (index <= 0 ? last : index - 1));
        break;
      case 'Home':
        event.preventDefault();
        setActive(0);
        break;
      case 'End':
        event.preventDefault();
        setActive(last);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (active >= 0) select(items[active]);
        break;
      case 'Escape':
        event.stopPropagation();
        onClose();
        break;
      case 'Tab':
        event.preventDefault();
        onClose();
        break;
    }
  };

  return (
    <Floating
      anchor={anchor}
      placement={placement}
      gap={4}
      elementRef={menuRef}
      role="menu"
      aria-label={label}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onContextMenu={(event) => event.preventDefault()}
      className="z-50 min-w-[200px] animate-fade-in rounded-lg border border-border bg-surface p-1 shadow-e3 dark:bg-surface-muted"
    >
      {header && <div className="px-3 pb-1 pt-2 text-overline font-bold uppercase text-secondary">{header}</div>}
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {item.dividerBefore && <div role="separator" className="mx-1 my-1 h-px bg-border" />}
          <button
            type="button"
            role={item.selected === undefined ? 'menuitem' : 'menuitemradio'}
            aria-checked={item.selected}
            tabIndex={-1}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(-1)}
            onClick={() => select(item)}
            className={`flex h-8 w-full items-center gap-2 rounded-md px-3 text-left text-body ${
              item.destructive ? 'text-error' : 'text-primary'
            } ${index === active ? (item.destructive ? 'bg-error-tint' : 'bg-surface-sunken') : ''}`}
          >
            {item.icon && <Icon name={item.icon} size={16} />}
            <span className="flex-1">{item.label}</span>
            {item.shortcut && <span className="font-mono text-[12px] text-secondary">{item.shortcut}</span>}
            {item.selected && <Icon name="check" size={16} className="text-accent-pressed" />}
          </button>
        </Fragment>
      ))}
    </Floating>
  );
}

/* ---------- Checkbox ---------- */

export function Checkbox({
  checked,
  indeterminate = false,
  label,
  onChange,
  tabIndex,
}: {
  checked: boolean;
  indeterminate?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  tabIndex?: number;
}) {
  const filled = checked || indeterminate;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label}
      tabIndex={tabIndex}
      onClick={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm border-[1.75px] border-primary transition-colors duration-[120ms] ${
        filled ? 'bg-primary text-on-primary' : 'hover:bg-surface-sunken'
      }`}
    >
      {checked && <Icon name="check" size={12} className="[stroke-width:2.5]" />}
      {!checked && indeterminate && <span className="h-0.5 w-2 rounded-full bg-on-primary" />}
    </button>
  );
}

/* ---------- Form fields ---------- */

const fieldClass = (error: boolean) =>
  `w-full rounded-md bg-surface px-3 text-body text-primary placeholder:text-secondary transition-colors duration-[120ms] ${
    error
      ? 'border-[1.5px] border-error'
      : 'border border-border-strong hover:border-secondary focus:border-[1.5px] focus:border-primary'
  }`;

export function Field({
  label,
  required = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: (props: { id: string; invalid: boolean; describedBy?: string }) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline gap-2">
        <label htmlFor={id} className={`text-label font-semibold ${error ? 'text-error' : 'text-primary'}`}>
          {label}
        </label>
        {required && <span className="text-label text-secondary">Required</span>}
      </div>
      {children({ id, invalid: !!error, describedBy: error ? errorId : undefined })}
      {error && (
        <p id={errorId} className="mt-1.5 text-caption text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ invalid = false, className = '', ...props }: ComponentProps<'input'> & { invalid?: boolean }) {
  return <input type="text" aria-invalid={invalid} className={`h-10 ${fieldClass(invalid)} ${className}`} {...props} />;
}

export function TextArea({ invalid = false, className = '', ...props }: ComponentProps<'textarea'> & { invalid?: boolean }) {
  return <textarea aria-invalid={invalid} className={`min-h-24 resize-y py-2.5 ${fieldClass(invalid)} ${className}`} {...props} />;
}

/* ---------- Choice chips (segmented choice) ---------- */

export function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`h-8 rounded-md px-3 text-[13px] text-primary transition-colors duration-[140ms] ease-out ${
              selected
                ? 'border-[1.5px] border-primary bg-surface-sunken font-semibold'
                : 'border border-border-strong font-medium hover:bg-surface-muted'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

import { shortcut } from '../utils/format';
import Icon, { type IconName } from './Icon';
import Logo from './Logo';
import { IconButton, Tooltip } from './ui';

export type Page = 'items' | 'settings';

interface SidebarProps {
  page: Page;
  collapsed: boolean;
  onNavigate: (page: Page) => void;
  onToggleCollapsed: () => void;
}

/** Left navigation — DESIGN.md §07 Sidebar. Collapses to a 72px rail in compact windows. */
export default function Sidebar({ page, collapsed, onNavigate, onToggleCollapsed }: SidebarProps) {
  return (
    <nav
      aria-label="Main"
      className={`flex shrink-0 flex-col border-r border-border bg-surface-muted pb-3 transition-[width] duration-150 ease-standard ${
        collapsed ? 'w-[72px]' : 'w-60'
      }`}
    >
      <div className={`flex h-14 shrink-0 items-center ${collapsed ? 'justify-center' : 'justify-between pl-5 pr-3'}`}>
        {!collapsed && (
          <span className="flex items-center gap-2">
            <Logo size={22} />
            <span className="text-[20px] font-extrabold leading-none tracking-[-0.03em]">stockup</span>
          </span>
        )}
        <IconButton
          icon="sidebar"
          label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          shortcut={shortcut('\\')}
          tooltipSide={collapsed ? 'right' : 'bottom'}
          onClick={onToggleCollapsed}
        />
      </div>

      {!collapsed && <div className="px-5 pb-1 pt-4 text-overline font-bold uppercase text-secondary">Inventory</div>}
      <div className={`flex flex-col gap-0.5 ${collapsed ? 'pt-4' : ''}`}>
        <NavButton icon="box" label="Items" active={page === 'items'} collapsed={collapsed} onClick={() => onNavigate('items')} />
      </div>

      <div className="mt-auto flex flex-col gap-0.5">
        <NavButton
          icon="filters"
          label="Settings"
          active={page === 'settings'}
          collapsed={collapsed}
          onClick={() => onNavigate('settings')}
        />
      </div>
    </nav>
  );
}

function NavButton({
  icon,
  label,
  shortcut: keys,
  active,
  collapsed,
  onClick,
}: {
  icon: IconName;
  label: string;
  shortcut?: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const button = (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? label : undefined}
      onClick={onClick}
      className={`relative flex h-9 items-center gap-3 rounded-md text-label transition-colors duration-[120ms] ease-out ${
        collapsed ? 'mx-auto w-10 justify-center' : 'mx-2 px-3'
      } ${
        active
          ? 'bg-surface font-semibold text-primary'
          : 'font-medium text-secondary hover:bg-surface-sunken hover:text-primary'
      }`}
    >
      {active && <span aria-hidden="true" className={`absolute top-2 h-5 w-[3px] rounded-r-full bg-accent ${collapsed ? '-left-4' : '-left-2'}`} />}
      <Icon name={icon} size={20} />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );

  if (!collapsed && !keys) return button;
  return (
    <Tooltip label={label} shortcut={keys} placement={collapsed ? 'right' : 'bottom'}>
      {button}
    </Tooltip>
  );
}

export const isMac = navigator.platform.toUpperCase().includes('MAC');

/** Ctrl on Windows/Linux, ⌘ on macOS — DESIGN.md §07 keyboard shortcuts */
export const modKey = isMac ? '⌘' : 'Ctrl';

export const shortcut = (...keys: string[]) => [modKey, ...keys].join(isMac ? '' : ' + ');

const pad = (value: number) => String(value).padStart(2, '0');

/** SQLite CURRENT_TIMESTAMP is UTC "YYYY-MM-DD HH:MM:SS"; show it in local time as "YYYY-MM-DD HH:MM" */
export const formatTimestamp = (timestamp: string) => {
  const date = new Date(`${timestamp.replace(' ', 'T')}Z`);
  if (Number.isNaN(date.getTime())) return timestamp;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const plural = (count: number, noun: string) => `${count} ${noun}${count === 1 ? '' : 's'}`;

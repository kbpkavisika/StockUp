import type { ReactNode } from 'react';

/** 56px page header — DESIGN.md §07 Page header */
export default function PageHeader({ title, meta, children }: { title: string; meta?: string; children?: ReactNode }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-6 min-[1024px]:px-8">
      <h1 className="text-h3 font-semibold">{title}</h1>
      {meta && <span className="text-caption text-secondary">{meta}</span>}
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </header>
  );
}

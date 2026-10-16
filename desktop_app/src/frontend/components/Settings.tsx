import { useContext } from 'react';
import type { ReactNode } from 'react';
import { dbPath } from '../../backend/database';
import { ThemeContext, type ThemePreference } from '../theme';
import type { Density } from '../utils/sort';
import PageHeader from './PageHeader';
import { Button, ChoiceGroup } from './ui';

type ElectronShell = { shell: { showItemInFolder: (path: string) => void } };
const electron = (window as unknown as { require: (name: 'electron') => ElectronShell }).require('electron');

/** DESIGN.md §09 screen 05 · Settings */
export default function Settings({ density, onDensityChange }: { density: Density; onDensityChange: (density: Density) => void }) {
  const { preference, setPreference } = useContext(ThemeContext);

  return (
    <>
      <PageHeader title="Settings" />
      <div className="flex-1 overflow-auto px-6 py-6 min-[1024px]:px-8 min-[1024px]:py-8">
        <div className="max-w-[720px] space-y-8">
          <Section title="Appearance">
            <Row label="Theme" hint="System follows your operating system setting.">
              <ChoiceGroup<ThemePreference>
                label="Theme"
                value={preference}
                onChange={setPreference}
                options={[
                  { value: 'system', label: 'System' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
              />
            </Row>
            <Row label="Table density" hint="Compact fits more rows on screen.">
              <ChoiceGroup<Density>
                label="Table density"
                value={density}
                onChange={onDensityChange}
                options={[
                  { value: 'comfortable', label: 'Comfortable' },
                  { value: 'compact', label: 'Compact' },
                ]}
              />
            </Row>
          </Section>

          <Section title="Data">
            <Row label="Database location" hint={dbPath} hintMono>
              <Button size="sm" onClick={() => electron.shell.showItemInFolder(dbPath)}>
                Show in folder
              </Button>
            </Row>
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-h3 font-semibold">{title}</h2>
      <div className="border-t border-border">{children}</div>
    </section>
  );
}

function Row({ label, hint, hintMono = false, children }: { label: string; hint: string; hintMono?: boolean; children: ReactNode }) {
  return (
    <div className="flex min-h-14 items-center gap-6 border-b border-border py-3">
      <div className="min-w-0 flex-1">
        <div className="text-label font-semibold">{label}</div>
        <div className={`mt-0.5 truncate text-caption text-secondary ${hintMono ? 'font-mono' : ''}`} title={hint}>
          {hint}
        </div>
      </div>
      {children}
    </div>
  );
}

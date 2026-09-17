import { useEffect, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface TabDefinition {
  id: string;
  label: string;
  icon?: LucideIcon;
  /** Dimmed when the backend returned nothing for this section. */
  empty?: boolean;
}

interface ResultTabsProps {
  tabs: TabDefinition[];
  activeId: string;
  onChange: (id: string) => void;
}

/** Horizontally scrollable tab bar with roving keyboard navigation. */
export function ResultTabs({ tabs, activeId, onChange }: ResultTabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    active?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [activeId]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const index = tabs.findIndex((tab) => tab.id === activeId);
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;
    onChange(tabs[next].id);
  };

  return (
    <div className="sticky top-16 z-30 -mx-5 border-b border-white/[0.07] bg-ink-950/85 px-5 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="relative">
        {/* Below lg the strip scrolls; the fade signals there is more to the right.
            From lg up it wraps instead, so every section stays visible. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-ink-950 via-ink-950/80 to-transparent lg:hidden"
        />
        <div
          ref={listRef}
          role="tablist"
          aria-label="Production package sections"
          onKeyDown={onKeyDown}
          className="flex flex-nowrap gap-1 overflow-x-auto py-2 pr-10 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible lg:pr-0 [&::-webkit-scrollbar]:hidden"
        >
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={active}
              aria-controls={`panel-${tab.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(tab.id)}
              className={`group relative inline-flex flex-none items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-[13.5px] transition-all duration-200 ${
                active
                  ? 'bg-white/[0.07] text-slate-50'
                  : tab.empty
                    ? 'text-slate-600 hover:bg-white/[0.03] hover:text-slate-400'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
              }`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {tab.label}
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-1 h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/80 to-violet-400/0"
                />
              )}
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeId: string;
  children: React.ReactNode;
}

export function TabPanel({ id, activeId, children }: TabPanelProps) {
  if (id !== activeId) return null;
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      className="animate-fade-in focus:outline-none"
    >
      {children}
    </div>
  );
}

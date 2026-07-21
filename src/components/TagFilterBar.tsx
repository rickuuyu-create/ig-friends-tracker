import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, Tag, X } from 'lucide-react';
import { TagUsage } from '../lib/tags';
import { useI18n } from '../i18n';
import { cn } from '../lib/utils';

interface TagFilterBarProps {
  tags: TagUsage[];
  selected: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}

export default function TagFilterBar({ tags, selected, onToggle, onClear }: TagFilterBarProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const quickTags = tags.slice(0, 3);
  const selectedKeys = new Set(selected.map((tag) => tag.toLocaleLowerCase()));
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return q ? tags.filter((tag) => tag.label.toLocaleLowerCase().includes(q)) : tags;
  }, [query, tags]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', escape);
    };
  }, []);

  if (tags.length === 0) return null;

  return (
    <div ref={rootRef} className="relative" data-tour="tag-filters">
      <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_auto] items-center gap-1.5 pb-1">
        {quickTags.map((tag) => {
          const active = selectedKeys.has(tag.key);
          return (
            <button
              key={tag.key}
              type="button"
              onClick={() => onToggle(tag.label)}
              className={cn(
                'inline-flex h-8 min-w-0 items-center justify-center gap-1 rounded-md border px-2 text-xs font-medium transition-colors',
                active
                  ? 'border-indigo-200 bg-indigo-100 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:text-indigo-700',
              )}
              aria-pressed={active}
            >
              {active ? <Check className="h-3 w-3" /> : <Tag className="h-3 w-3" />}
              <span className="truncate">{tag.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={cn(
            'inline-flex h-8 flex-none items-center gap-1 rounded-md border px-2.5 text-xs font-medium transition-colors',
            open || selected.length > 0
              ? 'border-gray-300 bg-gray-100 text-gray-800'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
          )}
          aria-expanded={open}
        >
          {t('tags.more')}
          {selected.length > 0 && <span className="rounded-full bg-indigo-600 px-1.5 text-[10px] text-white">{selected.length}</span>}
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
        </button>
      </div>

      {selected.length > 0 && (
        <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="flex-none text-[11px] text-gray-400">{t('tags.matchAll')}</span>
          {selected.map((tag) => (
            <button
              key={tag.toLocaleLowerCase()}
              type="button"
              onClick={() => onToggle(tag)}
              className="inline-flex h-6 flex-none items-center gap-1 rounded bg-indigo-50 px-1.5 text-[11px] font-medium text-indigo-700"
            >
              {tag}<X className="h-3 w-3" />
            </button>
          ))}
          <button type="button" onClick={onClear} className="flex-none text-[11px] font-medium text-gray-500 underline hover:text-gray-800">
            {t('common.clearAll')}
          </button>
        </div>
      )}

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-100 p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-md bg-gray-100 py-2 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder={t('tags.search')}
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-gray-400">{t('tags.none')}</p>
            ) : filtered.map((tag) => {
              const active = selectedKeys.has(tag.key);
              return (
                <button
                  key={tag.key}
                  type="button"
                  onClick={() => onToggle(tag.label)}
                  className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm hover:bg-gray-50"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className={cn('flex h-5 w-5 flex-none items-center justify-center rounded border', active ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300')}>
                      {active && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="truncate text-gray-700">{tag.label}</span>
                  </span>
                  <span className="text-xs text-gray-400">{tag.count}</span>
                </button>
              );
            })}
          </div>
          {selected.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2">
              <span className="text-xs text-gray-500">{t('tags.selected', { count: selected.length })}</span>
              <button type="button" onClick={onClear} className="text-xs font-medium text-indigo-600 hover:underline">
                {t('common.clearAll')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

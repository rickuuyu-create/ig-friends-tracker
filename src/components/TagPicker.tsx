import { useMemo, useState } from 'react';
import { Plus, Tag, X } from 'lucide-react';
import { FriendRecord } from '../lib/api';
import { collectTagUsage, parseTags, serializeTags } from '../lib/tags';
import { useI18n } from '../i18n';
import { cn } from '../lib/utils';

interface TagPickerProps {
  value: string;
  onChange: (value: string) => void;
  friends: FriendRecord[];
  tourId?: string;
}

export default function TagPicker({ value, onChange, friends, tourId }: TagPickerProps) {
  const { t } = useI18n();
  const [draft, setDraft] = useState('');
  const selected = useMemo(() => parseTags(value), [value]);
  const usage = useMemo(() => collectTagUsage(friends), [friends]);
  const selectedKeys = new Set(selected.map((tag) => tag.toLocaleLowerCase()));
  const suggestions = usage.filter((tag) => !selectedKeys.has(tag.key));

  const addTags = (raw: string) => {
    const additions = parseTags(raw);
    if (additions.length > 0) onChange(serializeTags([...selected, ...additions]));
    setDraft('');
  };

  const removeTag = (tag: string) => {
    const key = tag.toLocaleLowerCase();
    onChange(serializeTags(selected.filter((item) => item.toLocaleLowerCase() !== key)));
  };

  const handleDraftChange = (next: string) => {
    if (next.includes(',')) {
      const parts = next.split(',');
      addTags(parts.slice(0, -1).join(','));
      setDraft(parts.at(-1) || '');
      return;
    }
    setDraft(next);
  };

  return (
    <div data-tour={tourId}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{t('tags.label')}</label>
      <div className="rounded-lg border border-gray-300 bg-white p-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
        {selected.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {selected.map((tag) => (
              <button
                key={tag.toLocaleLowerCase()}
                type="button"
                onClick={() => removeTag(tag)}
                className="inline-flex h-7 items-center gap-1 rounded-md bg-indigo-100 px-2 text-xs font-medium text-indigo-700 hover:bg-indigo-200"
                title={t('common.remove')}
              >
                <Tag className="h-3 w-3" />
                {tag}
                <X className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(event) => handleDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault();
                addTags(draft);
              }
            }}
            onBlur={() => draft.trim() && addTags(draft)}
            onPaste={(event) => {
              const text = event.clipboardData.getData('text');
              if (text.includes(',')) {
                event.preventDefault();
                addTags(text);
              }
            }}
            className="min-w-0 flex-1 border-0 px-1 py-1 text-sm outline-none"
            placeholder={t('tags.addPlaceholder')}
          />
          <button
            type="button"
            onClick={() => addTags(draft)}
            disabled={!draft.trim()}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-indigo-600 hover:bg-indigo-50 disabled:opacity-30"
            title={t('tags.label')}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-2">
        <div className="mb-1.5">
          <p className="text-xs font-medium text-gray-500">{t('tags.suggestions')}</p>
          <p className="mt-0.5 text-[11px] leading-tight text-gray-400">{t('tags.browseHint')}</p>
        </div>
        {suggestions.length > 0 ? (
          <div className="flex snap-x gap-1.5 overflow-x-auto pb-2 [scrollbar-width:thin]">
            {suggestions.map((tag) => (
              <button
                key={tag.key}
                type="button"
                onClick={() => addTags(tag.label)}
                className={cn(
                  'inline-flex h-8 flex-none snap-start items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 text-xs font-medium text-gray-600',
                  'hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700',
                )}
              >
                <Plus className="h-3 w-3" />
                {tag.label}
                <span className="text-[10px] text-gray-400">{tag.count}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="pb-1 text-xs text-gray-400">{t('tags.emptyHint')}</p>
        )}
      </div>
    </div>
  );
}

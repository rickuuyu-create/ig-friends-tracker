import { Globe2 } from 'lucide-react';
import { useI18n } from '../i18n';
import { cn } from '../lib/utils';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useI18n();

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm" aria-label="Language">
      {!compact && <Globe2 className="ml-1 h-4 w-4 text-gray-400" />}
      {(['en', 'zh-TW'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={cn(
            'h-7 min-w-9 rounded-md px-2 text-xs font-semibold transition-colors',
            language === option ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800',
          )}
          aria-pressed={language === option}
        >
          {option === 'en' ? 'EN' : '繁中'}
        </button>
      ))}
    </div>
  );
}

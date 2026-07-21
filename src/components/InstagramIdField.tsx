import { useState } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { hasApifyToken, fetchInstagramProfile, type IgProfile } from '../lib/apify';
import { useI18n } from '../i18n';

interface InstagramIdFieldProps {
  value: string;
  onChange: (value: string) => void;
  username?: string;
  onProfile?: (profile: IgProfile) => void;
}

const LOOKUP_URL = 'https://commentpicker.com/instagram-user-id.php';

export default function InstagramIdField({ value, onChange, username, onProfile }: InstagramIdFieldProps) {
  const { t } = useI18n();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const canAutoFetch = !!onProfile && hasApifyToken();

  const handleAutoFetch = async () => {
    if (!username?.trim()) {
      setError(t('instagramId.enterUsername'));
      return;
    }
    setError('');
    setIsFetching(true);
    try {
      const profile = await fetchInstagramProfile(username);
      if (!profile) {
        setError(t('instagramId.notFound'));
        return;
      }
      onProfile?.(profile);
    } catch (err: any) {
      setError(err?.message || t('instagramId.lookupFailed'));
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div data-tour="instagram-id">
      <div className="mb-1 flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-gray-700">{t('instagramId.label')}</label>
        {canAutoFetch && (
          <button
            type="button"
            onClick={handleAutoFetch}
            disabled={isFetching}
            className="flex flex-none items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
          >
            {isFetching ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {isFetching ? t('instagramId.fetching') : t('instagramId.autoFetch')}
          </button>
        )}
      </div>
      <input
        type="text"
        inputMode="numeric"
        name="instagramUserId"
        value={value}
        onChange={(event) => onChange(event.target.value.trim())}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
        placeholder="e.g. 1234567890"
      />
      <div className="mt-1.5 flex items-start justify-between gap-3">
        <p className="text-xs leading-tight text-gray-500">
          {error ? <span className="text-red-600">{error}</span> : t('instagramId.hint')}
        </p>
        <a
          href={LOOKUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-none items-center gap-0.5 whitespace-nowrap text-xs font-medium text-indigo-600 hover:underline"
        >
          {t('instagramId.find')}<ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

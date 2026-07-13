import { useState } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { hasApifyToken, fetchInstagramProfile, IgProfile } from '../lib/apify';

interface InstagramIdFieldProps {
  value: string;
  onChange: (value: string) => void;
  username?: string;
  onProfile?: (profile: IgProfile) => void;
}

// Free, no-account tool for turning a username into its permanent numeric ID.
const LOOKUP_URL = 'https://commentpicker.com/instagram-user-id.php';

export default function InstagramIdField({ value, onChange, username, onProfile }: InstagramIdFieldProps) {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const canAutoFetch = !!onProfile && hasApifyToken();

  const handleAutoFetch = async () => {
    if (!username?.trim()) { setError('Enter a username first.'); return; }
    setError('');
    setIsFetching(true);
    try {
      const profile = await fetchInstagramProfile(username);
      if (!profile) { setError('Profile not found. Check the username.'); return; }
      onProfile?.(profile);
    } catch (err: any) {
      setError(err?.message || 'Lookup failed.');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">Instagram User ID (Optional)</label>
        {canAutoFetch && (
          <button
            type="button"
            onClick={handleAutoFetch}
            disabled={isFetching}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
          >
            {isFetching ? (
              <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {isFetching ? 'Fetching…' : 'Auto-fetch'}
          </button>
        )}
      </div>
      <input
        type="text"
        inputMode="numeric"
        name="instagramUserId"
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
        placeholder="e.g. 1234567890"
      />
      <div className="flex items-start justify-between gap-3 mt-1.5">
        <p className="text-xs text-gray-500 leading-tight">
          {error
            ? <span className="text-red-600">{error}</span>
            : 'The permanent ID stays the same even if they change their username.'}
        </p>
        <a
          href={LOOKUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-0.5 text-xs font-medium text-indigo-600 whitespace-nowrap hover:underline"
        >
          Find ID
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

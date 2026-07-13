// Optional integration: each user supplies their OWN Apify token, stored only in
// their browser (localStorage). Calls go straight from the browser to Apify
// (which allows CORS), so the app owner never sees the token or pays for usage.

const TOKEN_KEY = 'ig_friends_apify_token';
const ACTOR = 'apify~instagram-profile-scraper';

export const getApifyToken = (): string => {
  try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
};

export const setApifyToken = (token: string): void => {
  try {
    const t = token.trim();
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* ignore storage errors */ }
};

export const hasApifyToken = (): boolean => !!getApifyToken();

export interface IgProfile {
  id: string;
  username: string;
  fullName: string;
  profilePicUrl: string;
}

export const fetchInstagramProfile = async (username: string): Promise<IgProfile | null> => {
  const token = getApifyToken();
  if (!token) throw new Error('No Apify token set. Add one in Settings.');
  const handle = username.trim().replace(/^@/, '');
  if (!handle) throw new Error('Enter a username first.');

  const controller = new AbortController();
  // Actor runs can take up to a minute; give it room before giving up.
  const timer = setTimeout(() => controller.abort(), 120000);
  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernames: [handle] }),
        signal: controller.signal,
      }
    );
    if (!res.ok) {
      if (res.status === 401) throw new Error('Invalid Apify token.');
      throw new Error(`Apify request failed (${res.status}).`);
    }
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) return null;
    const p = items[0];
    if (!p || !p.id || p.error) return null;
    return {
      id: String(p.id),
      username: String(p.username || handle),
      fullName: String(p.fullName || ''),
      profilePicUrl: String(p.profilePicUrl || ''),
    };
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new Error('Lookup timed out. Please try again.');
    throw err;
  } finally {
    clearTimeout(timer);
  }
};

import { FriendRecord } from './api';

export const splitHistory = (value?: string): string[] =>
  value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

// Append a username to the history list if it isn't already there (case-insensitive).
export const withUsername = (history: string[], username: string): string[] => {
  const u = username.trim();
  if (!u) return history;
  if (history.some(h => h.toLowerCase() === u.toLowerCase())) return history;
  return [...history, u];
};

// Usernames the person used before their current one.
export const previousUsernames = (friend: FriendRecord): string[] =>
  splitHistory(friend.usernameHistory).filter(
    u => u.toLowerCase() !== (friend.username || '').trim().toLowerCase()
  );

// Compute the identity fields to store when a friend's username may have changed.
// `previousUsername` is the username the record had before this save.
export const buildIdentityFields = (
  friend: FriendRecord,
  previousUsername: string
): Pick<FriendRecord, 'originalUsername' | 'usernameHistory'> => {
  const seed = splitHistory(friend.usernameHistory);
  const base = seed.length ? seed : (previousUsername ? [previousUsername] : []);
  const history = withUsername(base, friend.username);
  return {
    originalUsername: friend.originalUsername || previousUsername || friend.username,
    usernameHistory: history.join(', '),
  };
};

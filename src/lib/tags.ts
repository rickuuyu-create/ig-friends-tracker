import type { FriendRecord } from './api';

export interface TagUsage {
  label: string;
  count: number;
  key: string;
}

export const parseTags = (value: string): string[] => {
  const seen = new Set<string>();
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => {
      const key = tag.toLocaleLowerCase();
      if (!tag || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

export const serializeTags = (tags: string[]): string => parseTags(tags.join(',')).join(', ');

export const collectTagUsage = (friends: FriendRecord[]): TagUsage[] => {
  const usage = new Map<string, TagUsage>();
  friends.forEach((friend) => {
    parseTags(friend.tags).forEach((label) => {
      const key = label.toLocaleLowerCase();
      const current = usage.get(key);
      if (current) current.count += 1;
      else usage.set(key, { label, count: 1, key });
    });
  });
  return [...usage.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
};

export const hasEveryTag = (value: string, selected: string[]): boolean => {
  if (selected.length === 0) return true;
  const tags = new Set(parseTags(value).map((tag) => tag.toLocaleLowerCase()));
  return selected.every((tag) => tags.has(tag.toLocaleLowerCase()));
};

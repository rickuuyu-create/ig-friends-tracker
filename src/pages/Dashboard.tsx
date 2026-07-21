import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, MapPin, Plus, RefreshCw, Search, Settings, Tag, UserCircle } from 'lucide-react';
import { FriendRecord, fetchFriends } from '../lib/api';
import { getAccessToken, logout } from '../lib/firebase';
import IgAvatar from '../components/IgAvatar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import TagFilterBar from '../components/TagFilterBar';
import { cn } from '../lib/utils';
import { collectTagUsage, hasEveryTag, parseTags } from '../lib/tags';
import { useI18n } from '../i18n';

type SortKey = 'recent' | 'followup' | 'name';

const parseTime = (value: string): number | null => {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
};

export default function Dashboard({ spreadsheetId }: { spreadsheetId: string }) {
  const { t } = useI18n();
  const [friends, setFriends] = useState<FriendRecord[]>([]);
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('recent');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const tagUsage = useMemo(() => collectTagUsage(friends), [friends]);
  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'recent', label: t('dashboard.recent') },
    { key: 'followup', label: t('dashboard.followup') },
    { key: 'name', label: t('dashboard.name') },
  ];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('No token');
      setFriends(await fetchFriends(token, spreadsheetId));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [spreadsheetId]);

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  const toggleTag = (tag: string) => {
    const key = tag.toLocaleLowerCase();
    setActiveTags((current) => current.some((item) => item.toLocaleLowerCase() === key)
      ? current.filter((item) => item.toLocaleLowerCase() !== key)
      : [...current, tag]);
  };

  const query = search.trim().toLocaleLowerCase();
  const filtered = friends.filter((friend) => {
    const matchesSearch = !query || [
      friend.username,
      friend.name,
      friend.tags,
      friend.occasion,
      friend.location,
      friend.notes,
      friend.usernameHistory || '',
    ].some((value) => value.toLocaleLowerCase().includes(query));
    return matchesSearch && hasEveryTag(friend.tags, activeTags);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return (a.name || a.username).localeCompare(b.name || b.username);
    if (sortBy === 'followup') {
      return (parseTime(a.reminderDate || '') ?? Infinity) - (parseTime(b.reminderDate || '') ?? Infinity);
    }
    return (parseTime(b.date) ?? -Infinity) - (parseTime(a.date) ?? -Infinity);
  });

  const getFollowUpStatus = (friend: FriendRecord) => {
    if (!friend.reminderDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reminder = new Date(friend.reminderDate);
    if (Number.isNaN(reminder.getTime())) return null;
    const days = Math.ceil((reminder.getTime() - today.getTime()) / 86400000);
    if (days === 0) return t('dashboard.today');
    if (days < 0) return t('dashboard.daysLate', { days: Math.abs(days) });
    return t('dashboard.inDays', { days });
  };

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <div className="flex items-center gap-1">
            <LanguageSwitcher compact />
            <button onClick={loadData} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100" title={t('common.sync')}>
              <RefreshCw className={cn('h-5 w-5', isLoading && 'animate-spin')} />
            </button>
            <Link data-tour="settings" to="/settings" className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100" title={t('common.settings')}>
              <Settings className="h-5 w-5" />
            </Link>
            <button onClick={handleLogout} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100" title={t('common.logout')}>
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative" data-tour="search">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder={t('dashboard.search')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-transparent bg-gray-100 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="mt-3 space-y-2" data-tour="tag-tools">
          <div className="flex w-fit rounded-lg bg-gray-100 p-0.5">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSortBy(option.key)}
                className={cn(
                  'h-8 rounded-md px-3 text-xs font-medium transition-colors',
                  sortBy === option.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <TagFilterBar tags={tagUsage} selected={activeTags} onToggle={toggleTag} onClear={() => setActiveTags([])} />
        </div>
      </header>

      <main className="flex-1 space-y-3 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <UserCircle className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p>{t('dashboard.noFriends')}</p>
            {(search || activeTags.length > 0) && <p className="mt-1 text-sm">{t('dashboard.tryDifferent')}</p>}
          </div>
        ) : sorted.map((friend) => (
          <article
            key={friend.id}
            tabIndex={0}
            role="link"
            onClick={() => navigate(`/view/${friend.id}`)}
            onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && navigate(`/view/${friend.id}`)}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="flex flex-wrap items-center gap-2 font-semibold text-gray-900">
                  <span className="truncate">{friend.name || friend.username}</span>
                  {getFollowUpStatus(friend) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                      {t('dashboard.followUpBadge')}
                      <span className="rounded bg-amber-200 px-1 text-[9px] lowercase text-amber-900">{getFollowUpStatus(friend)}</span>
                    </span>
                  )}
                </h2>
                <p className="mb-2 truncate text-sm font-medium text-indigo-600">@{friend.username}</p>
              </div>
              <IgAvatar username={friend.username} name={friend.name} customUrl={friend.photoUrl} className="h-12 w-12" />
            </div>
            <div className="mt-1 flex flex-col gap-1.5">
              {(friend.occasion || friend.location || friend.date) && (
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{[friend.occasion || friend.location, friend.date].filter(Boolean).join(' • ')}</span>
                </div>
              )}
              {friend.tags && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {parseTags(friend.tags).map((tag) => {
                    const active = activeTags.some((item) => item.toLocaleLowerCase() === tag.toLocaleLowerCase());
                    return (
                      <button
                        key={tag.toLocaleLowerCase()}
                        type="button"
                        onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleTag(tag); }}
                        className={cn(
                          'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
                          active ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600',
                        )}
                      >
                        <Tag className="mr-1 h-3 w-3" />{tag}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </article>
        ))}
      </main>

      <footer className="sticky bottom-0 border-t border-gray-200 bg-white p-4">
        <Link data-tour="add-friend" to="/add" className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700">
          <Plus className="h-5 w-5" />{t('dashboard.addFriend')}
        </Link>
      </footer>
    </div>
  );
}

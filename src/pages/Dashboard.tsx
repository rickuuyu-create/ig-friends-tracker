import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, UserCircle, MapPin, Tag, LogOut, RefreshCw, X, Settings } from 'lucide-react';
import { FriendRecord, fetchFriends } from '../lib/api';
import { getAccessToken, logout } from '../lib/firebase';
import IgAvatar from '../components/IgAvatar';
import { cn } from '../lib/utils';

type SortKey = 'recent' | 'followup' | 'name';
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recent', label: 'Recent' },
  { key: 'followup', label: 'Follow-up' },
  { key: 'name', label: 'Name' },
];

const parseTime = (value: string): number | null => {
  if (!value) return null;
  const t = new Date(value).getTime();
  return isNaN(t) ? null : t;
};

export default function Dashboard({ spreadsheetId }: { spreadsheetId: string }) {
  const [friends, setFriends] = useState<FriendRecord[]>([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('recent');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('No token');
      const data = await fetchFriends(token, spreadsheetId);
      setFriends(data);
    } catch (err) {
      console.error(err);
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

  const q = search.trim().toLowerCase();
  const filtered = friends.filter(f => {
    const matchesSearch = !q ||
      f.username.toLowerCase().includes(q) ||
      f.name.toLowerCase().includes(q) ||
      f.tags.toLowerCase().includes(q) ||
      f.occasion.toLowerCase().includes(q) ||
      (f.usernameHistory || '').toLowerCase().includes(q);
    const matchesTag = !activeTag ||
      f.tags.split(',').map(t => t.trim().toLowerCase()).includes(activeTag.toLowerCase());
    return matchesSearch && matchesTag;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') {
      return (a.name || a.username).localeCompare(b.name || b.username);
    }
    if (sortBy === 'followup') {
      const ra = parseTime(a.reminderDate || '');
      const rb = parseTime(b.reminderDate || '');
      return (ra ?? Infinity) - (rb ?? Infinity);
    }
    // recent: most recently met first; undated friends sink to the bottom.
    const da = parseTime(a.date);
    const db = parseTime(b.date);
    return (db ?? -Infinity) - (da ?? -Infinity);
  });

  const getFollowUpStatus = (f: FriendRecord) => {
    if (f.reminderDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const reminder = new Date(f.reminderDate);
      if (isNaN(reminder.getTime())) return null;
      
      const diffTime = reminder.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays < 0) return `${Math.abs(diffDays)}d late`;
      return `in ${diffDays}d`;
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">IG Friends</h1>
          <div className="flex gap-2">
            <button onClick={loadData} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" title="Sync">
              <RefreshCw className="w-5 h-5" />
            </button>
            <Link to="/settings" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" title="Settings">
              <Settings className="w-5 h-5" />
            </Link>
            <button onClick={handleLogout} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by IG, name, occasion, tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg transition-all"
          />
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                  sortBy === opt.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {activeTag && (
            <button
              onClick={() => setActiveTag('')}
              className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-xs font-medium hover:bg-indigo-200 transition-colors"
              title="Clear tag filter"
            >
              <Tag className="w-3 h-3" />
              {activeTag}
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <UserCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No friends found.</p>
            {(search || activeTag) && <p className="text-sm mt-1">Try a different search or tag.</p>}
          </div>
        ) : (
          sorted.map(f => (
            <Link to={`/view/${f.id}`} key={f.id} className="block bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {f.name || f.username}
                    {getFollowUpStatus(f) && (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Follow up 
                        <span className="bg-amber-200 text-amber-900 px-1 rounded text-[9px] lowercase leading-tight">
                          {getFollowUpStatus(f)}
                        </span>
                      </span>
                    )}
                  </h3>
                  <p className="text-indigo-600 text-sm font-medium mb-2">@{f.username}</p>
                </div>
                <IgAvatar 
                  username={f.username} 
                  name={f.name} 
                  customUrl={f.photoUrl} 
                  className="w-12 h-12"
                />
              </div>
              <div className="flex flex-col gap-1.5 mt-1">
                {f.occasion && (
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{f.occasion} • {f.date}</span>
                  </div>
                )}
                {f.tags && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {f.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                      <button
                        key={tag}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveTag(tag); }}
                        className={cn(
                          'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md transition-colors',
                          activeTag.toLowerCase() === tag.toLowerCase()
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                        )}
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
        <Link to="/add" className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Add Friend
        </Link>
      </div>
    </div>
  );
}

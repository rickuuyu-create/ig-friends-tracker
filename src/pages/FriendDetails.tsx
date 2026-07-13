import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, ExternalLink, Calendar, MapPin, Users, Tag, Trash2, Hash, History, ScanLine } from 'lucide-react';
import { FriendRecord, fetchFriends, deleteFriend, updateFriend } from '../lib/api';
import { getAccessToken } from '../lib/firebase';
import IgAvatar from '../components/IgAvatar';
import { isDataUrl } from '../lib/image';
import { previousUsernames } from '../lib/identity';
import { hasApifyToken, fetchInstagramProfile } from '../lib/apify';

export default function FriendDetails({ spreadsheetId }: { spreadsheetId: string }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [friend, setFriend] = useState<FriendRecord | null>(null);
  const [allFriends, setAllFriends] = useState<FriendRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRechecking, setIsRechecking] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const data = await fetchFriends(token, spreadsheetId);
        setAllFriends(data);
        const f = data.find(x => x.id === id);
        if (f) setFriend(f);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, spreadsheetId]);

  const handleRecheck = async () => {
    if (!friend) return;
    setIsRechecking(true);
    try {
      const profile = await fetchInstagramProfile(friend.username);
      if (!profile) {
        alert(`@${friend.username} wasn't found. They may have changed their username, gone private, or deleted the account.${friend.instagramUserId ? ` This person's saved ID is ${friend.instagramUserId}.` : ''}`);
        return;
      }
      if (friend.instagramUserId && profile.id !== friend.instagramUserId) {
        alert(`Heads up: @${friend.username} now belongs to a different account (ID ${profile.id}), but this person's ID is ${friend.instagramUserId}. They likely changed their username — edit this friend to update it.`);
        return;
      }
      const token = await getAccessToken();
      if (!token) throw new Error('Not authenticated');
      const today = new Date().toISOString().split('T')[0];
      const updated: FriendRecord = {
        ...friend,
        instagramUserId: friend.instagramUserId || profile.id,
        lastCheckedAt: today,
      };
      await updateFriend(token, spreadsheetId, updated, allFriends);
      setFriend(updated);
      alert(`✓ Still @${friend.username}. Verified today.`);
    } catch (err: any) {
      alert(err?.message || 'Re-check failed.');
    } finally {
      setIsRechecking(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this record? This action cannot be undone.');
    if (!confirmed || !friend) return;

    setIsDeleting(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated");
      await deleteFriend(token, spreadsheetId, friend.id, allFriends);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to delete.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-500 mb-4">Friend not found.</p>
        <Link to="/" className="text-indigo-600 font-medium">Go back</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <Link to={`/edit/${friend.id}`} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Edit2 className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white p-6 border-b border-gray-200 text-center flex flex-col items-center">
          <IgAvatar 
            username={friend.username} 
            name={friend.name} 
            customUrl={friend.photoUrl} 
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{friend.name || friend.username}</h1>
          <a 
            href={`https://instagram.com/${friend.username}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-indigo-600 font-medium hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-full mt-2"
          >
            @{friend.username}
            <ExternalLink className="w-4 h-4" />
          </a>
          {hasApifyToken() && (
            <button
              onClick={handleRecheck}
              disabled={isRechecking}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
            >
              {isRechecking ? (
                <div className="w-3.5 h-3.5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ScanLine className="w-3.5 h-3.5" />
              )}
              {isRechecking ? 'Checking…' : 'Re-check username'}
            </button>
          )}
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Context</h2>
            
            {friend.occasion && (
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Met at</p>
                  <p className="text-gray-900">{friend.occasion}</p>
                </div>
              </div>
            )}
            
            {friend.date && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date</p>
                  <p className="text-gray-900">{friend.date}</p>
                </div>
              </div>
            )}

            {friend.location && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Location</p>
                  <p className="text-gray-900">{friend.location}</p>
                </div>
              </div>
            )}
          </div>

          {(friend.tags || friend.notes || friend.photoUrl || friend.reminderDate || friend.instagramUserId || previousUsernames(friend).length > 0) && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Details</h2>

              {friend.instagramUserId && (
                <div className="flex items-start gap-3">
                  <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Instagram User ID</p>
                    <p className="text-gray-900 text-sm">{friend.instagramUserId}</p>
                    {friend.lastCheckedAt && (
                      <p className="text-xs text-gray-400 mt-0.5">Last checked {friend.lastCheckedAt}</p>
                    )}
                  </div>
                </div>
              )}

              {previousUsernames(friend).length > 0 && (
                <div className="flex items-start gap-3">
                  <History className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1.5">Also known as</p>
                    <div className="flex flex-wrap gap-1.5">
                      {previousUsernames(friend).map(u => (
                        <span key={u} className="inline-flex items-center text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                          @{u}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {friend.photoUrl && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 flex items-center justify-center text-gray-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm text-gray-500 font-medium mb-0.5">Avatar Source</p>
                    {isDataUrl(friend.photoUrl) ? (
                      <p className="text-xs text-gray-700">Uploaded photo (stored in your sheet)</p>
                    ) : (
                      <a href={friend.photoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 truncate block hover:underline">
                        {friend.photoUrl}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {friend.tags && (
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1.5">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {friend.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                        <span key={tag} className="inline-flex items-center text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {friend.reminderDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1.5">Reminder (Follow up)</p>
                    <p className="text-gray-900">{friend.reminderDate}</p>
                  </div>
                </div>
              )}

              {friend.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 font-medium mb-1">Notes</p>
                  <p className="text-gray-900 whitespace-pre-wrap">{friend.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit2, ExternalLink, Hash, History, Image as ImageIcon, MapPin, ScanLine, Tag, Trash2, Users } from 'lucide-react';
import { FriendRecord, deleteFriend, fetchFriends, updateFriend } from '../lib/api';
import { getAccessToken } from '../lib/firebase';
import IgAvatar from '../components/IgAvatar';
import { isDataUrl } from '../lib/image';
import { previousUsernames } from '../lib/identity';
import { fetchInstagramProfile, hasApifyToken } from '../lib/apify';
import { parseTags } from '../lib/tags';
import { useI18n } from '../i18n';

export default function FriendDetails({ spreadsheetId }: { spreadsheetId: string }) {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [friend, setFriend] = useState<FriendRecord | null>(null);
  const [allFriends, setAllFriends] = useState<FriendRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRechecking, setIsRechecking] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const data = await fetchFriends(token, spreadsheetId);
        setAllFriends(data);
        setFriend(data.find((item) => item.id === id) || null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, spreadsheetId]);

  const handleRecheck = async () => {
    if (!friend) return;
    setIsRechecking(true);
    try {
      const profile = await fetchInstagramProfile(friend.username);
      if (!profile) {
        alert(t('details.recheckNotFound', {
          username: friend.username,
          id: friend.instagramUserId ? ` ID: ${friend.instagramUserId}.` : '',
        }));
        return;
      }
      if (friend.instagramUserId && profile.id !== friend.instagramUserId) {
        alert(t('details.recheckIdMismatch', {
          username: friend.username,
          savedId: friend.instagramUserId,
          currentId: profile.id,
        }));
        return;
      }
      const token = await getAccessToken();
      if (!token) throw new Error(t('form.notAuthenticated'));
      const updated: FriendRecord = {
        ...friend,
        instagramUserId: friend.instagramUserId || profile.id,
        lastCheckedAt: new Date().toISOString().split('T')[0],
      };
      await updateFriend(token, spreadsheetId, updated, allFriends);
      setFriend(updated);
      alert(t('details.recheckVerified', { username: friend.username }));
    } catch (error: any) {
      alert(error?.message || t('details.recheckFailed'));
    } finally {
      setIsRechecking(false);
    }
  };

  const handleDelete = async () => {
    if (!friend || !window.confirm(t('details.deleteConfirm'))) return;
    setIsDeleting(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error(t('form.notAuthenticated'));
      await deleteFriend(token, spreadsheetId, friend.id, allFriends);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert(t('details.deleteFailed'));
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" /></div>;
  }

  if (!friend) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <p className="mb-4 text-gray-500">{t('details.friendNotFound')}</p>
        <Link to="/" className="font-medium text-indigo-600">{t('details.goBack')}</Link>
      </div>
    );
  }

  const oldUsernames = previousUsernames(friend);

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-gray-50">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
        <Link to="/" className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100" title={t('common.back')}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-1">
          <button onClick={handleDelete} disabled={isDeleting} className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 hover:bg-red-50 disabled:opacity-50" title={t('common.delete')}>
            <Trash2 className="h-5 w-5" />
          </button>
          <Link to={`/edit/${friend.id}`} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100" title={t('common.edit')}>
            <Edit2 className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <section className="flex flex-col items-center border-b border-gray-200 bg-white p-6 text-center">
          <IgAvatar username={friend.username} name={friend.name} customUrl={friend.photoUrl} className="mb-4 h-20 w-20" />
          <h1 className="mb-1 text-2xl font-bold text-gray-900">{friend.name || friend.username}</h1>
          <a href={`https://instagram.com/${friend.username}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-indigo-50 px-4 py-2 font-medium text-indigo-600 hover:text-indigo-800">
            @{friend.username}<ExternalLink className="h-4 w-4" />
          </a>
          {hasApifyToken() && (
            <button onClick={handleRecheck} disabled={isRechecking} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50">
              {isRechecking ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" /> : <ScanLine className="h-3.5 w-3.5" />}
              {isRechecking ? t('details.checking') : t('details.recheck')}
            </button>
          )}
        </section>

        <div className="space-y-4 p-4">
          <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase text-gray-400">{t('details.context')}</h2>
            {friend.occasion && <InfoRow icon={Users} label={t('details.metAt')} value={friend.occasion} />}
            {friend.date && <InfoRow icon={Calendar} label={t('details.date')} value={friend.date} />}
            {friend.location && <InfoRow icon={MapPin} label={t('details.location')} value={friend.location} />}
          </section>

          {(friend.tags || friend.notes || friend.photoUrl || friend.reminderDate || friend.instagramUserId || oldUsernames.length > 0) && (
            <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold uppercase text-gray-400">{t('details.details')}</h2>
              {friend.instagramUserId && (
                <InfoRow icon={Hash} label={t('details.instagramId')} value={friend.instagramUserId} hint={friend.lastCheckedAt ? t('details.lastChecked', { date: friend.lastCheckedAt }) : undefined} />
              )}
              {oldUsernames.length > 0 && (
                <div className="flex items-start gap-3">
                  <History className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="mb-1.5 text-sm font-medium text-gray-500">{t('details.alsoKnown')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {oldUsernames.map((username) => <span key={username} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">@{username}</span>)}
                    </div>
                  </div>
                </div>
              )}
              {friend.photoUrl && (
                <div className="flex items-start gap-3">
                  <ImageIcon className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-500">{t('details.avatarSource')}</p>
                    {isDataUrl(friend.photoUrl)
                      ? <p className="text-xs text-gray-700">{t('details.uploadedPhoto')}</p>
                      : <a href={friend.photoUrl} target="_blank" rel="noopener noreferrer" className="block truncate text-xs text-indigo-600 hover:underline">{friend.photoUrl}</a>}
                  </div>
                </div>
              )}
              {friend.tags && (
                <div className="flex items-start gap-3">
                  <Tag className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="mb-1.5 text-sm font-medium text-gray-500">{t('tags.label')}</p>
                    <div className="flex flex-wrap gap-2">
                      {parseTags(friend.tags).map((tag) => <span key={tag.toLocaleLowerCase()} className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{tag}</span>)}
                    </div>
                  </div>
                </div>
              )}
              {friend.reminderDate && <InfoRow icon={Calendar} label={t('details.reminder')} value={friend.reminderDate} />}
              {friend.notes && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="mb-1 text-sm font-medium text-gray-500">{t('details.notes')}</p>
                  <p className="whitespace-pre-wrap text-gray-900">{friend.notes}</p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, hint }: { icon: typeof Calendar; label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-5 w-5 text-gray-400" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="break-words text-gray-900">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
      </div>
    </div>
  );
}

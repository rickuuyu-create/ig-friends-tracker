import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { FriendRecord, fetchFriends, updateFriend } from '../lib/api';
import { getAccessToken } from '../lib/firebase';
import AvatarUploadField from '../components/AvatarUploadField';
import InstagramIdField from '../components/InstagramIdField';
import TagPicker from '../components/TagPicker';
import { buildIdentityFields } from '../lib/identity';
import { useI18n } from '../i18n';

const EMPTY_FRIEND: FriendRecord = {
  id: '', username: '', name: '', occasion: '', date: '', location: '', tags: '', notes: '',
  photoUrl: '', reminderDate: '', instagramUserId: '', originalUsername: '', usernameHistory: '', lastCheckedAt: '',
};

export default function EditFriend({ spreadsheetId }: { spreadsheetId: string }) {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allFriends, setAllFriends] = useState<FriendRecord[]>([]);
  const [initialUsername, setInitialUsername] = useState('');
  const [formData, setFormData] = useState<FriendRecord>(EMPTY_FRIEND);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const data = await fetchFriends(token, spreadsheetId);
        setAllFriends(data);
        const friend = data.find((item) => item.id === id);
        if (friend) {
          setFormData(friend);
          setInitialUsername(friend.username);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, spreadsheetId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const cleaned = name === 'username' ? value.trim().replace(/^@/, '') : value;
    setFormData((current) => ({ ...current, [name]: cleaned }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.username) return;
    setIsSaving(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error(t('form.notAuthenticated'));
      const updated: FriendRecord = { ...formData, ...buildIdentityFields(formData, initialUsername) };
      await updateFriend(token, spreadsheetId, updated, allFriends);
      navigate(`/view/${id}`);
    } catch (error: any) {
      console.error(error);
      alert(error?.message || t('form.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-gray-50">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link to={`/view/${id}`} className="-ml-2 flex h-9 w-9 flex-none items-center justify-center rounded-full text-gray-500 hover:bg-gray-100" title={t('common.back')}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="truncate text-xl font-bold text-gray-900">{t('form.editFriend')}</h1>
        </div>
        <button type="button" onClick={handleSubmit} disabled={isSaving || !formData.username} className="flex h-10 flex-none items-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {isSaving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
          {isSaving ? t('common.saving') : t('common.save')}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase text-gray-400">{t('form.profile')}</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.username')} *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                <input type="text" name="username" required value={formData.username} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.realName')}</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
            </div>
            <AvatarUploadField value={formData.photoUrl} onChange={(photoUrl) => setFormData((current) => ({ ...current, photoUrl }))} name={formData.name || formData.username} username={formData.username} />
            <InstagramIdField
              value={formData.instagramUserId || ''}
              onChange={(instagramUserId) => setFormData((current) => ({ ...current, instagramUserId }))}
              username={formData.username}
              onProfile={(profile) => setFormData((current) => ({ ...current, instagramUserId: profile.id, name: current.name || profile.fullName }))}
            />
          </section>

          <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase text-gray-400">{t('form.meetingContext')}</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.occasion')}</label>
              <input type="text" name="occasion" value={formData.occasion} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.date')}</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.location')}</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase text-gray-400">{t('form.details')}</h2>
            <TagPicker value={formData.tags} onChange={(tags) => setFormData((current) => ({ ...current, tags }))} friends={allFriends} />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.notes')}</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.reminder')}</label>
              <input type="date" name="reminderDate" value={formData.reminderDate || ''} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}

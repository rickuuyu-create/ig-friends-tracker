import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { FriendRecord, addFriend, fetchFriends } from '../lib/api';
import { getAccessToken } from '../lib/firebase';
import AvatarUploadField from '../components/AvatarUploadField';
import InstagramIdField from '../components/InstagramIdField';
import TagPicker from '../components/TagPicker';
import { useI18n } from '../i18n';

export default function AddFriend({ spreadsheetId }: { spreadsheetId: string }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [existing, setExisting] = useState<FriendRecord[]>([]);
  const [formData, setFormData] = useState({
    username: '', name: '', occasion: '', date: new Date().toISOString().split('T')[0],
    location: '', tags: '', notes: '', photoUrl: '', reminderDate: '', instagramUserId: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (token) setExisting(await fetchFriends(token, spreadsheetId));
      } catch (error) {
        console.error(error);
      }
    })();
  }, [spreadsheetId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const cleaned = name === 'username' ? value.trim().replace(/^@/, '') : value;
    setFormData((current) => ({ ...current, [name]: cleaned }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.username) return;
    if (!spreadsheetId) {
      alert(t('form.databaseNotReady'));
      return;
    }

    const permanentId = formData.instagramUserId.trim();
    const username = formData.username.trim().toLocaleLowerCase();
    const duplicate = existing.find((friend) =>
      (permanentId && (friend.instagramUserId || '').trim() === permanentId)
      || friend.username.trim().toLocaleLowerCase() === username,
    );
    if (duplicate && !window.confirm(t('form.duplicate', {
      username: duplicate.username,
      name: duplicate.name ? ` (${duplicate.name})` : '',
    }))) return;

    setIsSaving(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error(t('form.notAuthenticated'));
      const newFriend: FriendRecord = {
        id: crypto.randomUUID(),
        ...formData,
        originalUsername: formData.username,
        usernameHistory: formData.username,
        lastCheckedAt: '',
      };
      await addFriend(token, spreadsheetId, newFriend);
      navigate('/');
    } catch (error: any) {
      console.error(error);
      alert(error?.message || t('form.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-gray-50">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="-ml-2 flex h-9 w-9 flex-none items-center justify-center rounded-full text-gray-500 hover:bg-gray-100" title={t('common.back')}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="truncate text-xl font-bold text-gray-900">{t('form.newFriend')}</h1>
        </div>
        <button
          data-tour="save-friend"
          type="button"
          onClick={handleSubmit}
          disabled={isSaving || !formData.username}
          className="flex h-10 flex-none items-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSaving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
          {isSaving ? t('common.saving') : t('common.save')}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <form id="add-form" onSubmit={handleSubmit} className="space-y-5">
          <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase text-gray-400">{t('form.profile')}</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.username')} *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                <input type="text" name="username" required value={formData.username} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" placeholder="cristiano" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.realName')}</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" placeholder="Chris" />
            </div>
            <AvatarUploadField value={formData.photoUrl} onChange={(photoUrl) => setFormData((current) => ({ ...current, photoUrl }))} name={formData.name || formData.username} username={formData.username} />
            <InstagramIdField
              value={formData.instagramUserId}
              onChange={(instagramUserId) => setFormData((current) => ({ ...current, instagramUserId }))}
              username={formData.username}
              onProfile={(profile) => setFormData((current) => ({ ...current, instagramUserId: profile.id, name: current.name || profile.fullName }))}
            />
          </section>

          <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase text-gray-400">{t('form.meetingContext')}</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.occasion')}</label>
              <input type="text" name="occasion" value={formData.occasion} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" placeholder={t('form.occasionPlaceholder')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.date')}</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.location')}</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" placeholder={t('form.locationPlaceholder')} />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase text-gray-400">{t('form.details')}</h2>
            <TagPicker value={formData.tags} onChange={(tags) => setFormData((current) => ({ ...current, tags }))} friends={existing} tourId="form-tags" />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.notes')}</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" placeholder={t('form.notesPlaceholder')} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('form.reminder')}</label>
              <input type="date" name="reminderDate" value={formData.reminderDate} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}

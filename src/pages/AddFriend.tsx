import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { FriendRecord, addFriend, fetchFriends } from '../lib/api';
import { getAccessToken } from '../lib/firebase';
import AvatarUploadField from '../components/AvatarUploadField';
import InstagramIdField from '../components/InstagramIdField';

export default function AddFriend({ spreadsheetId }: { spreadsheetId: string }) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [existing, setExisting] = useState<FriendRecord[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        setExisting(await fetchFriends(token, spreadsheetId));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [spreadsheetId]);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    occasion: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    tags: '',
    notes: '',
    photoUrl: '',
    reminderDate: '',
    instagramUserId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'username') {
      let cleanedValue = value.trim();
      if (cleanedValue.startsWith('@')) {
        cleanedValue = cleanedValue.substring(1);
      }
      setFormData(prev => ({ ...prev, [name]: cleanedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username) return;

    if (!spreadsheetId) {
      alert('The database sheet is not ready. Make sure the Google Sheets API and Google Drive API are enabled in your Google Cloud project, then reload.');
      return;
    }

    // Match on the permanent ID first (survives renames), then fall back to username.
    const uid = formData.instagramUserId.trim();
    const uname = formData.username.trim().toLowerCase();
    const dup = existing.find(
      f => (uid && (f.instagramUserId || '').trim() === uid) ||
           f.username.trim().toLowerCase() === uname
    );
    if (dup) {
      const proceed = window.confirm(
        `You already have @${dup.username} saved${dup.name ? ` (${dup.name})` : ''}. Add another entry anyway?`
      );
      if (!proceed) return;
    }

    setIsSaving(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not authenticated");

      const newFriend: FriendRecord = {
        id: crypto.randomUUID(),
        ...formData,
        originalUsername: formData.username,
        usernameHistory: formData.username,
        lastCheckedAt: ''
      };

      await addFriend(token, spreadsheetId, newFriend);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">New Friend</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSaving || !formData.username}
          className="flex items-center gap-1.5 bg-indigo-600 text-white font-medium py-1.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <form id="add-form" onSubmit={handleSubmit} className="space-y-5">
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Profile</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IG Username *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                <input 
                  type="text" 
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="cristiano"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Real Name / Note Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Chris"
              />
            </div>
            <AvatarUploadField
              value={formData.photoUrl}
              onChange={(photoUrl) => setFormData(prev => ({ ...prev, photoUrl }))}
              name={formData.name || formData.username}
            />
            <InstagramIdField
              value={formData.instagramUserId}
              onChange={(instagramUserId) => setFormData(prev => ({ ...prev, instagramUserId }))}
              username={formData.username}
              onProfile={(p) => setFormData(prev => ({
                ...prev,
                instagramUserId: p.id,
                name: prev.name || p.fullName,
              }))}
            />
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Meeting Context</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occasion / Event</label>
              <input 
                type="text" 
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Tech Meetup 2026"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Taipei"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input 
                type="text" 
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="hiking, designer, mutual:Alice"
              />
              <p className="text-xs text-gray-500 mt-1">Comma separated</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                placeholder="Talked about photography..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Date (Follow up)</label>
              <input 
                type="date" 
                name="reminderDate"
                value={formData.reminderDate || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

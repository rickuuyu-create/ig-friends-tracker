import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Check } from 'lucide-react';
import { getApifyToken, setApifyToken } from '../lib/apify';

export default function Settings() {
  const [token, setToken] = useState(getApifyToken());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApifyToken(token);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10 flex items-center gap-3">
        <Link to="/" className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Instagram Auto-Fetch (Optional)</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Paste your own free Apify API token to auto-fetch a friend's permanent
              Instagram ID when adding them, and to re-check whether they changed their
              username. Your token is stored only in this browser and never leaves your
              device — usage is billed to your own Apify account, not the app owner's.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apify API Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
              placeholder="apify_api_..."
              autoComplete="off"
            />
            <a
              href="https://console.apify.com/settings/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1.5 text-xs text-indigo-600 font-medium hover:underline"
            >
              Get a free token at apify.com ↗
            </a>
          </div>
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
}

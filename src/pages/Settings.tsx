import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, ExternalLink, Play, Save } from 'lucide-react';
import { getApifyToken, setApifyToken } from '../lib/apify';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useI18n } from '../i18n';
import { useOnboarding } from '../onboarding';

export default function Settings() {
  const { t } = useI18n();
  const { startTour } = useOnboarding();
  const [token, setToken] = useState(getApifyToken());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApifyToken(token);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-gray-50">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4">
        <Link to="/" className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100" title={t('common.back')}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{t('settings.title')}</h1>
      </header>

      <main className="flex-1 space-y-5 overflow-y-auto p-4">
        <section className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div>
            <h2 className="text-sm font-bold uppercase text-gray-400">{t('settings.language')}</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{t('settings.languageHint')}</p>
          </div>
          <LanguageSwitcher />
        </section>

        <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div>
            <h2 className="text-sm font-bold uppercase text-gray-400">{t('settings.apifyTitle')}</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{t('settings.apifyBody')}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t('settings.apifyToken')}</label>
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="apify_api_..."
              autoComplete="off"
            />
            <a href="https://console.apify.com/settings/integrations" target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline">
              {t('settings.getToken')}<ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <button onClick={handleSave} className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700">
            {saved ? <><Check className="h-4 w-4" />{t('settings.saved')}</> : <><Save className="h-4 w-4" />{t('common.save')}</>}
          </button>
        </section>

        <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div>
            <h2 className="text-sm font-bold uppercase text-gray-400">{t('settings.tourTitle')}</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{t('settings.tourBody')}</p>
          </div>
          <button onClick={startTour} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Play className="h-4 w-4" />{t('settings.replayTour')}
          </button>
        </section>
      </main>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useI18n } from '../i18n';

export default function Privacy() {
  const { t } = useI18n();
  const sections = [
    ['privacy.whatTitle', 'privacy.whatBody'],
    ['privacy.googleTitle', 'privacy.googleBody'],
    ['privacy.deviceTitle', 'privacy.deviceBody'],
    ['privacy.thirdPartyTitle', 'privacy.thirdPartyBody'],
    ['privacy.noTrackingTitle', 'privacy.noTrackingBody'],
  ] as const;

  return (
    <div className="mx-auto min-h-screen max-w-md bg-gray-50">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="-ml-2 flex h-9 w-9 flex-none items-center justify-center rounded-full text-gray-500 hover:bg-gray-100" title={t('common.back')}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="truncate text-xl font-bold text-gray-900">{t('privacy.title')}</h1>
        </div>
        <LanguageSwitcher compact />
      </header>

      <main className="space-y-4 p-4 text-sm leading-relaxed text-gray-700">
        <p className="text-xs text-gray-400">{t('privacy.updated')}</p>
        {sections.map(([title, body]) => (
          <section key={title} className="space-y-2 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-gray-900">{t(title)}</h2>
            <p>{t(body)}</p>
          </section>
        ))}
        <section className="space-y-2 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-gray-900">{t('privacy.deleteTitle')}</h2>
          <p>
            {t('privacy.deleteBody')}{' '}
            <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">myaccount.google.com/permissions</a>
          </p>
        </section>
        <section className="space-y-2 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-gray-900">{t('privacy.contactTitle')}</h2>
          <p>{t('privacy.contactBody')}{' '}<a href="mailto:rickuuyu@gmail.com" className="text-indigo-600 hover:underline">rickuuyu@gmail.com</a>.</p>
        </section>
      </main>
    </div>
  );
}

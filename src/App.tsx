import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Users } from 'lucide-react';
import { initAuth, googleSignIn } from './lib/firebase';
import { findOrCreateSpreadsheet } from './lib/api';
import Dashboard from './pages/Dashboard';
import AddFriend from './pages/AddFriend';
import FriendDetails from './pages/FriendDetails';
import EditFriend from './pages/EditFriend';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import LanguageSwitcher from './components/LanguageSwitcher';
import LandingContent from './components/LandingContent';
import { useI18n } from './i18n';
import { OnboardingProvider } from './onboarding';

export default function App() {
  const { t } = useI18n();
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = initAuth(
      async (_user, token) => {
        setNeedsAuth(false);
        try {
          setSpreadsheetId(await findOrCreateSpreadsheet(token));
        } catch (error) {
          console.error('Error setting up spreadsheet:', error);
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setNeedsAuth(true);
        setIsLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const result = await googleSignIn();
      if (result) {
        setNeedsAuth(false);
        setIsLoading(true);
        setSpreadsheetId(await findOrCreateSpreadsheet(result.accessToken));
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error?.code === 'auth/popup-blocked') setLoginError(t('login.popupBlocked'));
      else if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') setLoginError(t('login.cancelled'));
      else if (error?.code === 'auth/unauthorized-domain') setLoginError(t('login.unauthorized'));
      else setLoginError(t('login.failed', { code: error?.code || 'unknown' }));
    } finally {
      setIsLoading(false);
      setIsLoggingIn(false);
    }
  };

  if (location.pathname === '/privacy') return <Privacy />;

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" /></div>;
  }

  if (needsAuth) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="absolute right-4 top-4"><LanguageSwitcher /></div>
        <div className="w-full max-w-md space-y-7 rounded-lg border border-gray-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('login.title')}</h1>
            <p className="mt-3 leading-relaxed text-gray-500">{t('login.subtitle')}</p>
          </div>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            {isLoggingIn ? t('login.signingIn') : t('login.signIn')}
          </button>
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
          <Link to="/privacy" className="block text-xs text-gray-400 hover:text-gray-600 hover:underline">{t('login.privacy')}</Link>
        </div>
        </div>
        <LandingContent onGetStarted={handleLogin} />
      </div>
    );
  }

  if (!spreadsheetId) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 px-6 text-center text-sm text-red-600">{t('form.databaseNotReady')}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <OnboardingProvider>
        <Routes>
          <Route path="/" element={<Dashboard spreadsheetId={spreadsheetId} />} />
          <Route path="/add" element={<AddFriend spreadsheetId={spreadsheetId} />} />
          <Route path="/view/:id" element={<FriendDetails spreadsheetId={spreadsheetId} />} />
          <Route path="/edit/:id" element={<EditFriend spreadsheetId={spreadsheetId} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </OnboardingProvider>
    </div>
  );
}

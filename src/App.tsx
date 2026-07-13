import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, getAccessToken } from './lib/firebase';
import { findOrCreateSpreadsheet } from './lib/api';
import Dashboard from './pages/Dashboard';
import AddFriend from './pages/AddFriend';
import FriendDetails from './pages/FriendDetails';
import EditFriend from './pages/EditFriend';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';

export default function App() {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, token) => {
        setToken(token);
        setUser(user);
        setNeedsAuth(false);
        try {
          const sid = await findOrCreateSpreadsheet(token);
          setSpreadsheetId(sid);
        } catch (error) {
          console.error("Error setting up spreadsheet:", error);
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setNeedsAuth(true);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
        setIsLoading(true);
        const sid = await findOrCreateSpreadsheet(result.accessToken);
        setSpreadsheetId(sid);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err?.code === 'auth/popup-blocked') {
        setLoginError('Your browser blocked the sign-in popup. Please allow popups for this site and try again.');
      } else if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setLoginError('Sign-in was cancelled. Please try again.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setLoginError('This domain is not authorized for sign-in. Add it under Firebase Console > Authentication > Settings > Authorized domains.');
      } else {
        setLoginError(`Sign-in failed (${err?.code || 'unknown error'}). Please try again.`);
      }
    } finally {
      setIsLoading(false);
      setIsLoggingIn(false);
    }
  };

  // The privacy policy must be reachable without signing in (Google requires a
  // publicly accessible privacy policy URL for the OAuth consent screen).
  if (location.pathname === '/privacy') {
    return <Privacy />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (needsAuth) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center space-y-8 bg-white p-8 rounded-2xl shadow-xl">
          <div className="mx-auto w-16 h-16 bg-indigo-100 flex items-center justify-center rounded-2xl mb-4">
             <span className="text-3xl">👋</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">IG Friends Tracker</h1>
          <p className="text-gray-500 mb-8">Never forget who you met. Sign in with Google to sync with your private Google Sheets database.</p>
          <button 
            onClick={handleLogin} 
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            {isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
          </button>
          {loginError && (
            <p className="text-sm text-red-600 mt-4">{loginError}</p>
          )}
          <Link to="/privacy" className="block text-xs text-gray-400 hover:text-gray-600 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Routes>
        <Route path="/" element={<Dashboard spreadsheetId={spreadsheetId!} />} />
        <Route path="/add" element={<AddFriend spreadsheetId={spreadsheetId!} />} />
        <Route path="/view/:id" element={<FriendDetails spreadsheetId={spreadsheetId!} />} />
        <Route path="/edit/:id" element={<EditFriend spreadsheetId={spreadsheetId!} />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10 flex items-center gap-3">
        <Link to="/" className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Privacy Policy</h1>
      </div>

      <div className="p-4 space-y-4 text-sm text-gray-700 leading-relaxed">
        <p className="text-xs text-gray-400">Last updated: July 13, 2026</p>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-bold text-gray-900">What this app does</h2>
          <p>
            IG Friends Tracker helps you remember the people you meet on Instagram.
            All records you create are stored in a Google Sheet named
            “IG Friends Database” <strong>inside your own Google Drive</strong> — not on
            our servers. We do not operate any database of user content.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-bold text-gray-900">Google account access</h2>
          <p>
            When you sign in with Google, we request the <code className="bg-gray-100 px-1 rounded text-xs">drive.file</code> permission.
            This only allows the app to create and edit <strong>files it created itself</strong> —
            it cannot see, read, or modify any other file in your Google Drive.
          </p>
          <p>
            Your basic account details (name, email) are used by Firebase
            Authentication solely to manage your sign-in.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-bold text-gray-900">What stays on your device</h2>
          <p>
            Your Google sign-in token, and the optional Apify API token you may add in
            Settings, are stored only in your browser’s local storage. They are never
            sent to us.
          </p>
          <p>
            Photos you upload are resized in your browser and saved into your own
            Google Sheet.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-bold text-gray-900">Optional third-party lookups</h2>
          <p>
            If you choose to add your own Apify API token, Instagram profile lookups
            are sent directly from your browser to Apify under your own Apify account
            and their terms. This feature is optional and off by default.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-bold text-gray-900">What we don't do</h2>
          <p>
            No ads, no analytics, no tracking, and we never sell or share your data.
            We have no access to your friend records at all.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-bold text-gray-900">Deleting your data</h2>
          <p>
            Delete the “IG Friends Database” spreadsheet from your Google Drive, then
            revoke this app’s access at{' '}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              myaccount.google.com/permissions
            </a>
            . That removes everything.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-bold text-gray-900">Contact</h2>
          <p>
            Questions? Email{' '}
            <a href="mailto:rickuuyu@gmail.com" className="text-indigo-600 hover:underline">
              rickuuyu@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

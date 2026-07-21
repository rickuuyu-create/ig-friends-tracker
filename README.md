# IG Friends Tracker

**A privacy-first personal CRM for the people you meet on Instagram. Your records stay in your own Google Sheet.**

[Try the live app](https://ig-friends-tracker.vercel.app/) | [繁體中文使用說明](USAGE_zh.md) | [Privacy policy](https://ig-friends-tracker.vercel.app/privacy)

IG Friends Tracker helps you remember where you met someone, what you discussed, how to follow up, and which Instagram account belongs to the same person even after a username change.

> **Just want to use it?** Open the live app and sign in with Google. You do not need to configure Firebase or enable any APIs. The setup instructions below are only for developers hosting their own copy.

## Screenshots

| Dashboard | Friend details |
|---|---|
| ![Dashboard with search, sorting and tag filters](docs/screenshot-dashboard.png) | ![Friend details with context and identity data](docs/screenshot-details.png) |

## Features

- Private Google Sheets storage in each user's own Google Drive
- Google sign-in through Firebase Authentication
- English and Traditional Chinese interface with a persistent language switcher
- First-use interactive tour with spotlight guidance across the main workflow
- Search names, handles, occasions, locations, notes, tags and previous usernames
- Multi-tag filtering with three quick tags and a searchable **More** menu
- Reusable multi-select tag picker when adding or editing a friend
- Sort by recently met, follow-up date or name
- Follow-up reminders and overdue badges
- Browser-side avatar resizing; uploaded photos are stored in the user's Sheet
- Built-in public-profile photo download guide with manual upload
- Permanent Instagram numeric ID and searchable username history
- Duplicate detection by permanent ID, with username fallback
- Optional bring-your-own Apify token for ID lookup and username verification
- Installable PWA with an offline app shell

## Privacy model

There is no application backend and no shared contacts database. The app requests Google's narrow `drive.file` scope, which limits it to files the app created for the signed-in user. The developer cannot access users' friend records.

Optional Apify tokens are stored in the user's browser and sent directly to Apify. They never pass through an app-owned server.

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS 4, Firebase Authentication, Google Sheets API, Google Drive API and a service worker-based PWA.

## Project structure

```text
public/                 PWA manifest, service worker and icons
src/
  components/           Shared controls, tag pickers and dialogs
  i18n/                 English and Traditional Chinese dictionaries
  lib/                  Google APIs, Firebase, tags, images and identity helpers
  onboarding/           First-use guided tour
  pages/                Dashboard, forms, details, settings and privacy policy
  App.tsx                Authentication gate and routes
.env.example            Firebase client configuration template
vercel.json             SPA rewrite rules for Vercel
```

## Run your own copy

### Prerequisites

- Node.js 18 or newer
- A Google account
- A Firebase project

### 1. Clone and install

```bash
git clone https://github.com/rickuuyu-create/ig-friends-tracker.git
cd ig-friends-tracker
npm install
```

### 2. Configure Firebase and Google APIs

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Register a Web app and copy its `firebaseConfig` values.
3. Under **Authentication > Sign-in method**, enable Google.
4. In Google Cloud Console, enable the [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com) and [Google Drive API](https://console.cloud.google.com/apis/library/drive.googleapis.com).
5. Add `localhost` to Firebase **Authentication > Settings > Authorized domains** if it is not already present.

### 3. Add environment variables

Copy `.env.example` to `.env.local` and fill in all six `VITE_FIREBASE_*` values.

```bash
cp .env.example .env.local
```

Firebase Web configuration values are public client identifiers, not server secrets. Do not put private API tokens in `VITE_*` variables.

### 4. Start the app

```bash
npm run dev
```

Open <http://localhost:3000>. The app creates a Sheet named **IG Friends Database** in the signed-in user's Drive.

## Deploy to Vercel

1. Import this repository into [Vercel](https://vercel.com/).
2. Add the six `VITE_FIREBASE_*` variables in **Project Settings > Environment Variables**.
3. Deploy, then add the Vercel hostname to Firebase **Authorized domains**.
4. In [Google Auth Platform](https://console.cloud.google.com/auth), configure branding and use `/privacy` as the privacy policy URL.
5. Set the OAuth audience to **In production** when the app is ready for public users.

`vercel.json` handles direct navigation to routes such as `/add`, `/settings` and `/privacy`.

## Usage

1. Sign in with Google.
2. Follow or skip the first-use guided tour.
3. Add a friend with their handle, meeting context, notes and optional reminder.
4. Upload a photo, or open the IGPorter link in the built-in guide to download a public profile picture first.
5. Reuse existing tags or create new ones.
6. Save the permanent Instagram ID when available.
7. On the dashboard, combine multiple tags to narrow the list.

## Optional Apify integration

Users who want automatic profile lookups can add their own token under **Settings**. This enables ID auto-fetch and username verification. The integration is optional; manual ID lookup remains available.

Instagram scraping can fail temporarily when Instagram changes its protections. Avatar images are not auto-imported because Instagram CDN URLs expire. The photo guide copies the entered username and opens a third-party downloader in a new tab; it never asks for an Instagram password. The external service supports public profiles only and may change or stop working.

## Commands

```bash
npm run dev       # local development server
npm run lint      # TypeScript check
npm run build     # production build
npm run preview   # preview the production build
```

## Contributing

Bug reports and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a change.

## License

[MIT](LICENSE)

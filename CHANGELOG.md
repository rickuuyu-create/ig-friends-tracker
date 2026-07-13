# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-13

### Added

- Google sign-in (Firebase Auth); data stored in a Google Sheet created in the user's own Drive (`drive.file` scope only)
- Friend records: username, name, occasion, date, location, tags, notes, follow-up reminder
- Avatar upload — images resized in the browser and stored in the sheet (never expire)
- Permanent Instagram User ID field with free "Find ID" lookup link
- Username-change history: old handles archived automatically and searchable ("Also known as")
- Duplicate detection by permanent ID (falls back to username)
- Dashboard: search across all fields incl. past usernames, clickable tag filters, sort by recent / follow-up / name, follow-up badges
- Installable PWA (manifest, service worker, offline shell, icons)
- Optional bring-your-own Apify token (stored in localStorage only): auto-fetch ID on add, re-check username on the detail page
- Public privacy policy page at `/privacy`
- Vercel deployment support (`vercel.json` SPA rewrites, env-var driven Firebase config)

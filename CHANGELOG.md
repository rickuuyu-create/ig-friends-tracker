# Changelog

All notable changes to this project are documented in this file.

## [1.1.1] - 2026-07-22

### Changed

- Replaced the ask-a-friend avatar instructions with a public-profile downloader workflow
- Added one-click username copying, a direct downloader link and third-party safety warnings

## [1.1.0] - 2026-07-22

### Added

- English and Traditional Chinese interface with persistent language selection
- First-use, cross-page interactive tour with spotlight highlighting and replay from Settings
- Dashboard multi-tag filtering with three quick tags and a searchable More menu
- Reusable multi-select tag picker for adding and editing friends
- In-app guide for obtaining and uploading a permitted profile photo

### Changed

- Dashboard search now includes notes and locations
- Tag parsing is case-insensitive, removes duplicates and remains compatible with existing comma-separated Sheet data
- Reworked public documentation and removed legacy encoding artifacts
- Split production bundles into React, Firebase and icon chunks

## [1.0.0] - 2026-07-13

### Added

- Google sign-in with data stored in a Google Sheet created in the user's own Drive
- Friend records with meeting context, tags, notes and follow-up reminders
- Browser-side avatar resizing and Sheet storage
- Permanent Instagram User ID field and free manual lookup link
- Automatic username history and duplicate detection
- Dashboard search, tag filtering, sorting and follow-up badges
- Installable PWA with an offline shell
- Optional bring-your-own Apify token integration
- Public privacy policy and Vercel deployment support

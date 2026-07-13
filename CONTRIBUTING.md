# Contributing to IG Friends Tracker

Thanks for your interest! This is a small, focused project — contributions of all sizes are welcome.

## Reporting bugs

Open an issue using the **Bug report** template. Please include:

- What you did, what you expected, what happened instead
- The exact error message (the app surfaces real API errors — paste them verbatim)
- Browser and OS

## Suggesting features

Open an issue using the **Feature request** template. Keep in mind the project's core principles:

1. **No backend, no user database** — everything stays in the user's own Google Drive
2. **No secrets in the repo or bundle** — API keys are per-user, stored in their browser
3. **Keep it simple** — this is a personal CRM, not an enterprise tool

Feature ideas that break principle 1 or 2 will likely be declined.

## Pull requests

1. Fork the repo and create a branch: `git checkout -b my-fix`
2. Set up locally (see [README.md](README.md#getting-started-run-your-own-copy) — you'll need your own free Firebase project)
3. Make your change
4. Make sure both pass before submitting:
   ```bash
   npm run lint    # TypeScript typecheck
   npm run build   # production build
   ```
5. Open a PR with a short description of what and why

There is no test suite yet — a PR adding one would be very welcome.

## Code style

- TypeScript, functional React components, hooks
- Tailwind CSS for styling — match the existing indigo/gray palette
- Match the style of surrounding code; when in doubt, keep it boring

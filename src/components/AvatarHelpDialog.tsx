import { Check, Copy, ExternalLink, ImageDown, Search, ShieldAlert, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../i18n';

interface AvatarHelpDialogProps {
  open: boolean;
  onClose: () => void;
  username?: string;
}

const PROFILE_PHOTO_DOWNLOADER_URL = 'https://igporter.com/instagram-profile-picture-downloader';

export default function AvatarHelpDialog({ open, onClose, username }: AvatarHelpDialogProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    setCopied(false);
  }, [open, username]);

  if (!open) return null;
  const handle = username?.trim().replace(/^@/, '');

  const copyUsername = async () => {
    if (!handle || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(handle);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-help-title"
        className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-lg bg-white shadow-2xl sm:rounded-lg"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <ImageDown className="h-5 w-5" />
            </span>
            <h2 id="avatar-help-title" className="text-base font-bold text-gray-900">{t('avatar.helpTitle')}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700" title={t('common.close')}>
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-5 p-5">
          <p className="text-sm leading-relaxed text-gray-600">{t('avatar.helpIntro')}</p>
          <ol className="space-y-4">
            {[
              [Copy, 'avatar.step1Title', 'avatar.step1Body'],
              [Search, 'avatar.step2Title', 'avatar.step2Body'],
              [Upload, 'avatar.step3Title', 'avatar.step3Body'],
            ].map(([Icon, title, body], index) => {
              const StepIcon = Icon as typeof Copy;
              return (
                <li key={String(title)} className="flex gap-3">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">{index + 1}</span>
                  <div className="pt-0.5">
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                      <StepIcon className="h-4 w-4 text-gray-400" />
                      {t(title as Parameters<typeof t>[0])}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{t(body as Parameters<typeof t>[0])}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="space-y-2.5">
            {handle && (
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                <span className="min-w-0 flex-1 truncate px-2 text-sm font-semibold text-gray-800">@{handle}</span>
                <button
                  type="button"
                  onClick={() => void copyUsername()}
                  className="flex h-9 items-center gap-1.5 rounded-md bg-white px-3 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-100"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  {copied ? t('avatar.copied') : t('avatar.copyUsername')}
                </button>
              </div>
            )}
            <a
              href={PROFILE_PHOTO_DOWNLOADER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handle && void copyUsername()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <ImageDown className="h-4 w-4" />
              {t('avatar.openDownloader')}
              <ExternalLink className="h-4 w-4" />
            </a>
            <p className="text-center text-xs text-gray-500">
              {t(handle ? 'avatar.copyAndOpenHint' : 'avatar.openWithoutUsernameHint')}
            </p>
          </div>
          <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-900">
            <ShieldAlert className="mt-0.5 h-4 w-4 flex-none" />
            {t('avatar.thirdPartyNote')}
          </p>
          <p className="text-xs leading-relaxed text-gray-500">{t('avatar.privacyNote')}</p>
        </div>
      </section>
    </div>,
    document.body,
  );
}

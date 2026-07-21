import { ExternalLink, ImageDown, Instagram, ShieldCheck, X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../i18n';

interface AvatarHelpDialogProps {
  open: boolean;
  onClose: () => void;
  username?: string;
}
export default function AvatarHelpDialog({ open, onClose, username }: AvatarHelpDialogProps) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open) return null;
  const handle = username?.trim().replace(/^@/, '');

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
              [Instagram, 'avatar.step1Title', 'avatar.step1Body'],
              [ShieldCheck, 'avatar.step2Title', 'avatar.step2Body'],
              [ImageDown, 'avatar.step3Title', 'avatar.step3Body'],
            ].map(([Icon, title, body], index) => {
              const StepIcon = Icon as typeof Instagram;
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

          {handle ? (
            <a
              href={`https://www.instagram.com/${encodeURIComponent(handle)}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black"
            >
              <Instagram className="h-4 w-4" />
              {t('avatar.openProfile')} @{handle}
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800">{t('avatar.usernameNeeded')}</p>
          )}
          <p className="flex items-start gap-2 rounded-lg bg-indigo-50 px-3 py-2.5 text-xs leading-relaxed text-indigo-800">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-none" />
            {t('avatar.privacyNote')}
          </p>
        </div>
      </section>
    </div>,
    document.body,
  );
}

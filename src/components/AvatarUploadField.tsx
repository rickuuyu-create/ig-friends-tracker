import { useRef, useState } from 'react';
import { CircleHelp, Upload, X } from 'lucide-react';
import IgAvatar from './IgAvatar';
import { compressImageToDataUrl, isDataUrl } from '../lib/image';
import AvatarHelpDialog from './AvatarHelpDialog';
import { useI18n } from '../i18n';

interface AvatarUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  username?: string;
}

export default function AvatarUploadField({ value, onChange, name, username }: AvatarUploadFieldProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError('');
    setIsProcessing(true);
    try {
      onChange(await compressImageToDataUrl(file));
    } catch (err) {
      console.error(err);
      setError(t('avatar.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div data-tour="avatar">
      <div className="mb-1 flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-gray-700">{t('avatar.label')}</label>
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          <CircleHelp className="h-3.5 w-3.5" />
          {t('avatar.help')}
        </button>
      </div>
      <div className="flex items-center gap-3">
        <IgAvatar username="" name={name} customUrl={value} className="w-14 h-14 text-xl" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {t('avatar.upload')}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title={t('common.remove')}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {!isDataUrl(value) && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
          placeholder={t('avatar.pasteUrl')}
        />
      )}
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : (
        <p className="mt-1.5 text-xs text-gray-500 leading-tight">
          {t('avatar.savedHint')}
        </p>
      )}
      <AvatarHelpDialog open={showHelp} onClose={() => setShowHelp(false)} username={username} />
    </div>
  );
}

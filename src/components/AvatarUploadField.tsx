import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import IgAvatar from './IgAvatar';
import { compressImageToDataUrl, isDataUrl } from '../lib/image';

interface AvatarUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
}

export default function AvatarUploadField({ value, onChange, name }: AvatarUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

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
      setError('Could not process this image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Photo (Optional)</label>
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
          Upload Photo
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Remove photo"
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
          placeholder="...or paste an image URL (https://...)"
        />
      )}
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : (
        <p className="mt-1.5 text-xs text-gray-500 leading-tight">
          Uploaded photos are resized and saved into your sheet, so they never expire.
        </p>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

interface IgAvatarProps {
  username: string;
  name?: string;
  customUrl?: string;
  className?: string;
}

export default function IgAvatar({ username, name, customUrl, className }: IgAvatarProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [username, customUrl]);

  const src = customUrl?.trim() || null;

  const initial = (name || username || '?').trim().charAt(0).toUpperCase();

  if (!src || failed) {
    return (
      <div className={cn("bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-700 font-bold rounded-full", className)}>
        {initial}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      className={cn("object-cover flex-shrink-0 border border-gray-200 rounded-full", className)}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)} 
      alt={name || username} 
    />
  );
}

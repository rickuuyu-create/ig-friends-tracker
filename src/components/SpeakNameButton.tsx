import { useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { canSpeak, pronounceable, speakName, stopSpeaking } from '../lib/speech';
import { cn } from '../lib/utils';
import { useI18n } from '../i18n';

// A speaker next to a name: tap it to hear how the name is said, instead of
// pasting it into a translator just to listen.
export default function SpeakNameButton({ name, username, className, tourId }: {
  name: string;
  username: string;
  className?: string;
  tourId?: string;
}) {
  const { t } = useI18n();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSpeakingRef = useRef(false);
  const text = pronounceable(name, username);

  isSpeakingRef.current = isSpeaking;
  // Leaving the page mid-sentence should stop the voice, but a card that merely
  // re-renders out of a filtered list must not silence someone else's playback.
  useEffect(() => () => { if (isSpeakingRef.current) stopSpeaking(); }, []);

  if (!canSpeak() || !text) return null;

  const label = isSpeaking ? t('speech.stop') : t('speech.play', { name: text });

  const handleClick = (event: React.MouseEvent) => {
    // The card behind this button is itself a link to the friend.
    event.preventDefault();
    event.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speakName(text, () => setIsSpeaking(false));
  };

  return (
    <button
      data-tour={tourId}
      type="button"
      onClick={handleClick}
      onKeyDown={(event) => event.stopPropagation()}
      title={label}
      aria-label={label}
      className={cn(
        'flex h-6 w-6 flex-none items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600',
        isSpeaking && 'bg-indigo-50 text-indigo-600',
        className,
      )}
    >
      <Volume2 className={cn('h-4 w-4', isSpeaking && 'animate-pulse')} />
    </button>
  );
}

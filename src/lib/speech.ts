// Names are read aloud by the browser's own speech synthesis. Like the rest of
// the app, nothing about a friend leaves the device to make this work.

const CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;

export const canSpeak = (): boolean =>
  typeof window !== 'undefined'
  && 'speechSynthesis' in window
  && typeof window.SpeechSynthesisUtterance === 'function';

// What to actually pronounce. A saved name is best; the username is the
// fallback, with separators and digits dropped so "ga.be1251" reads as "ga be".
export const pronounceable = (name: string, username: string): string => {
  const realName = (name || '').trim();
  if (realName) return realName;
  return (username || '').replace(/[._-]+/g, ' ').replace(/\d+/g, ' ').replace(/\s+/g, ' ').trim();
};

export const speakName = (text: string, onFinish: () => void): void => {
  if (!canSpeak() || !text) return;
  const synthesis = window.speechSynthesis;
  // A second tap replaces what is playing instead of queueing behind it.
  if (synthesis.speaking || synthesis.pending) synthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = CJK.test(text) ? 'zh-TW' : 'en-US';
  utterance.rate = 0.85; // slow enough to copy the pronunciation
  utterance.onend = onFinish;
  utterance.onerror = onFinish; // cancelling counts as an error in some browsers

  // Called straight from the click handler: iOS only speaks from a user gesture.
  synthesis.speak(utterance);
};

export const stopSpeaking = (): void => {
  if (canSpeak()) window.speechSynthesis.cancel();
};

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';

const COMPLETED_KEY = 'ig_friends_onboarding_v2';

interface TourStep {
  route: '/' | '/add';
  target: string;
  title: Parameters<ReturnType<typeof useI18n>['t']>[0];
  body: Parameters<ReturnType<typeof useI18n>['t']>[0];
}

const STEPS: TourStep[] = [
  { route: '/', target: 'settings', title: 'tour.settingsTitle', body: 'tour.settingsBody' },
  { route: '/', target: 'search', title: 'tour.searchTitle', body: 'tour.searchBody' },
  { route: '/', target: 'tag-tools', title: 'tour.tagsTitle', body: 'tour.tagsBody' },
  { route: '/', target: 'add-friend', title: 'tour.addTitle', body: 'tour.addBody' },
  { route: '/add', target: 'avatar', title: 'tour.avatarTitle', body: 'tour.avatarBody' },
  { route: '/add', target: 'instagram-id', title: 'tour.idTitle', body: 'tour.idBody' },
  { route: '/add', target: 'form-tags', title: 'tour.formTagsTitle', body: 'tour.formTagsBody' },
  { route: '/add', target: 'save-friend', title: 'tour.saveTitle', body: 'tour.saveBody' },
];

interface OnboardingContextValue {
  active: boolean;
  startTour: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const startTour = useCallback(() => {
    setStepIndex(0);
    setActive(true);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    let completed = false;
    try { completed = localStorage.getItem(COMPLETED_KEY) === 'done'; } catch { /* ignore */ }
    if (!completed) {
      const timer = window.setTimeout(startTour, 900);
      return () => window.clearTimeout(timer);
    }
  }, [startTour]);

  const finish = useCallback((returnHome: boolean) => {
    setActive(false);
    try { localStorage.setItem(COMPLETED_KEY, 'done'); } catch { /* ignore */ }
    if (returnHome) navigate('/');
  }, [navigate]);

  const goTo = useCallback((nextIndex: number) => {
    const bounded = Math.max(0, Math.min(STEPS.length - 1, nextIndex));
    const nextStep = STEPS[bounded];
    setStepIndex(bounded);
    if (window.location.pathname !== nextStep.route) navigate(nextStep.route);
  }, [navigate]);

  const contextValue = useMemo(() => ({ active, startTour }), [active, startTour]);

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
      {active && (
        <OnboardingTour
          stepIndex={stepIndex}
          onBack={() => goTo(stepIndex - 1)}
          onNext={() => stepIndex === STEPS.length - 1 ? finish(true) : goTo(stepIndex + 1)}
          onSkip={() => finish(false)}
        />
      )}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const value = useContext(OnboardingContext);
  if (!value) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return value;
};

interface OnboardingTourProps {
  stepIndex: number;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

function OnboardingTour({ stepIndex, onBack, onNext, onSkip }: OnboardingTourProps) {
  const { t } = useI18n();
  const location = useLocation();
  const step = STEPS[stepIndex];
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onSkip();
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onSkip]);

  useLayoutEffect(() => {
    setTargetRect(null);
    let cancelled = false;
    let attempts = 0;
    let timer = 0;

    const locate = () => {
      if (cancelled) return;
      const element = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
      if (!element) {
        attempts += 1;
        if (attempts < 40) timer = window.setTimeout(locate, 100);
        return;
      }
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      timer = window.setTimeout(() => !cancelled && setTargetRect(element.getBoundingClientRect()), 350);
    };
    timer = window.setTimeout(locate, 80);

    const refresh = () => {
      const element = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
      if (element) setTargetRect(element.getBoundingClientRect());
    };
    window.addEventListener('resize', refresh);
    window.addEventListener('scroll', refresh, true);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('scroll', refresh, true);
    };
  }, [location.pathname, step.target]);

  const cardAtTop = targetRect ? targetRect.top + targetRect.height / 2 > window.innerHeight / 2 : false;

  useLayoutEffect(() => {
    if (cardRef.current) setCardRect(cardRef.current.getBoundingClientRect());
  }, [cardAtTop, stepIndex, targetRect]);

  if (!targetRect) return null;

  const padding = 6;
  const spotlight = {
    left: Math.max(8, targetRect.left - padding),
    top: Math.max(8, targetRect.top - padding),
    width: Math.min(window.innerWidth - 16, targetRect.width + padding * 2),
    height: targetRect.height + padding * 2,
  };
  const targetX = spotlight.left + spotlight.width / 2;
  const targetY = spotlight.top + spotlight.height / 2;
  const cardX = cardRect ? cardRect.left + cardRect.width / 2 : window.innerWidth / 2;
  const cardY = cardRect ? (cardAtTop ? cardRect.bottom : cardRect.top) : (cardAtTop ? 220 : window.innerHeight - 220);

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-live="polite">
      <div
        className="fixed rounded-lg border-2 border-white/90 transition-all duration-300"
        style={{
          ...spotlight,
          boxShadow: '0 0 0 9999px rgba(3, 7, 18, 0.80)',
        }}
      />
      <button
        type="button"
        onClick={onNext}
        className="fixed cursor-pointer rounded-lg outline-none ring-4 ring-indigo-400/35"
        style={spotlight}
        aria-label={t('tour.next')}
      />
      <svg className="pointer-events-none fixed inset-0 h-full w-full" aria-hidden="true">
        <line x1={targetX} y1={targetY} x2={cardX} y2={cardY} stroke="rgba(255,255,255,.78)" strokeWidth="2" />
        <circle cx={targetX} cy={targetY} r="4" fill="white" />
      </svg>

      <div
        ref={cardRef}
        className="fixed left-1/2 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 overflow-hidden rounded-lg border border-white/10 p-5 text-white shadow-2xl"
        style={{
          ...(cardAtTop ? { top: 20 } : { bottom: 20 }),
          background: 'linear-gradient(145deg, #090b10 0%, #242833 100%)',
        }}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-indigo-300">{t('tour.step', { current: stepIndex + 1, total: STEPS.length })}</span>
          <button type="button" onClick={onSkip} className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white">
            {t('tour.skip')}<X className="h-3.5 w-3.5" />
          </button>
        </div>
        <h2 className="text-lg font-bold leading-tight">{t(step.title)}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">{t(step.body)}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex gap-1">
            {STEPS.map((_, index) => (
              <span key={index} className={`h-1.5 rounded-full transition-all ${index === stepIndex ? 'w-5 bg-indigo-400' : 'w-1.5 bg-white/25'}`} />
            ))}
          </div>
          <div className="flex gap-2">
            {stepIndex > 0 && (
              <button type="button" onClick={onBack} className="inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium text-gray-200 hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />{t('tour.back')}
              </button>
            )}
            <button type="button" onClick={onNext} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-white px-3.5 text-sm font-semibold text-gray-950 hover:bg-gray-100">
              {stepIndex === STEPS.length - 1 ? <><Check className="h-4 w-4" />{t('tour.finish')}</> : <>{t('tour.next')}<ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

import { BellRing, Fingerprint, Github, MapPin, ShieldCheck, Smartphone, StickyNote, Tags } from 'lucide-react';
import { useI18n } from '../i18n';

const REPO_URL = 'https://github.com/rickuuyu-create/ig-friends-tracker';

// Marketing copy shown below the sign-in card. It exists so search engines have
// real content to index, and so first-time visitors know what the app does.
export default function LandingContent({ onGetStarted }: { onGetStarted: () => void }) {
  const { t } = useI18n();

  const features = [
    { icon: StickyNote, title: 'landing.f1Title', body: 'landing.f1Body' },
    { icon: MapPin, title: 'landing.f2Title', body: 'landing.f2Body' },
    { icon: Tags, title: 'landing.f3Title', body: 'landing.f3Body' },
    { icon: BellRing, title: 'landing.f4Title', body: 'landing.f4Body' },
    { icon: Fingerprint, title: 'landing.f5Title', body: 'landing.f5Body' },
    { icon: Smartphone, title: 'landing.f6Title', body: 'landing.f6Body' },
  ] as const;

  const steps = ['landing.step1', 'landing.step2', 'landing.step3'] as const;
  const faqs = [
    ['landing.q5', 'landing.a5'],
    ['landing.q6', 'landing.a6'],
    ['landing.q8', 'landing.a8'],
    ['landing.q7', 'landing.a7'],
    ['landing.q4', 'landing.a4'],
    ['landing.q2', 'landing.a2'],
    ['landing.q1', 'landing.a1'],
    ['landing.q3', 'landing.a3'],
  ] as const;

  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-3xl space-y-16 px-5 py-16">
        <section className="space-y-4 text-center">
          <h2 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">{t('landing.problemTitle')}</h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-gray-600">{t('landing.problemBody')}</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">{t('landing.featuresTitle')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-gray-900">{t(title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{t(body)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-indigo-100 bg-indigo-50 p-6 sm:p-8">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-indigo-700">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{t('landing.privacyTitle')}</h2>
          <p className="mt-2 leading-relaxed text-gray-700">{t('landing.privacyBody')}</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">{t('landing.howTitle')}</h2>
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 leading-relaxed text-gray-600">{t(step)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-5">
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">{t('landing.faqTitle')}</h2>
          <div className="space-y-4">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900">{t(question)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{t(answer)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 border-t border-gray-200 pt-12 text-center">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{t('landing.ctaTitle')}</h2>
          <p className="text-gray-600">{t('landing.ctaBody')}</p>
          <button
            onClick={onGetStarted}
            className="mx-auto flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
          >
            {t('login.signIn')}
          </button>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            {t('landing.github')}
          </a>
        </section>
      </div>
    </div>
  );
}

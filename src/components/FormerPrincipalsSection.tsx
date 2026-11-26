import React from 'react';
import { motion } from 'motion/react';
import { Calendar, UserRound } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { pickText } from '../utils/schoolHelpers';
import { FormattedText } from './FormattedText';
import { SafeImage } from './SafeImage';

export const FormerPrincipalsSection: React.FC = () => {
  const { data, language, strings } = useSchoolData();
  const list = data.formerPrincipals;

  return (
    <section
      id="former-principals"
      className="py-14 lg:py-20 bg-[#FBF9F5] dark:bg-stone-950 min-h-[72vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
            {strings.formerPrincipals.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
            {strings.formerPrincipals.heading}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed">
            {strings.formerPrincipals.subtitle}
          </p>
        </div>

        {list.length === 0 ? (
          <div className="max-w-3xl mx-auto rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-12 text-center text-sm text-stone-500 dark:text-stone-400">
            {strings.formerPrincipals.emptyState}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {list.map((principal, idx) => {
              const nameText = pickText(principal.name, language);
              const tenureText = pickText(principal.tenure, language);
              const noteText = pickText(principal.note, language);

              return (
                <motion.article
                  key={principal.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-7 flex items-start gap-5 shadow-xs hover:-translate-y-0.5 transition-transform duration-200"
                >
                  {/* Optional Portrait Photo or Dignified Neutral Person Silhouette */}
                  <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/80 shrink-0 flex items-center justify-center">
                    {principal.photoUrl ? (
                      <SafeImage
                        src={principal.photoUrl}
                        alt={nameText}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center text-stone-400 dark:text-stone-500"
                        aria-label={nameText}
                      >
                        <UserRound className="w-9 h-9 stroke-[1.5]" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold font-mono-num bg-stone-100 dark:bg-stone-800 text-[var(--brand-primary)] dark:text-[var(--brand-accent)] border border-stone-200/80 dark:border-stone-700 mb-2.5">
                      <Calendar className="w-3 h-3 shrink-0" aria-hidden="true" />
                      <span>{tenureText}</span>
                    </div>

                    <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-50 leading-snug mb-1.5">
                      {nameText}
                    </h3>

                    {noteText && (
                      <FormattedText
                        text={noteText}
                        className="space-y-2 text-sm text-stone-600 dark:text-stone-300 leading-relaxed"
                      />
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

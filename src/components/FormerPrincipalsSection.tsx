import React from 'react';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { pickText } from '../utils/schoolHelpers';
import { FormattedText } from './FormattedText';
import { ProfileAvatar } from './ProfileAvatar';

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
          /* Distinct Chronological Vertical Timeline / Editorial Heritage Roll */
          <div className="max-w-4xl mx-auto relative">
            {/* Subtle vertical chronological rail */}
            <div
              className="hidden sm:block absolute left-6 top-6 bottom-6 w-px bg-stone-200 dark:bg-stone-800"
              aria-hidden="true"
            />

            <ol className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
              {list.map((principal, idx) => {
                const nameText = pickText(principal.name, language);
                const tenureText = pickText(principal.tenure, language);
                const noteText = pickText(principal.note, language);
                const sequenceNumber = String(idx + 1).padStart(2, '0');

                return (
                  <motion.li
                    key={principal.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.22, delay: Math.min(idx * 0.025, 0.16) }}
                    className="relative sm:pl-16 py-6 sm:py-7 group"
                  >
                    {/* Chronological Sequence Medallion on the timeline rail */}
                    <div
                      className="hidden sm:flex absolute left-1.5 top-7 w-9 h-9 rounded-full items-center justify-center font-mono-num text-xs font-semibold bg-[#FBF9F5] dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shadow-2xs transition-colors duration-150 group-hover:border-[var(--brand-primary)] dark:group-hover:border-[var(--brand-accent)]"
                      aria-hidden="true"
                    >
                      {sequenceNumber}
                    </div>

                    <div className="flex items-start gap-4 sm:gap-5 px-3 py-2.5 -mx-3 rounded-xl transition-colors duration-150 group-hover:bg-white/80 dark:group-hover:bg-stone-900/50">
                      {/* Circular Portrait Medallion with Selectable Default Avatar Fallback */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-stone-200/90 dark:ring-stone-700 bg-stone-100 dark:bg-stone-800 shrink-0 shadow-2xs">
                        <ProfileAvatar
                          photoUrl={principal.photoUrl}
                          defaultAvatar={principal.defaultAvatar}
                          name={nameText}
                          iconSizeClass="w-7 h-7"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                          <span className="sm:hidden font-mono-num text-[11px] font-semibold text-stone-400 dark:text-stone-500">
                            #{sequenceNumber}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono-num tracking-wide text-[var(--brand-primary)] dark:text-[var(--brand-accent)]">
                            <Calendar className="w-3 h-3 shrink-0" aria-hidden="true" />
                            <span>{tenureText}</span>
                          </span>
                        </div>

                        <h3 className="font-display text-xl sm:text-[1.35rem] font-semibold text-stone-900 dark:text-stone-50 leading-snug">
                          {nameText}
                        </h3>

                        {noteText && (
                          <FormattedText
                            text={noteText}
                            className="mt-1.5 space-y-2 text-sm text-stone-600 dark:text-stone-300 leading-relaxed"
                          />
                        )}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
};

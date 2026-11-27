import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { pickText } from '../utils/schoolHelpers';
import { FormattedText } from './FormattedText';
import { ProfileAvatar } from './ProfileAvatar';

export const PrincipalDesk: React.FC = () => {
  const { data, language, strings } = useSchoolData();
  const [expanded, setExpanded] = useState(false);

  const principalName = pickText(data.principal.name, language);
  const fullMessageText = pickText(data.principal.fullMessage, language).trim();

  return (
    <section className="py-14 lg:py-20 bg-[#FBF9F5] dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm p-6 sm:p-8 lg:p-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start">
            {/* Portrait Column — naturally hugs content with clean avatar fallback */}
            <div className="lg:col-span-4 w-full max-w-[280px] sm:max-w-[300px] lg:max-w-none mx-auto">
              <div className="aspect-[4/4.5] w-full rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 shadow-xs">
                <ProfileAvatar
                  photoUrl={data.principal.photoUrl}
                  defaultAvatar={data.principal.defaultAvatar}
                  name={principalName}
                  iconSizeClass="w-24 h-24"
                />
              </div>
            </div>

            {/* Editorial Address Column — dynamic height matching text */}
            <div className="lg:col-span-8 min-w-0">
              <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
                {strings.principal.kicker}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-4">
                {strings.principal.heading}
              </h2>

              <div className="pb-4 mb-5 border-b border-stone-200 dark:border-stone-800">
                <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {principalName}
                </div>
                <div className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                  {pickText(data.principal.credentials, language)} ·{' '}
                  {pickText(data.principal.tenure, language)}
                </div>
              </div>

              <div className="max-w-2xl space-y-4 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px] sm:text-base">
                <FormattedText
                  text={pickText(data.principal.summaryMessage, language)}
                  className="space-y-4"
                  firstParagraphClassName="first-letter:text-4xl first-letter:font-display first-letter:font-semibold first-letter:float-left first-letter:mr-2.5 first-letter:leading-none first-letter:text-[var(--brand-primary)] dark:first-letter:text-[var(--brand-accent)]"
                />

                <AnimatePresence initial={false}>
                  {expanded && fullMessageText && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden pt-1"
                    >
                      <FormattedText
                        text={fullMessageText}
                        className="space-y-4"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {fullMessageText && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all duration-150 active:scale-[0.98] cursor-pointer"
                  >
                    <span>
                      {expanded ? strings.principal.showLess : strings.principal.readMore}
                    </span>
                    {expanded ? (
                      <ChevronUp className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

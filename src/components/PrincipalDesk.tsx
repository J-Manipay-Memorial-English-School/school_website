import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { pickText } from '../utils/schoolHelpers';
import { SafeImage } from './SafeImage';

export const PrincipalDesk: React.FC = () => {
  const { data, language, strings } = useSchoolData();
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-16 lg:py-24 bg-[#FBF9F5] dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Portrait Column */}
            <div className="lg:col-span-4 relative min-h-[340px] lg:min-h-[460px] bg-stone-100 dark:bg-stone-800">
              <SafeImage
                src={data.principal.photoUrl}
                alt={pickText(data.principal.name, language)}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Editorial Address Column */}
            <div className="lg:col-span-8 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
                  {strings.principal.kicker}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-4">
                  {strings.principal.heading}
                </h2>

                <div className="pb-5 mb-6 border-b border-stone-200 dark:border-stone-800">
                  <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    {pickText(data.principal.name, language)}
                  </div>
                  <div className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                    {pickText(data.principal.credentials, language)} · {pickText(data.principal.tenure, language)}
                  </div>
                </div>

                <div className="max-w-2xl space-y-4 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px] sm:text-base">
                  <p className="first-letter:text-4xl first-letter:font-display first-letter:font-semibold first-letter:float-left first-letter:mr-2.5 first-letter:leading-none first-letter:text-[var(--brand-primary)] dark:first-letter:text-[var(--brand-accent)]">
                    {pickText(data.principal.summaryMessage, language)}
                  </p>

                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden space-y-4 pt-1"
                      >
                        {pickText(data.principal.fullMessage, language)
                          .split('\n\n')
                          .map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { useSchoolData } from '../context/SchoolDataContext';
import { pickText } from '../utils/schoolHelpers';
import { SchoolCrest } from './SchoolCrest';

export const MottoSpotlight: React.FC = () => {
  const { data, language, strings } = useSchoolData();

  return (
    <section
      aria-label={strings.hero.mottoLabel}
      className="pt-14 lg:pt-20 bg-[#FBF9F5] dark:bg-stone-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.26 }}
          className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 sm:p-12 text-center shadow-sm"
        >
          <div className="max-w-2xl mx-auto">
            <SchoolCrest className="w-12 h-12 mx-auto mb-3.5" />
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 block mb-3">
              {strings.hero.mottoLabel}
            </span>
            <blockquote
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold italic py-4 border-y border-stone-200 dark:border-stone-800"
              style={{ color: 'var(--brand-primary)' }}
            >
              <span className="dark:text-[var(--brand-accent)]">
                “{pickText(data.heritage.motto, language)}”
              </span>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, Medal, Trophy } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { AchievementCategory } from '../types/school';
import { pickText } from '../utils/schoolHelpers';
import { FormattedText } from './FormattedText';
import { SafeImage } from './SafeImage';

type AchievementFilter = 'All' | AchievementCategory;

export const AchievementsSection: React.FC = () => {
  const { data, language, strings } = useSchoolData();
  const [filter, setFilter] = useState<AchievementFilter>('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return data.achievements;
    return data.achievements.filter((a) => a.category === filter);
  }, [data.achievements, filter]);

  const categories: AchievementFilter[] = ['All', 'Academic', 'Sports', 'Co-Curricular'];

  const getIcon = (cat: AchievementCategory) => {
    if (cat === 'Sports') return Trophy;
    if (cat === 'Co-Curricular') return Award;
    return BookOpen;
  };

  return (
    <section id="achievements" className="py-14 lg:py-20 bg-[#FBF9F5] dark:bg-stone-950 min-h-[72vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
            {strings.achievements.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
            {strings.achievements.heading}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed">
            {strings.achievements.subtitle}
          </p>
        </div>

        {/* Centered Sub-Navigation Filter Row */}
        <div className="flex justify-center mb-10">
          <div
            className="flex flex-wrap justify-center gap-2 p-1.5 rounded-xl bg-stone-200/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
            role="tablist"
            aria-label={strings.achievements.heading}
          >
            {categories.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {strings.achievements.categories[cat]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item, idx) => {
            const Icon = getIcon(item.category);
            const titleText = pickText(item.title, language);
            const distinctionText = pickText(item.distinction, language);
            const descriptionText = pickText(item.description, language);
            const recipientText = pickText(item.recipient, language);

            return (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden flex flex-col"
              >
                {item.photoUrl && (
                  <div className="aspect-[16/9] w-full bg-stone-100 dark:bg-stone-800 overflow-hidden border-b border-stone-200 dark:border-stone-800">
                    <SafeImage
                      src={item.photoUrl}
                      alt={titleText}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="text-xs text-stone-500 dark:text-stone-400 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-accent)]">
                          {strings.achievements.categories[item.category]}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-num">{item.year}</span>
                        {distinctionText && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{distinctionText}</span>
                          </>
                        )}
                      </div>
                      <div
                        className="p-2 rounded-lg text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shrink-0"
                        style={{ backgroundColor: 'var(--brand-primary-soft)' }}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                    </div>

                    <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-50 mb-2">
                      {titleText}
                    </h3>

                    <FormattedText
                      text={descriptionText}
                      className="space-y-2.5 text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-5"
                    />
                  </div>

                  {recipientText && (
                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 text-xs font-medium text-stone-700 dark:text-stone-200">
                      <Medal className="w-4 h-4 text-[var(--brand-accent)] shrink-0" aria-hidden="true" />
                      <span>{recipientText}</span>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};


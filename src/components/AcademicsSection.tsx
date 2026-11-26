import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { pickSubjectList, pickText } from '../utils/schoolHelpers';
import { AcademicProgramIcon } from './AcademicProgramIcon';
import { FormattedText } from './FormattedText';

export const AcademicsSection: React.FC = () => {
  const { data, language, strings } = useSchoolData();

  const filterTabs = data.academicsConfig?.filters || [];
  const defaultFilterId =
    filterTabs.find((f) => f.isAll)?.id || filterTabs[0]?.id || 'All';

  const [filterId, setFilterId] = useState<string>(defaultFilterId);

  useEffect(() => {
    if (filterTabs.length > 0 && !filterTabs.some((f) => f.id === filterId)) {
      setFilterId(filterTabs.find((f) => f.isAll)?.id || filterTabs[0].id);
    }
  }, [filterTabs, filterId]);

  const activeFilterTab = useMemo(
    () => filterTabs.find((f) => f.id === filterId),
    [filterTabs, filterId]
  );

  const filteredPrograms = useMemo(() => {
    if (filterTabs.length === 0 || !activeFilterTab || activeFilterTab.isAll) {
      return data.academics;
    }
    return data.academics.filter((p) => p.stage === activeFilterTab.id);
  }, [data.academics, filterTabs.length, activeFilterTab]);

  const kickerText =
    pickText(data.academicsConfig?.kicker, language) || strings.academics.kicker;
  const headingText =
    pickText(data.academicsConfig?.heading, language) || strings.academics.heading;
  const subtitleText =
    pickText(data.academicsConfig?.subtitle, language) || strings.academics.subtitle;
  const subjectsHeadingText =
    pickText(data.academicsConfig?.subjectsHeading, language) ||
    strings.academics.subjectsHeading;

  return (
    <section id="academics" className="py-14 lg:py-20 bg-[#FBF9F5] dark:bg-stone-950 min-h-[72vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          {kickerText && (
            <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
              {kickerText}
            </p>
          )}
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
            {headingText}
          </h2>
          {subtitleText && (
            <FormattedText
              text={subtitleText}
              className="space-y-2 text-stone-600 dark:text-stone-300 text-base leading-relaxed"
            />
          )}
        </div>

        {/* Centered Sub-Navigation Filter Row */}
        {filterTabs.length > 0 && (
          <div className="flex justify-center mb-10">
            <div
              className="flex flex-wrap justify-center gap-2 p-1.5 rounded-xl bg-stone-200/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              role="tablist"
              aria-label={headingText}
            >
              {filterTabs.map((opt) => {
                const active = filterId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilterId(opt.id)}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-white shadow-sm'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    {pickText(opt.label, language)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {filteredPrograms.length === 0 ? (
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-10 text-center text-sm text-stone-500 dark:text-stone-400">
            No academic pathways are currently assigned to this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program, idx) => {
              const titleText = pickText(program.title, language);
              const gradesText = pickText(program.grades, language);
              const overviewText = pickText(program.overview, language);
              const subjectItems = pickSubjectList(program.subjects, language);

              const linkedFilter = filterTabs.find(
                (f) => !f.isAll && f.id === program.stage
              );
              const stageLabel = linkedFilter
                ? pickText(linkedFilter.label, language)
                : program.stage;
              const badgeMeta = [program.streamCode?.trim(), stageLabel?.trim()]
                .filter(Boolean)
                .join(' · ');

              return (
                <motion.article
                  key={program.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="flex flex-col justify-between rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-7 hover:-translate-y-0.5 transition-transform duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="font-mono-num text-xs font-semibold tracking-wider text-stone-500 dark:text-stone-400">
                        {badgeMeta}
                      </span>
                      <div
                        className="p-2 rounded-lg text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shrink-0"
                        style={{ backgroundColor: 'var(--brand-primary-soft)' }}
                      >
                        <AcademicProgramIcon
                          iconKey={program.iconKey}
                          iconImageUrl={program.iconImageUrl}
                          streamCode={program.streamCode}
                          alt={titleText}
                          iconClassName="w-4 h-4"
                          imageClassName="w-5 h-5 object-contain rounded"
                        />
                      </div>
                    </div>

                    <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-50 mb-1.5">
                      {titleText}
                    </h3>
                    {gradesText && (
                      <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-4">
                        {gradesText}
                      </p>
                    )}

                    {overviewText && (
                      <FormattedText
                        text={overviewText}
                        className="space-y-2.5 text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-5"
                      />
                    )}

                    {subjectItems.length > 0 && (
                      <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                        {subjectsHeadingText && (
                          <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mb-3">
                            {subjectsHeadingText}
                          </h4>
                        )}
                        <ul className="space-y-2">
                          {subjectItems.map((sub, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-stone-700 dark:text-stone-200"
                            >
                              <Check
                                className="w-4 h-4 shrink-0 mt-0.5 text-[var(--brand-primary)] dark:text-[var(--brand-accent)]"
                                aria-hidden="true"
                              />
                              <span>{sub}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
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


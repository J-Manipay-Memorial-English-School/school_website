import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Check, Compass, Cpu, GraduationCap, LineChart } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { AcademicStage } from '../types/school';
import { pickList, pickText } from '../utils/schoolHelpers';

type StageFilter = 'All' | AcademicStage;

export const AcademicsSection: React.FC = () => {
  const { data, language, strings } = useSchoolData();
  const [filter, setFilter] = useState<StageFilter>('All');

  const filteredPrograms = useMemo(() => {
    if (filter === 'All') return data.academics;
    return data.academics.filter((p) => p.stage === filter);
  }, [data.academics, filter]);

  const filterOptions: { id: StageFilter; label: string }[] = [
    { id: 'All', label: strings.academics.filters.all },
    { id: 'Primary', label: strings.academics.filters.primary },
    { id: 'Junior Secondary', label: strings.academics.filters.junior },
    { id: 'GCE A/L', label: strings.academics.filters.al },
  ];

  const getIcon = (streamCode: string) => {
    if (streamCode.includes('TECH')) return Cpu;
    if (streamCode.includes('COMM')) return LineChart;
    if (streamCode.includes('ARTS')) return Compass;
    if (streamCode.includes('06')) return GraduationCap;
    return BookOpen;
  };

  return (
    <section id="academics" className="py-14 lg:py-20 bg-[#FBF9F5] dark:bg-stone-950 min-h-[72vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
            {strings.academics.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
            {strings.academics.heading}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed">
            {strings.academics.subtitle}
          </p>
        </div>

        {/* Centered Sub-Navigation Filter Row */}
        <div className="flex justify-center mb-10">
          <div
            className="flex flex-wrap justify-center gap-2 p-1.5 rounded-xl bg-stone-200/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
            role="tablist"
            aria-label={strings.academics.heading}
          >
            {filterOptions.map((opt) => {
              const active = filter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(opt.id)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program, idx) => {
            const Icon = getIcon(program.streamCode);
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
                      {program.streamCode} · {program.stage}
                    </span>
                    <div
                      className="p-2 rounded-lg text-[var(--brand-primary)] dark:text-[var(--brand-accent)]"
                      style={{ backgroundColor: 'var(--brand-primary-soft)' }}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-50 mb-1.5">
                    {pickText(program.title, language)}
                  </h3>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-4">
                    {pickText(program.grades, language)}
                  </p>

                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-5">
                    {pickText(program.overview, language)}
                  </p>

                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mb-3">
                      {strings.academics.subjectsHeading}
                    </h4>
                    <ul className="space-y-2">
                      {pickList(program.subjects, language).map((sub, i) => (
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
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

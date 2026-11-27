import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { ChevronDown, ChevronUp, Users, X } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { pickText } from '../utils/schoolHelpers';

interface CounterNumberProps {
  target: number;
  inView: boolean;
}

const CounterNumber: React.FC<CounterNumberProps> = ({ target, inView }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 600;
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, inView]);

  return <span className="font-mono-num tabular-nums">{display.toLocaleString()}</span>;
};

export const StatsBar: React.FC = () => {
  const { data, language, strings } = useSchoolData();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  const strengthTotals = useMemo(() => {
    return data.studentStrength.reduce(
      (acc, cls) => {
        const boys = Number(cls.boys) || 0;
        const girls = Number(cls.girls) || 0;
        return {
          boys: acc.boys + boys,
          girls: acc.girls + girls,
          total: acc.total + boys + girls,
        };
      },
      { boys: 0, girls: 0, total: 0 }
    );
  }, [data.studentStrength]);

  const totalStudents =
    data.studentStrength.length > 0 ? strengthTotals.total : data.stats.students;

  const secondaryItems = [
    {
      key: 'academicStaff',
      value: data.stats.academicStaff,
      label: strings.stats.academicStaff,
      sub: strings.stats.academicStaffSub,
    },
    {
      key: 'nonAcademicStaff',
      value: data.stats.nonAcademicStaff,
      label: strings.stats.nonAcademicStaff,
      sub: strings.stats.nonAcademicStaffSub,
    },
    {
      key: 'prefects',
      value: data.stats.prefects,
      label: strings.stats.prefects,
      sub: strings.stats.prefectsSub,
    },
  ];

  return (
    <section
      ref={sectionRef}
      aria-label="School community statistics"
      className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-stone-800">
          {/* Interactive Active Students Card (with Boys/Girls totals & Breakdown Toggle) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.24 }}
            onClick={() => setBreakdownOpen((prev) => !prev)}
            role="button"
            tabIndex={0}
            aria-expanded={breakdownOpen}
            aria-controls="class-strength-breakdown"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setBreakdownOpen((prev) => !prev);
              }
            }}
            className="py-7 sm:py-9 px-4 sm:px-6 first:pl-2 sm:first:pl-4 cursor-pointer group hover:bg-stone-50/70 dark:hover:bg-stone-800/35 transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            <div
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-1.5"
              style={{ color: 'var(--brand-primary)' }}
            >
              <span className="dark:text-[var(--brand-accent)]">
                <CounterNumber target={totalStudents} inView={inView} />
              </span>
            </div>

            <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              {strings.stats.students}
            </div>

            {/* Boys & Girls Sub-Counters */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200/80 dark:border-stone-700">
                <span>{strings.stats.boys}:</span>
                <span className="font-mono-num font-semibold text-stone-900 dark:text-white">
                  {strengthTotals.boys.toLocaleString()}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200/80 dark:border-stone-700">
                <span>{strings.stats.girls}:</span>
                <span className="font-mono-num font-semibold text-stone-900 dark:text-white">
                  {strengthTotals.girls.toLocaleString()}
                </span>
              </span>
            </div>

            {/* Breakdown Toggle Trigger */}
            <div className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-accent)] group-hover:underline">
              <span>
                {breakdownOpen ? strings.stats.hideBreakdown : strings.stats.viewBreakdown}
              </span>
              {breakdownOpen ? (
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </div>
          </motion.div>

          {/* Remaining Live Stat Cards */}
          {secondaryItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.24, delay: (index + 1) * 0.03 }}
              className="py-7 sm:py-9 px-4 sm:px-8"
            >
              <div
                className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-1.5"
                style={{ color: 'var(--brand-primary)' }}
              >
                <span className="dark:text-[var(--brand-accent)]">
                  <CounterNumber target={item.value} inView={inView} />
                </span>
              </div>
              <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {item.label}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Expandable Class-wise Student Strength Breakdown */}
        <AnimatePresence initial={false}>
          {breakdownOpen && (
            <motion.div
              id="class-strength-breakdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-8 pt-2">
                <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950 overflow-hidden shadow-xs">
                  <div className="px-5 py-4 sm:px-6 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shrink-0">
                        <Users className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">
                          {strings.stats.breakdownTitle}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {strings.stats.breakdownSubtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-stone-600 dark:text-stone-300">
                          {strings.stats.boys}:{' '}
                          <strong className="font-mono-num text-stone-900 dark:text-white">
                            {strengthTotals.boys.toLocaleString()}
                          </strong>
                        </span>
                        <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-stone-600 dark:text-stone-300">
                          {strings.stats.girls}:{' '}
                          <strong className="font-mono-num text-stone-900 dark:text-white">
                            {strengthTotals.girls.toLocaleString()}
                          </strong>
                        </span>
                        <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-[var(--brand-primary)] dark:text-[var(--brand-accent)] font-semibold">
                          {strings.stats.total}:{' '}
                          <span className="font-mono-num">
                            {strengthTotals.total.toLocaleString()}
                          </span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setBreakdownOpen(false)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                        aria-label={strings.stats.hideBreakdown}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Clean Class-by-Class Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-stone-200 dark:border-stone-800 text-[11px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 bg-stone-100/60 dark:bg-stone-900/50">
                          <th className="py-3 px-4 sm:px-6">{strings.stats.classCol}</th>
                          <th className="py-3 px-4 text-right">{strings.stats.boys}</th>
                          <th className="py-3 px-4 text-right">{strings.stats.girls}</th>
                          <th className="py-3 px-4 sm:px-6 text-right">
                            {strings.stats.classTotalCol}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200/70 dark:divide-stone-800/80 text-sm">
                        {data.studentStrength.map((cls) => {
                          const classTotal = (Number(cls.boys) || 0) + (Number(cls.girls) || 0);
                          return (
                            <tr
                              key={cls.id}
                              className="hover:bg-white dark:hover:bg-stone-900/60 transition-colors"
                            >
                              <td className="py-3 px-4 sm:px-6 font-medium text-stone-900 dark:text-stone-100">
                                {pickText(cls.grade, language)}
                              </td>
                              <td className="py-3 px-4 text-right font-mono-num tabular-nums text-stone-700 dark:text-stone-300">
                                {(Number(cls.boys) || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right font-mono-num tabular-nums text-stone-700 dark:text-stone-300">
                                {(Number(cls.girls) || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 sm:px-6 text-right font-mono-num tabular-nums font-semibold text-stone-900 dark:text-white">
                                {classTotal.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm font-semibold">
                          <td className="py-3.5 px-4 sm:px-6 text-stone-900 dark:text-white">
                            {strings.stats.allClassesTotal}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono-num tabular-nums text-stone-900 dark:text-stone-100">
                            {strengthTotals.boys.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono-num tabular-nums text-stone-900 dark:text-stone-100">
                            {strengthTotals.girls.toLocaleString()}
                          </td>
                          <td
                            className="py-3.5 px-4 sm:px-6 text-right font-mono-num tabular-nums"
                            style={{ color: 'var(--brand-primary)' }}
                          >
                            <span className="dark:text-[var(--brand-accent)]">
                              {strengthTotals.total.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

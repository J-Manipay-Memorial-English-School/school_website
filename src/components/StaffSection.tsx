import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Award, User } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { StaffSectionCategory } from '../types/school';
import { pickText } from '../utils/schoolHelpers';
import { SafeImage } from './SafeImage';

type StaffFilter = 'All' | StaffSectionCategory;

function getInitials(name: string): string {
  const cleaned = name
    .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Rev\.|திருமதி|திரு\.|செல்வி)\s*/i, '')
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'T';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const StaffSection: React.FC = () => {
  const { data, language, strings } = useSchoolData();
  const [filter, setFilter] = useState<StaffFilter>('All');

  const filteredTeachers = useMemo(() => {
    if (filter === 'All') return data.staffMembers;
    return data.staffMembers.filter((member) => member.category === filter);
  }, [data.staffMembers, filter]);

  const filterOptions: StaffFilter[] = ['All', 'Primary', 'Secondary', 'GCE A/L'];

  return (
    <section
      id="staff"
      className="py-14 lg:py-20 bg-[#FBF9F5] dark:bg-stone-950 min-h-[72vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
            {strings.staff.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
            {strings.staff.heading}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed">
            {strings.staff.subtitle}
          </p>
        </div>

        {/* Top Spotlight — The Principal (Auto-synced with SchoolDataContext principal) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto mb-14 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
            <div className="sm:col-span-5 aspect-[4/4] sm:aspect-[3/4] h-full bg-stone-100 dark:bg-stone-800">
              <SafeImage
                src={data.principal.photoUrl}
                alt={pickText(data.principal.name, language)}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="sm:col-span-7 p-6 sm:p-8 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-accent)] mb-2">
                <Award className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{strings.staff.principalRoleLabel}</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-50 mb-2">
                {pickText(data.principal.name, language)}
              </h3>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-200 mb-2">
                {pickText(data.principal.credentials, language)}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                {pickText(data.principal.tenure, language)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Teachers Directory Header + Centered Sub-Navigation Filter Row */}
        <div className="text-center mb-6">
          <h3 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
            {strings.staff.teachersHeading}
          </h3>
        </div>

        <div className="flex justify-center mb-10">
          <div
            className="flex flex-wrap justify-center gap-2 p-1.5 rounded-xl bg-stone-200/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
            role="tablist"
            aria-label={strings.staff.teachersHeading}
          >
            {filterOptions.map((opt) => {
              const active = filter === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(opt)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {strings.staff.filters[opt]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Teachers Grid */}
        {filteredTeachers.length === 0 ? (
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-12 text-center text-sm text-stone-500 dark:text-stone-400">
            {strings.staff.emptyState}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher, idx) => {
              const teacherName = pickText(teacher.name, language);
              const teacherRole = pickText(teacher.role, language);
              const teacherQuals = pickText(teacher.qualifications, language);
              return (
                <motion.article
                  key={teacher.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.32, delay: idx * 0.04 }}
                  className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 flex items-start gap-4 hover:-translate-y-0.5 transition-transform duration-200"
                >
                  {/* Portrait or Clean Avatar Fallback */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shrink-0 flex items-center justify-center">
                    {teacher.photoUrl ? (
                      <SafeImage
                        src={teacher.photoUrl}
                        alt={teacherName}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center text-white font-display font-semibold text-lg"
                        style={{ backgroundColor: 'var(--brand-primary)' }}
                        aria-label={teacherName}
                      >
                        <span>{getInitials(teacher.name.en || teacher.name.ta)}</span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-accent)] mb-1 flex items-center gap-1.5">
                      <User className="w-3 h-3 shrink-0" aria-hidden="true" />
                      <span>{strings.staff.filters[teacher.category]}</span>
                    </div>

                    <h4 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50 leading-snug mb-1">
                      {teacherName}
                    </h4>

                    <p className="text-sm text-stone-700 dark:text-stone-200 leading-snug mb-1.5">
                      {teacherRole}
                    </p>

                    {teacherQuals && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                        {teacherQuals}
                      </p>
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

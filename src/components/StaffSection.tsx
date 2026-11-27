import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Award, User } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { StaffSectionCategory } from '../types/school';
import { pickText } from '../utils/schoolHelpers';
import { ProfileAvatar } from './ProfileAvatar';

type StaffFilter = 'All' | StaffSectionCategory;

export const StaffSection: React.FC = () => {
  const { data, language, strings } = useSchoolData();
  const [filter, setFilter] = useState<StaffFilter>('All');

  const filteredTeachers = useMemo(() => {
    if (filter === 'All') return data.staffMembers;
    return data.staffMembers.filter((member) => member.category === filter);
  }, [data.staffMembers, filter]);

  const filterOptions: StaffFilter[] = ['All', 'Primary', 'Secondary'];
  const principalName = pickText(data.principal.name, language);

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

        {/* Top Spotlight — The Principal (Dynamic height hugging content, avatar fallback ready) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto mb-14 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-36 h-40 sm:w-44 sm:h-48 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shrink-0">
              <ProfileAvatar
                photoUrl={data.principal.photoUrl}
                defaultAvatar={data.principal.defaultAvatar}
                name={principalName}
                iconSizeClass="w-16 h-16"
              />
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left sm:py-1">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-accent)] mb-2">
                <Award className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{strings.staff.principalRoleLabel}</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-50 mb-2">
                {principalName}
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
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 ${
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

        {/* Teachers Grid — items-start guarantees every box height cleanly fits its own content */}
        {filteredTeachers.length === 0 ? (
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-12 text-center text-sm text-stone-500 dark:text-stone-400">
            {strings.staff.emptyState}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
            {filteredTeachers.map((teacher, idx) => {
              const teacherName = pickText(teacher.name, language);
              const teacherRole = pickText(teacher.role, language);
              const teacherQuals = pickText(teacher.qualifications, language);
              return (
                <motion.article
                  key={teacher.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.22, delay: Math.min(idx * 0.025, 0.15) }}
                  className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-150"
                >
                  <div className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shrink-0">
                    <ProfileAvatar
                      photoUrl={teacher.photoUrl}
                      defaultAvatar={teacher.defaultAvatar}
                      name={teacherName}
                      iconSizeClass="w-8 h-8"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-accent)] mb-1 flex items-center gap-1.5">
                      <User className="w-3 h-3 shrink-0" aria-hidden="true" />
                      <span>{strings.staff.filters[teacher.category] || strings.staff.filters.Secondary}</span>
                    </div>

                    <h4 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50 leading-snug mb-1">
                      {teacherName}
                    </h4>

                    <p className="text-sm text-stone-700 dark:text-stone-200 leading-snug">
                      {teacherRole}
                    </p>

                    {teacherQuals && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mt-1.5">
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

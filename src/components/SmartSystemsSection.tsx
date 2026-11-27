import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  BellRing,
  CalendarClock,
  ClipboardCheck,
  ExternalLink,
} from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { SmartSystemIconKey } from '../types/school';
import { pickText } from '../utils/schoolHelpers';
import { FormattedText } from './FormattedText';

function getSystemIcon(key: SmartSystemIconKey) {
  switch (key) {
    case 'relief':
      return CalendarClock;
    case 'attendance':
      return ClipboardCheck;
    case 'marks':
      return BarChart3;
    case 'bell':
      return BellRing;
    default:
      return CalendarClock;
  }
}

export const SmartSystemsSection: React.FC = () => {
  const { data, language, strings } = useSchoolData();

  const visibleSystems = data.smartSystems.filter((sys) => sys.enabled);
  if (visibleSystems.length === 0) return null;

  return (
    <section
      id="smart-systems"
      className="py-14 lg:py-18 bg-[#FBF9F5] dark:bg-stone-950 border-t border-stone-200/80 dark:border-stone-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
            {strings.smartSystems.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
            {strings.smartSystems.heading}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed">
            {strings.smartSystems.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visibleSystems.map((sys, idx) => {
            const Icon = getSystemIcon(sys.iconKey);
            const cleanUrl = sys.url.trim();
            const hasValidUrl = Boolean(cleanUrl && cleanUrl !== '#');

            return (
              <motion.article
                key={sys.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.22, delay: Math.min(idx * 0.025, 0.14) }}
                className="flex flex-col justify-between rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
              >
                <div>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-[var(--brand-primary)] dark:text-[var(--brand-accent)]"
                    style={{ backgroundColor: 'var(--brand-primary-soft)' }}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>

                  <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50 leading-snug mb-2">
                    {pickText(sys.title, language)}
                  </h3>

                  <FormattedText
                    text={pickText(sys.description, language)}
                    className="space-y-2 text-sm text-stone-600 dark:text-stone-300 leading-relaxed"
                  />
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800">
                  {hasValidUrl ? (
                    <a
                      href={cleanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                      <span>{strings.smartSystems.launchButton}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center justify-center w-full px-3.5 py-2 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400">
                      {strings.smartSystems.comingSoon}
                    </span>
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

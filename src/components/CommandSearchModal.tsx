import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, BookOpen, FileText, Search, Trophy, User, X } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { NoticeItem, PublicTab } from '../types/school';
import { pickText } from '../utils/schoolHelpers';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNotice: (notice: NoticeItem) => void;
  onSelectTab: (tab: PublicTab) => void;
}

interface SearchResult {
  id: string;
  group: string;
  title: string;
  subtitle: string;
  icon: 'notice' | 'academic' | 'achievement' | 'staff';
  action: () => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectNotice,
  onSelectTab,
}) => {
  const { data, language, strings } = useSchoolData();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    const list: SearchResult[] = [];

    data.notices.forEach((notice) => {
      const hay = `${notice.title.en} ${notice.title.ta} ${notice.summary.en} ${notice.summary.ta} ${notice.referenceCode} ${notice.category}`.toLowerCase();
      if (!q || hay.includes(q)) {
        list.push({
          id: `res-${notice.id}`,
          group: strings.nav.notices,
          title: pickText(notice.title, language),
          subtitle: `${notice.category} · ${notice.date} · ${notice.referenceCode}`,
          icon: 'notice',
          action: () => {
            onClose();
            onSelectTab('notices');
            onSelectNotice(notice);
          },
        });
      }
    });

    data.academics.forEach((prog) => {
      const linkedFilter = (data.academicsConfig?.filters || []).find(
        (f) => !f.isAll && f.id === prog.stage
      );
      const filterText = linkedFilter
        ? `${linkedFilter.label.en} ${linkedFilter.label.ta}`
        : prog.stage;
      const hay = `${prog.title.en} ${prog.title.ta} ${prog.grades.en} ${prog.grades.ta} ${prog.overview.en} ${prog.overview.ta} ${prog.subjects.en.join(' ')} ${prog.subjects.ta.join(' ')} ${prog.streamCode} ${filterText}`.toLowerCase();
      if (!q || hay.includes(q)) {
        list.push({
          id: `res-${prog.id}`,
          group: strings.nav.academics,
          title: pickText(prog.title, language),
          subtitle: pickText(prog.grades, language),
          icon: 'academic',
          action: () => {
            onClose();
            onSelectTab('academics');
          },
        });
      }
    });

    data.achievements.forEach((ach) => {
      const hay = `${ach.title.en} ${ach.title.ta} ${ach.recipient.en} ${ach.recipient.ta} ${ach.description.en} ${ach.description.ta} ${ach.category} ${ach.year}`.toLowerCase();
      if (!q || hay.includes(q)) {
        list.push({
          id: `res-${ach.id}`,
          group: strings.nav.achievements,
          title: pickText(ach.title, language),
          subtitle: `${ach.category} · ${ach.year}`,
          icon: 'achievement',
          action: () => {
            onClose();
            onSelectTab('achievements');
          },
        });
      }
    });

    data.staffMembers.forEach((member) => {
      const hay = `${member.name.en} ${member.name.ta} ${member.role.en} ${member.role.ta} ${member.category} ${member.qualifications?.en || ''} ${member.qualifications?.ta || ''}`.toLowerCase();
      if (!q || hay.includes(q)) {
        list.push({
          id: `res-${member.id}`,
          group: strings.nav.staff,
          title: pickText(member.name, language),
          subtitle: `${strings.staff.filters[member.category]} · ${pickText(member.role, language)}`,
          icon: 'staff',
          action: () => {
            onClose();
            onSelectTab('staff');
          },
        });
      }
    });

    data.formerPrincipals.forEach((fp) => {
      const hay = `${fp.name.en} ${fp.name.ta} ${fp.tenure.en} ${fp.tenure.ta} ${fp.note?.en || ''} ${fp.note?.ta || ''}`.toLowerCase();
      if (!q || hay.includes(q)) {
        list.push({
          id: `res-${fp.id}`,
          group: strings.nav.formerPrincipals,
          title: pickText(fp.name, language),
          subtitle: pickText(fp.tenure, language),
          icon: 'staff',
          action: () => {
            onClose();
            onSelectTab('formerPrincipals');
          },
        });
      }
    });

    data.examResults.forEach((res) => {
      const performerNames = res.topPerformers
        .map((tp) => `${tp.name.en} ${tp.name.ta} ${tp.achievement.en} ${tp.achievement.ta}`)
        .join(' ');
      const hay = `${res.category} ${res.year} ${res.passPercentage} ${res.summary?.en || ''} ${res.summary?.ta || ''} ${performerNames}`.toLowerCase();
      if (!q || hay.includes(q)) {
        list.push({
          id: `res-${res.id}`,
          group: strings.nav.examResults,
          title: `${strings.examResults.categories[res.category]} — ${res.year}`,
          subtitle: `${res.passPercentage} ${strings.examResults.passRateLabel}`,
          icon: 'achievement',
          action: () => {
            onClose();
            onSelectTab('examResults');
          },
        });
      }
    });

    return list.slice(0, 14);
  }, [data, language, query, strings, onClose, onSelectNotice, onSelectTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={strings.header.searchTitle}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-200 dark:border-stone-800">
              <Search className="w-5 h-5 text-stone-400 shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={strings.header.searchPlaceholder}
                className="w-full bg-transparent text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[56vh] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/70">
              {results.length === 0 ? (
                <div className="py-12 px-6 text-center text-sm text-stone-500 dark:text-stone-400">
                  {strings.header.searchEmpty}
                </div>
              ) : (
                results.map((item) => {
                  const Icon =
                    item.icon === 'notice'
                      ? FileText
                      : item.icon === 'academic'
                      ? BookOpen
                      : item.icon === 'staff'
                      ? User
                      : Trophy;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.action}
                      className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                            {item.group}
                          </p>
                          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <ArrowRight
                        className="w-4 h-4 text-stone-400 group-hover:text-[var(--brand-primary)] dark:group-hover:text-[var(--brand-accent)] shrink-0 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-950/60 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span>{strings.header.searchTitle}</span>
              <span className="font-mono-num">ESC · Ctrl+K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

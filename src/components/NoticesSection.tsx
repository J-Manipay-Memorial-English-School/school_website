import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Download, FileText, Paperclip, Pin, Search, X } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { NoticeAttachment, NoticeCategory, NoticeItem } from '../types/school';
import { pickText } from '../utils/schoolHelpers';

type NoticeFilter = 'All' | NoticeCategory;

interface NoticesSectionProps {
  selectedNotice: NoticeItem | null;
  onSelectNotice: (notice: NoticeItem | null) => void;
}

export const NoticesSection: React.FC<NoticesSectionProps> = ({
  selectedNotice,
  onSelectNotice,
}) => {
  const { data, language, strings } = useSchoolData();
  const [category, setCategory] = useState<NoticeFilter>('All');
  const [keyword, setKeyword] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState<{
    attachment: NoticeAttachment;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (!previewAttachment && !selectedNotice) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (previewAttachment) {
          setPreviewAttachment(null);
        } else if (selectedNotice) {
          onSelectNotice(null);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [previewAttachment, selectedNotice, onSelectNotice]);

  const filteredNotices = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return [...data.notices]
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.date.localeCompare(a.date);
      })
      .filter((notice) => {
        if (category !== 'All' && notice.category !== category) return false;
        if (!q) return true;
        const hay = `${notice.title.en} ${notice.title.ta} ${notice.summary.en} ${notice.summary.ta} ${notice.referenceCode}`.toLowerCase();
        return hay.includes(q);
      });
  }, [data.notices, category, keyword]);

  const categories: NoticeFilter[] = ['All', 'Exams', 'Circulars', 'Events'];

  const formatAttachmentLabel = (attachment: NoticeAttachment) => {
    const isPdf =
      attachment.mimeType === 'application/pdf' ||
      attachment.name.toLowerCase().endsWith('.pdf');
    return isPdf ? `${strings.notices.viewAttachment} (PDF)` : strings.notices.viewAttachment;
  };

  return (
    <section
      id="notices"
      className="py-14 lg:py-20 bg-[#FBF9F5] dark:bg-stone-950 min-h-[72vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
            {strings.notices.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
            {strings.notices.heading}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed">
            {strings.notices.subtitle}
          </p>
        </div>

        {/* Centered Sub-Navigation Category Tabs + Search Row */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div
            className="flex flex-wrap justify-center gap-2 p-1.5 rounded-xl bg-stone-200/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
            role="tablist"
            aria-label="Filter notices by category"
          >
            {categories.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {strings.notices.categories[cat]}
                </button>
              );
            })}
          </div>

          <div className="w-full max-w-md relative">
            <Search
              className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={strings.notices.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>
        </div>

        {filteredNotices.length === 0 ? (
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-12 text-center text-sm text-stone-500 dark:text-stone-400">
            {strings.notices.emptyState}
          </div>
        ) : (
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 divide-y divide-stone-200 dark:divide-stone-800 px-5 sm:px-8">
            {filteredNotices.map((notice) => {
              const titleText = pickText(notice.title, language);
              const summaryText = pickText(notice.summary, language);
              return (
                <article
                  key={notice.id}
                  className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="min-w-0 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
                      <span className="font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-accent)]">
                        {strings.notices.categories[notice.category]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <time className="font-mono-num" dateTime={notice.date}>
                        {notice.date}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">
                        {strings.notices.referenceLabel}: {notice.referenceCode}
                      </span>
                      {notice.pinned && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-200">
                            <Pin className="w-3 h-3" aria-hidden="true" />
                            <span>{strings.notices.pinnedLabel}</span>
                          </span>
                        </>
                      )}
                      {notice.attachment && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 font-medium text-stone-700 dark:text-stone-200">
                            <Paperclip className="w-3 h-3" aria-hidden="true" />
                            <span className="truncate max-w-[180px]">{notice.attachment.name}</span>
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-50 mb-1.5">
                      {titleText}
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      {summaryText}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-wrap items-center gap-2">
                    {notice.attachment && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewAttachment({
                            attachment: notice.attachment!,
                            title: titleText,
                          })
                        }
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
                        style={{ backgroundColor: 'var(--brand-primary)' }}
                      >
                        <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>{formatAttachmentLabel(notice.attachment)}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectNotice(notice)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>{strings.notices.readFull}</span>
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Read Full Notice Drawer / Modal */}
      <AnimatePresence>
        {selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex justify-end"
            onClick={() => onSelectNotice(null)}
            role="dialog"
            aria-modal="true"
            aria-label={pickText(selectedNotice.title, language)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl h-full bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl overflow-y-auto p-6 sm:p-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-stone-200 dark:border-stone-800">
                  <div className="text-xs font-mono-num text-stone-500 dark:text-stone-400">
                    {selectedNotice.referenceCode} · {selectedNotice.date}
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectNotice(null)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                    <span>{strings.notices.closeDrawer}</span>
                  </button>
                </div>

                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)] dark:text-[var(--brand-accent)] mb-2">
                  {strings.notices.categories[selectedNotice.category]}
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-50 mb-5">
                  {pickText(selectedNotice.title, language)}
                </h3>

                <div className="space-y-4 text-[15px] sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                  {pickText(selectedNotice.content, language)
                    .split('\n\n')
                    .map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                </div>

                {selectedNotice.attachment && (
                  <div className="mt-8 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shrink-0">
                        <FileText className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                          {strings.notices.attachmentLabel}
                        </p>
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                          {selectedNotice.attachment.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewAttachment({
                            attachment: selectedNotice.attachment!,
                            title: pickText(selectedNotice.title, language),
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer"
                        style={{ backgroundColor: 'var(--brand-primary)' }}
                      >
                        <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{formatAttachmentLabel(selectedNotice.attachment)}</span>
                      </button>

                      <a
                        href={selectedNotice.attachment.dataUrl}
                        download={selectedNotice.attachment.name}
                        target={
                          selectedNotice.attachment.dataUrl.startsWith('data:')
                            ? undefined
                            : '_blank'
                        }
                        rel={
                          selectedNotice.attachment.dataUrl.startsWith('data:')
                            ? undefined
                            : 'noopener noreferrer'
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{strings.notices.downloadAttachment}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-10 pt-5 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
                {pickText(data.schoolName, language)} · {pickText(data.contact.address, language)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline Notice Attachment Viewer Modal */}
      <AnimatePresence>
        {previewAttachment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-[60] bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setPreviewAttachment(null)}
            role="dialog"
            aria-modal="true"
            aria-label={previewAttachment.attachment.name}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 truncate">
                    {previewAttachment.title}
                  </p>
                  <h4 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 truncate">
                    {previewAttachment.attachment.name}
                  </h4>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={previewAttachment.attachment.dataUrl}
                    download={previewAttachment.attachment.name}
                    target={
                      previewAttachment.attachment.dataUrl.startsWith('data:')
                        ? undefined
                        : '_blank'
                    }
                    rel={
                      previewAttachment.attachment.dataUrl.startsWith('data:')
                        ? undefined
                        : 'noopener noreferrer'
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{strings.notices.downloadAttachment}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreviewAttachment(null)}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                    aria-label={strings.notices.closeDrawer}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-stone-100 dark:bg-stone-950 overflow-auto flex-1 flex items-center justify-center">
                {previewAttachment.attachment.mimeType === 'application/pdf' ||
                previewAttachment.attachment.name.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={previewAttachment.attachment.dataUrl}
                    title={previewAttachment.attachment.name}
                    className="w-full h-[68vh] rounded-lg border border-stone-200 dark:border-stone-800 bg-white"
                  />
                ) : (
                  <img
                    src={previewAttachment.attachment.dataUrl}
                    alt={previewAttachment.attachment.name}
                    className="max-h-[68vh] max-w-full w-auto object-contain rounded-lg shadow-md"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};


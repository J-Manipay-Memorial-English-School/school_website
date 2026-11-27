import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, Camera, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { ExamCategory } from '../types/school';
import { pickText } from '../utils/schoolHelpers';
import { FormattedText } from './FormattedText';
import { ProfileAvatar } from './ProfileAvatar';
import { SafeImage } from './SafeImage';

type FilterCategory = 'All' | ExamCategory;

export const ExamResultsSection: React.FC = () => {
  const { data, language, strings } = useSchoolData();
  const [filter, setFilter] = useState<FilterCategory>('All');
  const [lightboxPhotos, setLightboxPhotos] = useState<string[] | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredResults = useMemo(() => {
    const list =
      filter === 'All'
        ? data.examResults
        : data.examResults.filter((item) => item.category === filter);
    return [...list].sort((a, b) => Number(b.year) - Number(a.year));
  }, [data.examResults, filter]);

  const categories: { id: FilterCategory; label: string }[] = [
    { id: 'All', label: strings.examResults.categories.All },
    { id: 'Scholarship', label: strings.examResults.categories.Scholarship },
    { id: 'O/L', label: strings.examResults.categories['O/L'] },
    { id: 'A/L', label: strings.examResults.categories['A/L'] },
  ];

  const getCategoryLabel = (category: ExamCategory) => {
    return strings.examResults.categories[category];
  };

  const openPhotoLightbox = (photos: string[], index: number, title: string) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setLightboxTitle(title);
  };

  return (
    <section
      id="exam-results"
      className="py-14 lg:py-20 bg-[#FBF9F5] dark:bg-stone-950 min-h-[72vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
            {strings.examResults.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
            {strings.examResults.heading}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed">
            {strings.examResults.subtitle}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex justify-center mb-10">
          <div
            className="flex flex-wrap justify-center gap-2 p-1.5 rounded-xl bg-stone-200/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
            role="tablist"
            aria-label={strings.examResults.heading}
          >
            {categories.map((cat) => {
              const active = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Year-wise Exam Result Cards */}
        {filteredResults.length === 0 ? (
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-12 text-center text-sm text-stone-500 dark:text-stone-400">
            {strings.examResults.emptyState}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredResults.map((result, idx) => {
              const summaryText = pickText(result.summary, language);
              const categoryTitle = `${getCategoryLabel(result.category)} — ${result.year}`;
              const photos = (result.photos || []).filter(Boolean);

              return (
                <motion.article
                  key={result.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.22, delay: Math.min(idx * 0.025, 0.14) }}
                  className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm"
                >
                  {/* Card Header: Category + Year + Pass Percentage */}
                  <div className="p-6 sm:p-8 border-b border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/70 dark:bg-stone-900/60">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        <Award
                          className="w-4 h-4 text-[var(--brand-primary)] dark:text-[var(--brand-accent)]"
                          aria-hidden="true"
                        />
                        <span>{getCategoryLabel(result.category)}</span>
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-50">
                        {categoryTitle}
                      </h3>
                      {summaryText && (
                        <FormattedText
                          text={summaryText}
                          className="space-y-2 text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl pt-1"
                        />
                      )}
                    </div>

                    {/* Prominent Pass Percentage Stat Badge */}
                    <div
                      className="shrink-0 rounded-xl px-5 py-3.5 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 text-center sm:min-w-[148px]"
                      style={{ boxShadow: '0 2px 10px -4px rgba(0,0,0,0.06)' }}
                    >
                      <div
                        className="font-display text-2xl sm:text-3xl font-bold font-mono-num"
                        style={{ color: 'var(--brand-primary)' }}
                      >
                        <span className="dark:text-[var(--brand-accent)]">
                          {result.passPercentage}
                        </span>
                      </div>
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
                        {strings.examResults.passRateLabel}
                      </div>
                    </div>
                  </div>

                  {/* Body: Top Performers & Optional Celebration Photos */}
                  <div className="p-6 sm:p-8 space-y-7">
                    {result.topPerformers.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-4">
                          <Sparkles
                            className="w-3.5 h-3.5 text-[var(--brand-primary)] dark:text-[var(--brand-accent)]"
                            aria-hidden="true"
                          />
                          <span>{strings.examResults.topPerformersHeading}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                          {result.topPerformers.map((performer) => {
                            const performerName = pickText(performer.name, language);
                            const performerAchievement = pickText(performer.achievement, language);
                            return (
                              <div
                                key={performer.id}
                                className="flex items-center gap-3.5 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950"
                              >
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shrink-0">
                                  <ProfileAvatar
                                    photoUrl={performer.photoUrl}
                                    defaultAvatar={performer.defaultAvatar}
                                    name={performerName}
                                    iconSizeClass="w-6 h-6"
                                  />
                                </div>

                                <div className="min-w-0">
                                  <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100 truncate">
                                    {performerName}
                                  </h4>
                                  <p className="text-xs font-medium text-[var(--brand-primary)] dark:text-[var(--brand-accent)] mt-0.5 leading-snug">
                                    {performerAchievement}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {photos.length > 0 && (
                      <div className="pt-5 border-t border-stone-100 dark:border-stone-800">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-4">
                          <Camera
                            className="w-3.5 h-3.5 text-[var(--brand-primary)] dark:text-[var(--brand-accent)]"
                            aria-hidden="true"
                          />
                          <span>{strings.examResults.photosHeading}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                          {photos.map((photoUrl, photoIdx) => (
                            <button
                              key={`${result.id}-photo-${photoIdx}`}
                              type="button"
                              onClick={() => openPhotoLightbox(photos, photoIdx, categoryTitle)}
                              className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                            >
                              <SafeImage
                                src={photoUrl}
                                alt={`${categoryTitle} highlight ${photoIdx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {lightboxPhotos && lightboxPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxPhotos(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightboxTitle}
          >
            <div
              className="relative max-w-4xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightboxPhotos(null)}
                className="self-end mb-3 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                aria-label={strings.gallery.close}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full aspect-[16/10] max-h-[75vh] rounded-xl overflow-hidden bg-stone-900 border border-white/10">
                <SafeImage
                  src={lightboxPhotos[lightboxIndex]}
                  alt={`${lightboxTitle} (${lightboxIndex + 1})`}
                  className="w-full h-full object-contain"
                />

                {lightboxPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((prev) =>
                          prev === 0 ? lightboxPhotos.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-950/70 text-white hover:bg-stone-950 transition-colors cursor-pointer"
                      aria-label={strings.gallery.previous}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((prev) => (prev + 1) % lightboxPhotos.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-950/70 text-white hover:bg-stone-950 transition-colors cursor-pointer"
                      aria-label={strings.gallery.next}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="mt-4 text-center text-sm text-stone-200">
                <span>{lightboxTitle}</span>
                {lightboxPhotos.length > 1 && (
                  <span className="ml-2 font-mono-num text-xs text-stone-400">
                    ({lightboxIndex + 1} / {lightboxPhotos.length})
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { pickText } from '../utils/schoolHelpers';
import { SafeImage } from './SafeImage';

export const HomeGallerySection: React.FC = () => {
  const { data, language, strings } = useSchoolData();
  const photos = data.schoolGlimpses;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (photos.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= photos.length) {
      setCurrentIndex(photos.length - 1);
    }
  }, [photos.length, currentIndex]);

  const handlePrev = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const handleNext = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  // Gentle auto-play, pausing on hover or when lightbox is open
  useEffect(() => {
    if (photos.length <= 1 || isHovered || lightboxIndex !== null) return;
    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4800);
    return () => window.clearInterval(interval);
  }, [photos.length, isHovered, lightboxIndex]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % photos.length));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + photos.length) % photos.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, photos.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 45) {
      if (delta < 0) handleNext();
      else handlePrev();
    }
  };

  const currentPhoto = photos[currentIndex];
  const currentCaptionText = currentPhoto ? pickText(currentPhoto.caption, language) : '';
  const activeLightboxPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;
  const activeLightboxCaption = activeLightboxPhoto
    ? pickText(activeLightboxPhoto.caption, language)
    : '';
  const formattedCounter = `${String(currentIndex + 1).padStart(2, '0')} / ${String(
    photos.length
  ).padStart(2, '0')}`;

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
            {strings.homeGallery.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-2.5">
            {strings.homeGallery.heading}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed">
            {strings.homeGallery.subtitle}
          </p>
        </div>

        {photos.length === 0 || !currentPhoto ? (
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950 p-12 text-center text-sm text-stone-500 dark:text-stone-400">
            No school surrounding photographs configured yet.
          </div>
        ) : (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="max-w-5xl mx-auto"
          >
            {/* Main Editorial Spotlight Stage */}
            <div className="relative aspect-[16/9] max-h-[480px] w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-950 shadow-xl group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhoto.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setLightboxIndex(currentIndex)}
                  className="absolute inset-0 cursor-pointer"
                >
                  <SafeImage
                    src={currentPhoto.url}
                    alt={currentCaptionText || `School photograph ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Top-right Lightbox Hint */}
              <button
                type="button"
                onClick={() => setLightboxIndex(currentIndex)}
                className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-stone-950/45 hover:bg-stone-950/70 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Open full image view"
              >
                <Expand className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Floating Glassmorphic Left / Right Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-stone-950/45 hover:bg-stone-950/70 backdrop-blur-md border border-white/25 text-white shadow-lg transition-all hover:scale-105 cursor-pointer"
                    aria-label={strings.gallery.previous}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-stone-950/45 hover:bg-stone-950/70 backdrop-blur-md border border-white/25 text-white shadow-lg transition-all hover:scale-105 cursor-pointer"
                    aria-label={strings.gallery.next}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Sleek Bottom Caption Bar (only when caption exists) or Subtle Slide Counter */}
              {currentCaptionText ? (
                <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none">
                  <div className="bg-gradient-to-t from-stone-950/90 via-stone-950/65 to-transparent px-4 sm:px-6 pt-12 pb-4 sm:pb-5 flex items-end justify-between gap-4">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={`${currentPhoto.id}-${language}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm sm:text-base font-medium text-white leading-snug max-w-2xl"
                      >
                        {currentCaptionText}
                      </motion.p>
                    </AnimatePresence>

                    <span className="font-mono-num text-xs sm:text-sm font-semibold tracking-wider text-stone-200 bg-stone-950/55 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-md shrink-0">
                      {formattedCounter}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-3.5 right-3.5 z-10 pointer-events-none">
                  <span className="font-mono-num text-xs sm:text-sm font-semibold tracking-wider text-stone-100 bg-stone-950/55 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-md">
                    {formattedCounter}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Filmstrip Thumbnail Bar */}
            {photos.length > 1 && (
              <div
                className="mt-5 flex items-center justify-center gap-2.5 sm:gap-3.5 overflow-x-auto py-2 px-2"
                role="tablist"
                aria-label="School surroundings filmstrip selector"
              >
                {photos.map((photo, idx) => {
                  const active = idx === currentIndex;
                  const captionText = pickText(photo.caption, language);
                  const slideLabel = captionText || `School photograph ${idx + 1}`;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-label={`Slide ${idx + 1}: ${slideLabel}`}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative w-20 sm:w-28 aspect-[16/10] rounded-lg overflow-hidden shrink-0 transition-all duration-200 cursor-pointer focus-visible:outline-none ${
                        active
                          ? 'opacity-100 scale-105 ring-2 ring-[var(--brand-primary)] dark:ring-[var(--brand-accent)] ring-offset-2 ring-offset-white dark:ring-offset-stone-900 shadow-md'
                          : 'opacity-50 hover:opacity-90 border border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <SafeImage
                        src={photo.url}
                        alt={slideLabel}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxPhoto && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-50 bg-stone-950/92 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
            onClick={() => setLightboxIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeLightboxCaption || 'School photograph'}
          >
            <div
              className="flex items-center justify-between text-white max-w-6xl w-full mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-xs sm:text-sm font-mono-num text-stone-300">
                {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                {String(photos.length).padStart(2, '0')}
                {activeLightboxPhoto.date ? ` · ${activeLightboxPhoto.date}` : ''}
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label={strings.gallery.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="relative flex-1 flex items-center justify-center max-w-6xl w-full mx-auto my-4"
              onClick={(e) => e.stopPropagation()}
            >
              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)
                  }
                  className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-stone-900/75 hover:bg-stone-900 text-white border border-white/20 transition-colors cursor-pointer"
                  aria-label={strings.gallery.previous}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <motion.div
                key={activeLightboxPhoto.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="max-h-[72vh] w-full flex items-center justify-center"
              >
                <SafeImage
                  src={activeLightboxPhoto.url}
                  alt={activeLightboxCaption || `School photograph ${lightboxIndex + 1}`}
                  className="max-h-[72vh] max-w-full w-auto object-contain rounded-xl shadow-2xl"
                />
              </motion.div>

              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex((lightboxIndex + 1) % photos.length)}
                  className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-stone-900/75 hover:bg-stone-900 text-white border border-white/20 transition-colors cursor-pointer"
                  aria-label={strings.gallery.next}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            <div
              className="max-w-3xl mx-auto text-center text-white min-h-[1.5rem]"
              onClick={(e) => e.stopPropagation()}
            >
              {activeLightboxCaption && (
                <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
                  {activeLightboxCaption}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

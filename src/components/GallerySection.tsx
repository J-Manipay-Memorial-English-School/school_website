import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Expand, Images, X } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { GalleryCategory } from '../types/school';
import { pickText } from '../utils/schoolHelpers';
import { SafeImage } from './SafeImage';

type GalleryFilter = 'All' | GalleryCategory;

export const GallerySection: React.FC = () => {
  const { data, language, strings } = useSchoolData();
  const [filter, setFilter] = useState<GalleryFilter>('All');
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [albumPhotoIdx, setAlbumPhotoIdx] = useState(0);

  const filteredAlbums = useMemo(() => {
    if (filter === 'All') return data.gallery;
    return data.gallery.filter((p) => p.category === filter);
  }, [data.gallery, filter]);

  const categories: GalleryFilter[] = ['All', 'Campus', 'Academics', 'Sports', 'Cultural'];

  const activeAlbum = useMemo(
    () => filteredAlbums.find((p) => p.id === activeAlbumId) ?? null,
    [filteredAlbums, activeAlbumId]
  );

  const albumPhotos = useMemo(() => {
    if (!activeAlbum) return [];
    return activeAlbum.photos && activeAlbum.photos.length > 0
      ? activeAlbum.photos
      : [activeAlbum.url];
  }, [activeAlbum]);

  useEffect(() => {
    if (!activeAlbum || albumPhotos.length === 0) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveAlbumId(null);
      } else if (e.key === 'ArrowRight') {
        setAlbumPhotoIdx((prev) => (prev + 1) % albumPhotos.length);
      } else if (e.key === 'ArrowLeft') {
        setAlbumPhotoIdx((prev) => (prev - 1 + albumPhotos.length) % albumPhotos.length);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeAlbum, albumPhotos.length]);

  const openAlbum = (albumId: string, coverUrl: string, photos?: string[]) => {
    const list = photos && photos.length > 0 ? photos : [coverUrl];
    const startIndex = list.indexOf(coverUrl);
    setActiveAlbumId(albumId);
    setAlbumPhotoIdx(startIndex >= 0 ? startIndex : 0);
  };

  const currentPhotoSrc = albumPhotos[albumPhotoIdx] || activeAlbum?.url || '';

  return (
    <section
      id="gallery"
      className="py-14 lg:py-20 bg-[#FBF9F5] dark:bg-stone-950 min-h-[72vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
            {strings.gallery.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
            {strings.gallery.heading}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed">
            {strings.gallery.subtitle}
          </p>
        </div>

        {/* Centered Sub-Navigation Filter Row */}
        <div className="flex justify-center mb-10">
          <div
            className="flex flex-wrap justify-center gap-2 p-1.5 rounded-xl bg-stone-200/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
            role="tablist"
            aria-label={strings.gallery.heading}
          >
            {categories.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setFilter(cat);
                    setActiveAlbumId(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {strings.gallery.categories[cat]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album, idx) => {
            const captionText = pickText(album.caption, language);
            const totalCount =
              album.photos && album.photos.length > 0 ? album.photos.length : 1;

            return (
              <motion.button
                key={album.id}
                type="button"
                layout
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                onClick={() => openAlbum(album.id, album.url, album.photos)}
                className={`group text-left rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] ${
                  idx === 0 && filteredAlbums.length >= 4 ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div
                  className={`relative overflow-hidden bg-stone-200 dark:bg-stone-800 ${
                    idx === 0 && filteredAlbums.length >= 4 ? 'aspect-[16/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <SafeImage
                    src={album.url}
                    alt={captionText}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {totalCount > 1 && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-stone-950/75 text-white backdrop-blur-sm border border-white/15">
                      <Images className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="font-mono-num">
                        {totalCount} {strings.gallery.photosBadge}
                      </span>
                    </span>
                  )}
                  <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/25 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-full bg-white/90 text-stone-900 shadow-lg">
                      <Expand className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1.5">
                    <span className="font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-accent)]">
                      {strings.gallery.categories[album.category]}
                    </span>
                    <span aria-hidden="true">·</span>
                    <time className="font-mono-num" dateTime={album.date}>
                      {album.date}
                    </time>
                    {totalCount > 1 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-num">
                          {totalCount} {strings.gallery.photosBadge}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-medium text-stone-800 dark:text-stone-100 leading-snug line-clamp-2">
                    {captionText}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Event Album Lightbox Modal */}
      <AnimatePresence>
        {activeAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-50 bg-stone-950/92 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
            onClick={() => setActiveAlbumId(null)}
            role="dialog"
            aria-modal="true"
            aria-label={pickText(activeAlbum.caption, language)}
          >
            <div
              className="flex items-center justify-between text-white max-w-6xl w-full mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-xs sm:text-sm font-mono-num text-stone-300">
                {String(albumPhotoIdx + 1).padStart(2, '0')} /{' '}
                {String(albumPhotos.length).padStart(2, '0')} ·{' '}
                {strings.gallery.categories[activeAlbum.category]} · {activeAlbum.date}
              </div>
              <button
                type="button"
                onClick={() => setActiveAlbumId(null)}
                className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label={strings.gallery.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="relative flex-1 flex items-center justify-center max-w-6xl w-full mx-auto my-3"
              onClick={(e) => e.stopPropagation()}
            >
              {albumPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setAlbumPhotoIdx(
                      (albumPhotoIdx - 1 + albumPhotos.length) % albumPhotos.length
                    )
                  }
                  className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-stone-900/75 hover:bg-stone-900 text-white border border-white/20 transition-colors cursor-pointer"
                  aria-label={strings.gallery.previous}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <motion.div
                key={`${activeAlbum.id}-${albumPhotoIdx}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="max-h-[64vh] w-full flex items-center justify-center"
              >
                <SafeImage
                  src={currentPhotoSrc}
                  alt={pickText(activeAlbum.caption, language)}
                  className="max-h-[64vh] max-w-full w-auto object-contain rounded-xl shadow-2xl"
                />
              </motion.div>

              {albumPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setAlbumPhotoIdx((albumPhotoIdx + 1) % albumPhotos.length)
                  }
                  className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-stone-900/75 hover:bg-stone-900 text-white border border-white/20 transition-colors cursor-pointer"
                  aria-label={strings.gallery.next}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            <div
              className="max-w-4xl w-full mx-auto text-center text-white space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
                {pickText(activeAlbum.caption, language)}
              </p>

              {albumPhotos.length > 1 && (
                <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
                  {albumPhotos.map((src, idx) => {
                    const active = idx === albumPhotoIdx;
                    return (
                      <button
                        key={`${src.slice(0, 24)}-${idx}`}
                        type="button"
                        onClick={() => setAlbumPhotoIdx(idx)}
                        aria-label={`Photo ${idx + 1} of ${albumPhotos.length}`}
                        className={`w-16 h-11 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          active
                            ? 'border-[var(--brand-accent)] scale-105 opacity-100'
                            : 'border-white/20 opacity-55 hover:opacity-90'
                        }`}
                      >
                        <SafeImage
                          src={src}
                          alt={`${pickText(activeAlbum.caption, language)} (${idx + 1})`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};


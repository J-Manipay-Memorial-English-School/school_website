import React, { useRef, useState } from 'react';
import { Check, Edit2, ImagePlus, Plus, Trash2, Upload, X } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  AchievementCategory,
  AchievementItem,
  GalleryCategory,
  GalleryPhoto,
} from '../../types/school';
import {
  cleanBilingual,
  hasAnyText,
  pickText,
  readImageFileAsDataUrl,
} from '../../utils/schoolHelpers';
import { SafeImage } from '../SafeImage';

const MAX_ALBUM_PHOTOS = 10;

export const AdminAchievementsGalleryPanel: React.FC = () => {
  const {
    data,
    upsertAchievement,
    deleteAchievement,
    upsertGalleryPhoto,
    deleteGalleryPhoto,
    showToast,
  } = useSchoolData();

  const [editingAch, setEditingAch] = useState<AchievementItem | null>(null);
  const [isCreatingAch, setIsCreatingAch] = useState(false);

  const [editingAlbum, setEditingAlbum] = useState<GalleryPhoto | null>(null);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);

  const achPhotoInputRef = useRef<HTMLInputElement>(null);
  const albumMultiInputRef = useRef<HTMLInputElement>(null);

  const startCreateAchievement = () => {
    setIsCreatingAch(true);
    setEditingAch({
      id: `ach-${Date.now()}`,
      title: { en: '', ta: '' },
      recipient: { en: '', ta: '' },
      description: { en: '', ta: '' },
      category: 'Academic',
      year: String(new Date().getFullYear()),
      distinction: { en: 'Provincial 1st Place', ta: 'மாகாண முதலிடம்' },
      photoUrl: '',
    });
  };

  const handleAchPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editingAch) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file, { maxDimension: 1200, quality: 0.84 });
      setEditingAch({ ...editingAch, photoUrl: dataUrl });
      showToast('Achievement photo loaded.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to read image.', 'error');
    }
  };

  const handleSaveAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch) return;

    if (!hasAnyText(editingAch.title)) {
      showToast('Please enter an achievement title in English or Tamil.', 'error');
      return;
    }
    if (!hasAnyText(editingAch.recipient)) {
      showToast('Please enter the recipient or team name in English or Tamil.', 'error');
      return;
    }

    const cleanedDistinction = cleanBilingual(editingAch.distinction);
    await upsertAchievement({
      ...editingAch,
      title: cleanBilingual(editingAch.title),
      recipient: cleanBilingual(editingAch.recipient),
      description: cleanBilingual(editingAch.description),
      distinction: hasAnyText(cleanedDistinction)
        ? cleanedDistinction
        : { en: 'Merit Award', ta: 'சிறப்பு விருது' },
      photoUrl: editingAch.photoUrl?.trim() || undefined,
    });
    setEditingAch(null);
    setIsCreatingAch(false);
  };

  const startCreateAlbum = () => {
    setIsCreatingAlbum(true);
    setEditingAlbum({
      id: `gal-${Date.now()}`,
      url: '',
      photos: [],
      caption: { en: '', ta: '' },
      category: 'Campus',
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const handleMultiPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0 || !editingAlbum) return;

    const currentPhotos =
      editingAlbum.photos && editingAlbum.photos.length > 0
        ? editingAlbum.photos
        : editingAlbum.url
        ? [editingAlbum.url]
        : [];

    const remainingSlots = MAX_ALBUM_PHOTOS - currentPhotos.length;
    if (remainingSlots <= 0) {
      showToast(`Maximum ${MAX_ALBUM_PHOTOS} photos allowed per event album.`, 'error');
      return;
    }

    const acceptedFiles = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      showToast(
        `Only ${remainingSlots} more photo(s) can be added (max ${MAX_ALBUM_PHOTOS} per event).`,
        'info'
      );
    }

    try {
      const uploadedUrls = await Promise.all(
        acceptedFiles.map((file) =>
          readImageFileAsDataUrl(file, { maxDimension: 1200, quality: 0.8 })
        )
      );
      const nextPhotos = [...currentPhotos, ...uploadedUrls];
      const nextCover = editingAlbum.url && nextPhotos.includes(editingAlbum.url)
        ? editingAlbum.url
        : nextPhotos[0];

      setEditingAlbum({
        ...editingAlbum,
        photos: nextPhotos,
        url: nextCover,
      });
      showToast(`Added ${uploadedUrls.length} photo(s) to event album.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to process selected images.', 'error');
    }
  };

  const handleRemoveAlbumPhoto = (photoIndex: number) => {
    if (!editingAlbum) return;
    const currentPhotos =
      editingAlbum.photos && editingAlbum.photos.length > 0
        ? editingAlbum.photos
        : editingAlbum.url
        ? [editingAlbum.url]
        : [];
    const removedUrl = currentPhotos[photoIndex];
    const nextPhotos = currentPhotos.filter((_, idx) => idx !== photoIndex);
    const nextCover =
      editingAlbum.url === removedUrl ? nextPhotos[0] || '' : editingAlbum.url;
    setEditingAlbum({
      ...editingAlbum,
      photos: nextPhotos,
      url: nextCover,
    });
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum) return;

    const currentPhotos =
      editingAlbum.photos && editingAlbum.photos.length > 0
        ? editingAlbum.photos
        : editingAlbum.url
        ? [editingAlbum.url]
        : [];

    if (currentPhotos.length === 0) {
      showToast('Please upload at least 1 photo for this event album.', 'error');
      return;
    }
    if (!hasAnyText(editingAlbum.caption)) {
      showToast('Please enter an event title or caption in English or Tamil.', 'error');
      return;
    }

    const coverUrl =
      editingAlbum.url && currentPhotos.includes(editingAlbum.url)
        ? editingAlbum.url
        : currentPhotos[0];

    await upsertGalleryPhoto({
      ...editingAlbum,
      url: coverUrl,
      photos: currentPhotos,
      caption: cleanBilingual(editingAlbum.caption),
    });
    setEditingAlbum(null);
    setIsCreatingAlbum(false);
  };

  const albumPhotosList = editingAlbum
    ? editingAlbum.photos && editingAlbum.photos.length > 0
      ? editingAlbum.photos
      : editingAlbum.url
      ? [editingAlbum.url]
      : []
    : [];

  return (
    <div className="space-y-10">
      {/* Achievements Management */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
              Achievements & Honours
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Manage academic, sports, and co-curricular victories with optional achievement photos. Enter English, Tamil, or both.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreateAchievement}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white shrink-0 cursor-pointer hover:opacity-90"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add Achievement</span>
          </button>
        </div>

        {editingAch && (
          <form
            onSubmit={handleSaveAchievement}
            className="rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {isCreatingAch ? 'New Achievement Card' : 'Edit Achievement Card'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingAch(null);
                  setIsCreatingAch(false);
                }}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                aria-label="Close achievement form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Optional Achievement Photo Upload */}
              <div className="lg:col-span-3 space-y-2.5">
                <span className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
                  Achievement Photo (Optional)
                </span>
                <div className="aspect-[16/10] rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  {editingAch.photoUrl ? (
                    <SafeImage
                      src={editingAch.photoUrl}
                      alt={pickText(editingAch.title, 'en') || 'Achievement preview'}
                    />
                  ) : (
                    <span className="text-[11px] text-stone-400 px-3 text-center">
                      Optional — badge layout shown if empty
                    </span>
                  )}
                </div>
                <input
                  ref={achPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => void handleAchPhotoUpload(e)}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => achPhotoInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Upload Photo</span>
                  </button>
                  {editingAch.photoUrl && (
                    <button
                      type="button"
                      onClick={() => setEditingAch({ ...editingAch, photoUrl: '' })}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 border border-stone-200 dark:border-stone-700 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-9 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                      Category
                    </label>
                    <select
                      value={editingAch.category}
                      onChange={(e) =>
                        setEditingAch({
                          ...editingAch,
                          category: e.target.value as AchievementCategory,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Co-Curricular">Co-Curricular</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      required
                      value={editingAch.year}
                      onChange={(e) => setEditingAch({ ...editingAch, year: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                      Distinction (EN)
                    </label>
                    <input
                      type="text"
                      value={editingAch.distinction.en}
                      onChange={(e) =>
                        setEditingAch({
                          ...editingAch,
                          distinction: { ...editingAch.distinction, en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                      Distinction (தமிழ்)
                    </label>
                    <input
                      type="text"
                      value={editingAch.distinction.ta}
                      onChange={(e) =>
                        setEditingAch({
                          ...editingAch,
                          distinction: { ...editingAch.distinction, ta: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                      Title (English — optional if Tamil entered)
                    </label>
                    <input
                      type="text"
                      value={editingAch.title.en}
                      onChange={(e) =>
                        setEditingAch({
                          ...editingAch,
                          title: { ...editingAch.title, en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                      Title (தமிழ் — optional if English entered)
                    </label>
                    <input
                      type="text"
                      value={editingAch.title.ta}
                      onChange={(e) =>
                        setEditingAch({
                          ...editingAch,
                          title: { ...editingAch.title, ta: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                      Recipient / Team (English — optional if Tamil entered)
                    </label>
                    <input
                      type="text"
                      value={editingAch.recipient.en}
                      onChange={(e) =>
                        setEditingAch({
                          ...editingAch,
                          recipient: { ...editingAch.recipient, en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                      Recipient / Team (தமிழ் — optional if English entered)
                    </label>
                    <input
                      type="text"
                      value={editingAch.recipient.ta}
                      onChange={(e) =>
                        setEditingAch({
                          ...editingAch,
                          recipient: { ...editingAch.recipient, ta: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                      Description (English, Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={editingAch.description.en}
                      onChange={(e) =>
                        setEditingAch({
                          ...editingAch,
                          description: { ...editingAch.description, en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                      Description (தமிழ், Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={editingAch.description.ta}
                      onChange={(e) =>
                        setEditingAch({
                          ...editingAch,
                          description: { ...editingAch.description, ta: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAch(null);
                      setIsCreatingAch(false);
                    }}
                    className="px-4 py-2 rounded-lg text-sm border border-stone-300 dark:border-stone-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    {isCreatingAch ? 'Save Achievement' : 'Update Achievement'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.achievements.map((ach) => (
            <div
              key={ach.id}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                {ach.photoUrl && (
                  <div className="w-16 h-12 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 shrink-0 bg-stone-100 dark:bg-stone-800">
                    <SafeImage src={ach.photoUrl} alt={pickText(ach.title, 'en')} />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                    {ach.category} · <span className="font-mono-num">{ach.year}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                    {pickText(ach.title, 'en')}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    {pickText(ach.recipient, 'en')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingAch(false);
                    setEditingAch({ ...ach, photoUrl: ach.photoUrl || '' });
                  }}
                  className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  title="Edit achievement"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => void deleteAchievement(ach.id)}
                  className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                  title="Delete achievement"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Event Gallery Management (Multi-Photo Upload up to 10 + Cover Thumbnail Selector) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
              Event Gallery Manager
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Upload up to 10 photos per school event from your computer or phone and pick the Cover Thumbnail.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreateAlbum}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white shrink-0 cursor-pointer hover:opacity-90"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <ImagePlus className="w-4 h-4" aria-hidden="true" />
            <span>Add Event Album</span>
          </button>
        </div>

        {editingAlbum && (
          <form
            onSubmit={handleSaveAlbum}
            className="rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 space-y-5 shadow-sm"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {isCreatingAlbum ? 'New Event Photo Album' : 'Edit Event Photo Album'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingAlbum(null);
                  setIsCreatingAlbum(false);
                }}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                aria-label="Close album form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Multi-Photo Upload + Cover Thumbnail Selector */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="block text-xs font-semibold text-stone-700 dark:text-stone-200">
                    Event Photographs ({albumPhotosList.length} / {MAX_ALBUM_PHOTOS})
                  </span>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Upload multiple photos at once. Click any photo below to set it as the Cover Thumbnail.
                  </p>
                </div>
                <input
                  ref={albumMultiInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => void handleMultiPhotoUpload(e)}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={albumPhotosList.length >= MAX_ALBUM_PHOTOS}
                  onClick={() => albumMultiInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Upload Photos (Up to 10)</span>
                </button>
              </div>

              {albumPhotosList.length === 0 ? (
                <button
                  type="button"
                  onClick={() => albumMultiInputRef.current?.click()}
                  className="w-full py-10 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-center text-xs text-stone-500 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-600 transition-colors cursor-pointer"
                >
                  Tap or click to choose up to 10 school event photos from your phone or computer
                </button>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {albumPhotosList.map((photoSrc, idx) => {
                    const isCover = editingAlbum.url === photoSrc || (!editingAlbum.url && idx === 0);
                    return (
                      <div
                        key={`${idx}-${photoSrc.slice(0, 24)}`}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden border transition-all group ${
                          isCover
                            ? 'ring-2 ring-[var(--brand-primary)] dark:ring-[var(--brand-accent)] ring-offset-2 ring-offset-white dark:ring-offset-stone-900 border-transparent'
                            : 'border-stone-200 dark:border-stone-700 opacity-85 hover:opacity-100'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setEditingAlbum({ ...editingAlbum, url: photoSrc })}
                          className="w-full h-full block cursor-pointer"
                          title="Set as Cover Thumbnail"
                        >
                          <SafeImage
                            src={photoSrc}
                            alt={`Event photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>

                        {isCover && (
                          <span
                            className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-white shadow"
                            style={{ backgroundColor: 'var(--brand-primary)' }}
                          >
                            <Check className="w-2.5 h-2.5" aria-hidden="true" />
                            <span>Cover Thumbnail</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveAlbumPhoto(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-stone-950/75 text-white hover:bg-red-600 transition-colors cursor-pointer"
                          aria-label={`Remove photo ${idx + 1}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Category
                </label>
                <select
                  value={editingAlbum.category}
                  onChange={(e) =>
                    setEditingAlbum({
                      ...editingAlbum,
                      category: e.target.value as GalleryCategory,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                >
                  <option value="Campus">School Grounds</option>
                  <option value="Academics">Academics</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={editingAlbum.date}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Event Title / Caption (English — optional if Tamil entered)
                </label>
                <input
                  type="text"
                  value={editingAlbum.caption.en}
                  onChange={(e) =>
                    setEditingAlbum({
                      ...editingAlbum,
                      caption: { ...editingAlbum.caption, en: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Event Title / Caption (தமிழ் — optional if English entered)
                </label>
                <input
                  type="text"
                  value={editingAlbum.caption.ta}
                  onChange={(e) =>
                    setEditingAlbum({
                      ...editingAlbum,
                      caption: { ...editingAlbum.caption, ta: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditingAlbum(null);
                  setIsCreatingAlbum(false);
                }}
                className="px-4 py-2 rounded-lg text-sm border border-stone-300 dark:border-stone-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {isCreatingAlbum ? 'Save Event Album' : 'Update Event Album'}
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.gallery.map((photo) => {
            const albumCount =
              photo.photos && photo.photos.length > 0 ? photo.photos.length : 1;
            const categoryLabel =
              photo.category === 'Campus' ? 'School Grounds' : photo.category;
            return (
              <div
                key={photo.id}
                className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-800">
                  <SafeImage src={photo.url} alt={pickText(photo.caption, 'en')} />
                  {albumCount > 1 && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-stone-950/75 text-white text-[11px] font-mono-num font-semibold">
                      {albumCount} photos
                    </span>
                  )}
                </div>
                <div className="p-3.5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      {categoryLabel} · <span className="font-mono-num">{photo.date}</span>
                    </div>
                    <p className="text-xs font-medium text-stone-800 dark:text-stone-100 line-clamp-2 mt-0.5">
                      {pickText(photo.caption, 'en')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingAlbum(false);
                        setEditingAlbum({
                          ...photo,
                          photos:
                            photo.photos && photo.photos.length > 0
                              ? [...photo.photos]
                              : [photo.url],
                        });
                      }}
                      className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                      title="Edit event album"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteGalleryPhoto(photo.id)}
                      className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                      title="Delete event album"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

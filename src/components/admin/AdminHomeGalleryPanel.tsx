import React, { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Edit2, ImagePlus, Trash2, Upload, X } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { SchoolGlimpse } from '../../types/school';
import {
  cleanBilingual,
  pickText,
  readImageFileAsDataUrl,
} from '../../utils/schoolHelpers';
import { SafeImage } from '../SafeImage';

export const AdminHomeGalleryPanel: React.FC = () => {
  const {
    data,
    upsertSchoolGlimpse,
    deleteSchoolGlimpse,
    reorderSchoolGlimpse,
    showToast,
  } = useSchoolData();
  const [editingPhoto, setEditingPhoto] = useState<SchoolGlimpse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCreate = () => {
    setIsCreating(true);
    setEditingPhoto({
      id: `glimpse-${Date.now()}`,
      url: '',
      caption: { en: '', ta: '' },
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editingPhoto) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file, { maxDimension: 1500, quality: 0.84 });
      setEditingPhoto({ ...editingPhoto, url: dataUrl });
      showToast('School photograph loaded.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to read image file.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    if (!editingPhoto.url.trim()) {
      showToast('Please upload a school photograph first.', 'error');
      return;
    }

    await upsertSchoolGlimpse({
      ...editingPhoto,
      url: editingPhoto.url.trim(),
      caption: cleanBilingual(editingPhoto.caption),
      date: editingPhoto.date?.trim() || undefined,
    });
    setEditingPhoto(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
            School Glimpses
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Manage school buildings, pathways, and surroundings shown in the Home page Editorial Filmstrip Gallery (separate from Event Gallery). Captions are completely optional.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white shrink-0 cursor-pointer hover:opacity-90"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          <ImagePlus className="w-4 h-4" aria-hidden="true" />
          <span>Add School Photo</span>
        </button>
      </div>

      {editingPhoto && (
        <form
          onSubmit={handleSave}
          className="rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              {isCreating ? 'Add School Surrounding Slide' : 'Edit School Glimpse Slide'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingPhoto(null);
                setIsCreating(false);
              }}
              className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-4 space-y-2.5">
              <span className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
                School Photo Preview
              </span>
              <div className="aspect-[16/10] rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                {editingPhoto.url ? (
                  <SafeImage src={editingPhoto.url} alt="School glimpse preview" />
                ) : (
                  <span className="text-xs text-stone-400 px-4 text-center">
                    No photo selected yet
                  </span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => void handlePhotoUpload(e)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Upload Image / Choose File</span>
              </button>
            </div>

            <div className="lg:col-span-8 space-y-3.5">
              <div className="sm:max-w-xs">
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Date (Optional)
                </label>
                <input
                  type="date"
                  value={editingPhoto.date || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Caption (English — Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={editingPhoto.caption.en}
                    onChange={(e) =>
                      setEditingPhoto({
                        ...editingPhoto,
                        caption: { ...editingPhoto.caption, en: e.target.value },
                      })
                    }
                    placeholder="Optional caption in English (leave blank for clean photo)"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Caption (தமிழ் — Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={editingPhoto.caption.ta}
                    onChange={(e) =>
                      setEditingPhoto({
                        ...editingPhoto,
                        caption: { ...editingPhoto.caption, ta: e.target.value },
                      })
                    }
                    placeholder="விருப்பத்திற்கேற்ப தமிழ் விளக்கம்..."
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPhoto(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 rounded-lg text-sm border border-stone-300 dark:border-stone-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  {isCreating ? 'Add Slide' : 'Save Slide'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {data.schoolGlimpses.length === 0 ? (
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-10 text-center text-sm text-stone-500 dark:text-stone-400">
          No school glimpses configured yet. Click "Add School Photo" to add one.
        </div>
      ) : (
        <div className="space-y-3">
          {data.schoolGlimpses.map((photo, index) => (
            <div
              key={photo.id}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono-num text-xs font-semibold text-stone-400 w-6 shrink-0 text-center">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="w-28 aspect-[16/10] rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0">
                  <SafeImage
                    src={photo.url}
                    alt={pickText(photo.caption, 'en') || `School photo ${index + 1}`}
                  />
                </div>
                <div className="min-w-0">
                  {photo.date && (
                    <div className="text-xs font-mono-num text-stone-500 dark:text-stone-400 mb-0.5">
                      {photo.date}
                    </div>
                  )}
                  <h4 className="font-medium text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                    {pickText(photo.caption, 'en') || (
                      <span className="italic text-stone-400 font-normal">
                        No caption (clean unobstructed display)
                      </span>
                    )}
                  </h4>
                  {photo.caption.ta && photo.caption.en && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                      {photo.caption.ta}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => void reorderSchoolGlimpse(photo.id, 'up')}
                  className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                  title="Move earlier"
                  aria-label="Move slide up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === data.schoolGlimpses.length - 1}
                  onClick={() => void reorderSchoolGlimpse(photo.id, 'down')}
                  className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                  title="Move later"
                  aria-label="Move slide down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPhoto(photo);
                  }}
                  className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  title="Edit slide"
                  aria-label="Edit slide"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => void deleteSchoolGlimpse(photo.id)}
                  className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                  title="Delete slide"
                  aria-label="Delete slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

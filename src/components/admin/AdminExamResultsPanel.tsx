import React, { useRef, useState } from 'react';
import {
  Award,
  Edit2,
  ImagePlus,
  Plus,
  Trash2,
  Upload,
  UserRound,
  X,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { ExamCategory, ExamResultItem, ExamTopPerformer } from '../../types/school';
import {
  cleanBilingual,
  hasAnyText,
  pickText,
  readImageFileAsDataUrl,
} from '../../utils/schoolHelpers';
import { SafeImage } from '../SafeImage';

export const AdminExamResultsPanel: React.FC = () => {
  const { data, upsertExamResult, deleteExamResult, showToast } = useSchoolData();
  const [editingResult, setEditingResult] = useState<ExamResultItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activePerformerId, setActivePerformerId] = useState<string | null>(null);
  const performerPhotoInputRef = useRef<HTMLInputElement>(null);
  const celebrationPhotosInputRef = useRef<HTMLInputElement>(null);

  const startCreate = () => {
    setIsCreating(true);
    setEditingResult({
      id: `exr-${Date.now()}`,
      category: 'A/L',
      year: String(new Date().getFullYear()),
      passPercentage: '',
      summary: { en: '', ta: '' },
      topPerformers: [],
      photos: [],
    });
  };

  const addTopPerformerRow = () => {
    if (!editingResult) return;
    const newRow: ExamTopPerformer = {
      id: `tp-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      name: { en: '', ta: '' },
      achievement: { en: '', ta: '' },
      photoUrl: '',
    };
    setEditingResult({
      ...editingResult,
      topPerformers: [...editingResult.topPerformers, newRow],
    });
  };

  const updatePerformer = (id: string, patch: Partial<ExamTopPerformer>) => {
    if (!editingResult) return;
    setEditingResult({
      ...editingResult,
      topPerformers: editingResult.topPerformers.map((tp) =>
        tp.id === id ? { ...tp, ...patch } : tp
      ),
    });
  };

  const removePerformer = (id: string) => {
    if (!editingResult) return;
    setEditingResult({
      ...editingResult,
      topPerformers: editingResult.topPerformers.filter((tp) => tp.id !== id),
    });
  };

  const handlePerformerPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editingResult || !activePerformerId) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file, { maxDimension: 700, quality: 0.85 });
      updatePerformer(activePerformerId, { photoUrl: dataUrl });
      showToast('Student portrait uploaded.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to read image file.', 'error');
    } finally {
      setActivePerformerId(null);
    }
  };

  const handleCelebrationPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    e.target.value = '';
    if (files.length === 0 || !editingResult) return;
    try {
      const uploadedUrls = await Promise.all(
        files.map((file) =>
          readImageFileAsDataUrl(file, { maxDimension: 1400, quality: 0.82 })
        )
      );
      setEditingResult({
        ...editingResult,
        photos: [...(editingResult.photos || []), ...uploadedUrls],
      });
      showToast(`${uploadedUrls.length} celebration photo(s) uploaded.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to read image files.', 'error');
    }
  };

  const removeCelebrationPhoto = (idx: number) => {
    if (!editingResult) return;
    setEditingResult({
      ...editingResult,
      photos: (editingResult.photos || []).filter((_, i) => i !== idx),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResult) return;

    if (!editingResult.year.trim() || !editingResult.passPercentage.trim()) {
      showToast('Please enter the Examination Year and Pass Percentage.', 'error');
      return;
    }

    // Validate any added performer rows (allow single-language EN or TA)
    const invalidPerformer = editingResult.topPerformers.find(
      (tp) => !hasAnyText(tp.name) || !hasAnyText(tp.achievement)
    );
    if (invalidPerformer) {
      showToast(
        'Each added Top Performer requires a Name and Distinction/Score in English or Tamil.',
        'error'
      );
      return;
    }

    const cleanedSummary = cleanBilingual(editingResult.summary);
    await upsertExamResult({
      ...editingResult,
      year: editingResult.year.trim(),
      passPercentage: editingResult.passPercentage.trim(),
      summary: hasAnyText(cleanedSummary) ? cleanedSummary : undefined,
      topPerformers: editingResult.topPerformers.map((tp) => ({
        ...tp,
        name: cleanBilingual(tp.name),
        achievement: cleanBilingual(tp.achievement),
        photoUrl: tp.photoUrl?.trim() || '',
      })),
      photos: (editingResult.photos || []).filter(Boolean),
    });

    setEditingResult(null);
    setIsCreating(false);
  };

  const sortedResults = [...data.examResults].sort(
    (a, b) => Number(b.year) - Number(a.year)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Exam Results Manager
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Publish year-wise Grade 5 Scholarship, G.C.E. O/L, and G.C.E. A/L pass percentages, top performers, and celebration photos. Single-language entries work cleanly.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white shrink-0 cursor-pointer hover:opacity-90"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Exam Result</span>
        </button>
      </div>

      {/* Hidden shared input for student portraits */}
      <input
        ref={performerPhotoInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => void handlePerformerPhotoUpload(e)}
        className="hidden"
      />

      {editingResult && (
        <form
          onSubmit={handleSave}
          className="rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 space-y-6 shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              {isCreating ? 'Add Examination Result Record' : 'Edit Examination Result Record'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingResult(null);
                setIsCreating(false);
              }}
              className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Exam Type *
              </label>
              <select
                value={editingResult.category}
                onChange={(e) =>
                  setEditingResult({
                    ...editingResult,
                    category: e.target.value as ExamCategory,
                  })
                }
                className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
              >
                <option value="Scholarship">Grade 5 Scholarship (புலமைப்பரிசில்)</option>
                <option value="O/L">G.C.E. O/L (க.பொ.த சாதாரண தரம்)</option>
                <option value="A/L">G.C.E. A/L (க.பொ.த உயர்தரம்)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Examination Year *
              </label>
              <input
                type="text"
                required
                value={editingResult.year}
                onChange={(e) =>
                  setEditingResult({ ...editingResult, year: e.target.value })
                }
                placeholder="e.g., 2025"
                className="w-full px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Pass Percentage *
              </label>
              <input
                type="text"
                required
                value={editingResult.passPercentage}
                onChange={(e) =>
                  setEditingResult({ ...editingResult, passPercentage: e.target.value })
                }
                placeholder="e.g., 94.5%"
                className="w-full px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Summary / Key Highlights (English — Optional)
              </label>
              <textarea
                rows={2}
                value={editingResult.summary?.en || ''}
                onChange={(e) =>
                  setEditingResult({
                    ...editingResult,
                    summary: { en: e.target.value, ta: editingResult.summary?.ta || '' },
                  })
                }
                placeholder="Optional overview of cohort results..."
                className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Summary / Key Highlights (தமிழ் — Optional)
              </label>
              <textarea
                rows={2}
                value={editingResult.summary?.ta || ''}
                onChange={(e) =>
                  setEditingResult({
                    ...editingResult,
                    summary: { en: editingResult.summary?.en || '', ta: e.target.value },
                  })
                }
                placeholder="விருப்பத்திற்கேற்ப சுருக்கக் குறிப்பு..."
                className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
              />
            </div>
          </div>

          {/* Top Performers Section */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Top Performers / High Achievers
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Add students with their distinction, marks, or Z-Score. Photos are optional (uploaded directly from device).
                </p>
              </div>
              <button
                type="button"
                onClick={addTopPerformerRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Student</span>
              </button>
            </div>

            {editingResult.topPerformers.length === 0 ? (
              <div className="rounded-lg border border-dashed border-stone-300 dark:border-stone-700 p-5 text-center text-xs text-stone-500 dark:text-stone-400">
                No top performers added yet. Click &quot;Add Student&quot; to highlight high achievers.
              </div>
            ) : (
              <div className="space-y-3">
                {editingResult.topPerformers.map((tp, idx) => (
                  <div
                    key={tp.id}
                    className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950 p-4 flex flex-col lg:flex-row lg:items-start gap-4"
                  >
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                        {tp.photoUrl ? (
                          <SafeImage
                            src={tp.photoUrl}
                            alt={`Student ${idx + 1}`}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <UserRound className="w-6 h-6 text-stone-400" aria-hidden="true" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActivePerformerId(tp.id);
                            performerPhotoInputRef.current?.click();
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" aria-hidden="true" />
                          <span>{tp.photoUrl ? 'Change Photo' : 'Upload Photo'}</span>
                        </button>
                        {tp.photoUrl && (
                          <button
                            type="button"
                            onClick={() => updatePerformer(tp.id, { photoUrl: '' })}
                            className="text-[11px] text-red-600 dark:text-red-400 hover:underline text-left cursor-pointer"
                          >
                            Remove photo
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={tp.name.en}
                        onChange={(e) =>
                          updatePerformer(tp.id, { name: { ...tp.name, en: e.target.value } })
                        }
                        placeholder="Student Name (English — optional if Tamil)"
                        className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                      />
                      <input
                        type="text"
                        value={tp.name.ta}
                        onChange={(e) =>
                          updatePerformer(tp.id, { name: { ...tp.name, ta: e.target.value } })
                        }
                        placeholder="மாணவர் பெயர் (தமிழ் — விருப்பம்)"
                        className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                      />
                      <input
                        type="text"
                        value={tp.achievement.en}
                        onChange={(e) =>
                          updatePerformer(tp.id, {
                            achievement: { ...tp.achievement, en: e.target.value },
                          })
                        }
                        placeholder="Distinction / Marks / Z-Score (English)"
                        className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                      />
                      <input
                        type="text"
                        value={tp.achievement.ta}
                        onChange={(e) =>
                          updatePerformer(tp.id, {
                            achievement: { ...tp.achievement, ta: e.target.value },
                          })
                        }
                        placeholder="சித்தி / புள்ளிகள் (தமிழ் — விருப்பம்)"
                        className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removePerformer(tp.id)}
                      className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0 self-end lg:self-center cursor-pointer"
                      aria-label="Remove student"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Celebration / Event Photos Upload */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Result Celebration / Event Photos (Optional)
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Upload group photos or award highlights from your device.
                </p>
              </div>
              <input
                ref={celebrationPhotosInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => void handleCelebrationPhotosUpload(e)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => celebrationPhotosInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Upload Photos / Choose Files</span>
              </button>
            </div>

            {(editingResult.photos || []).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {(editingResult.photos || []).map((photoUrl, pIdx) => (
                  <div
                    key={pIdx}
                    className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                  >
                    <SafeImage
                      src={photoUrl}
                      alt={`Celebration ${pIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeCelebrationPhoto(pIdx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-stone-950/75 text-white hover:bg-red-600 transition-colors cursor-pointer"
                      aria-label="Remove celebration photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => {
                setEditingResult(null);
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
              {isCreating ? 'Publish Result' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Saved Exam Results List */}
      {sortedResults.length === 0 ? (
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-10 text-center text-sm text-stone-500 dark:text-stone-400">
          No exam result records yet. Click &quot;Add Exam Result&quot; to publish one.
        </div>
      ) : (
        <div className="space-y-3">
          {sortedResults.map((res) => (
            <div
              key={res.id}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className="p-2.5 rounded-xl shrink-0 text-[var(--brand-primary)] dark:text-[var(--brand-accent)]"
                  style={{ backgroundColor: 'var(--brand-primary-soft)' }}
                >
                  <Award className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {res.category === 'Scholarship'
                        ? 'Grade 5 Scholarship'
                        : `G.C.E. ${res.category}`}{' '}
                      — {res.year}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-mono-num font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {res.passPercentage} Pass
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {res.topPerformers.length} Top Performer
                    {res.topPerformers.length === 1 ? '' : 's'}
                    {res.photos && res.photos.length > 0
                      ? ` · ${res.photos.length} photo${res.photos.length === 1 ? '' : 's'}`
                      : ''}
                    {pickText(res.summary, 'en') ? ` · ${pickText(res.summary, 'en')}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingResult(res);
                  }}
                  className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  title="Edit result"
                  aria-label="Edit result"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => void deleteExamResult(res.id)}
                  className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                  title="Delete result"
                  aria-label="Delete result"
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

import React, { useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Edit2,
  Plus,
  Trash2,
  Upload,
  UserRound,
  X,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { FormerPrincipal } from '../../types/school';
import {
  cleanBilingual,
  hasAnyText,
  pickText,
  readImageFileAsDataUrl,
} from '../../utils/schoolHelpers';
import { SafeImage } from '../SafeImage';

export const AdminFormerPrincipalsPanel: React.FC = () => {
  const {
    data,
    upsertFormerPrincipal,
    deleteFormerPrincipal,
    reorderFormerPrincipal,
    showToast,
  } = useSchoolData();

  const [editingItem, setEditingItem] = useState<FormerPrincipal | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCreate = () => {
    setIsCreating(true);
    setEditingItem({
      id: `fp-${Date.now()}`,
      name: { en: '', ta: '' },
      tenure: { en: '', ta: '' },
      note: { en: '', ta: '' },
      photoUrl: '',
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editingItem) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file, { maxDimension: 900, quality: 0.85 });
      setEditingItem({ ...editingItem, photoUrl: dataUrl });
      showToast('Former principal portrait uploaded.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to read image file.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!hasAnyText(editingItem.name)) {
      showToast('Please enter the former principal’s name in English or Tamil.', 'error');
      return;
    }
    if (!hasAnyText(editingItem.tenure)) {
      showToast('Please enter the tenure / service period (e.g., 1985 – 1994).', 'error');
      return;
    }

    const cleanedNote = cleanBilingual(editingItem.note);
    await upsertFormerPrincipal({
      ...editingItem,
      name: cleanBilingual(editingItem.name),
      tenure: cleanBilingual(editingItem.tenure),
      note: hasAnyText(cleanedNote) ? cleanedNote : undefined,
      photoUrl: editingItem.photoUrl?.trim() || '',
    });

    setEditingItem(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Former Principals
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Add, edit, reorder, or remove past principals of J/Manipay Memorial English School. Portrait photos are optional; records without photos display a dignified neutral silhouette.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white shrink-0 cursor-pointer hover:opacity-90"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Former Principal</span>
        </button>
      </div>

      {editingItem && (
        <form
          onSubmit={handleSave}
          className="rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              {isCreating ? 'Add Former Principal Record' : 'Edit Former Principal Record'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setIsCreating(false);
              }}
              className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Optional Portrait File Uploader */}
            <div className="lg:col-span-3 space-y-2.5">
              <span className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
                Portrait Photo (Optional)
              </span>
              <div className="w-28 h-32 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                {editingItem.photoUrl ? (
                  <SafeImage
                    src={editingItem.photoUrl}
                    alt="Former principal preview"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-400 dark:text-stone-500 px-2 text-center">
                    <UserRound className="w-9 h-9 stroke-[1.5]" aria-hidden="true" />
                    <span className="text-[10px] mt-1">Default Silhouette</span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => void handlePhotoUpload(e)}
                className="hidden"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Upload Image / Choose File</span>
                </button>
                {editingItem.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...editingItem, photoUrl: '' })}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                  >
                    <X className="w-3 h-3" aria-hidden="true" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-9 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Full Name (English — optional if Tamil entered)
                  </label>
                  <input
                    type="text"
                    value={editingItem.name.en}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        name: { ...editingItem.name, en: e.target.value },
                      })
                    }
                    placeholder="e.g., Mr. V. Balasundaram"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Full Name (தமிழ் — optional if English entered)
                  </label>
                  <input
                    type="text"
                    value={editingItem.name.ta}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        name: { ...editingItem.name, ta: e.target.value },
                      })
                    }
                    placeholder="உ-ம்: திரு. வி. பாலசுந்தரம்"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Tenure / Service Period (English — optional if Tamil entered)
                  </label>
                  <input
                    type="text"
                    value={editingItem.tenure.en}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        tenure: { ...editingItem.tenure, en: e.target.value },
                      })
                    }
                    placeholder="e.g., 1985 – 1994"
                    className="w-full px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Tenure / Service Period (தமிழ் — optional if English entered)
                  </label>
                  <input
                    type="text"
                    value={editingItem.tenure.ta}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        tenure: { ...editingItem.tenure, ta: e.target.value },
                      })
                    }
                    placeholder="உ-ம்: 1985 – 1994"
                    className="w-full px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Qualifications / Short Note (English — Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.note?.en || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        note: { en: e.target.value, ta: editingItem.note?.ta || '' },
                      })
                    }
                    placeholder="Optional qualifications or notable contribution..."
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Qualifications / Short Note (தமிழ் — Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.note?.ta || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        note: { en: editingItem.note?.en || '', ta: e.target.value },
                      })
                    }
                    placeholder="தகைமைகள் அல்லது சிறு குறிப்பு (விருப்பம்)..."
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
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
                  {isCreating ? 'Add Former Principal' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {data.formerPrincipals.length === 0 ? (
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-10 text-center text-sm text-stone-500 dark:text-stone-400">
          No former principal records yet. Click &quot;Add Former Principal&quot; to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {data.formerPrincipals.map((principal, index) => {
            const displayName = pickText(principal.name, 'en');
            const displayTenure = pickText(principal.tenure, 'en');
            const displayNote = pickText(principal.note, 'en');
            return (
              <div
                key={principal.id}
                className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-mono-num text-xs font-semibold text-stone-400 w-6 shrink-0 text-center">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="w-12 h-14 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shrink-0 flex items-center justify-center">
                    {principal.photoUrl ? (
                      <SafeImage
                        src={principal.photoUrl}
                        alt={displayName}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <UserRound
                        className="w-6 h-6 text-stone-400 dark:text-stone-500 stroke-[1.5]"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-semibold font-mono-num text-[var(--brand-primary)] dark:text-[var(--brand-accent)] mb-0.5">
                      {displayTenure}
                    </div>
                    <h4 className="font-medium text-sm text-stone-900 dark:text-stone-100 truncate">
                      {displayName}
                    </h4>
                    {displayNote && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                        {displayNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => void reorderFormerPrincipal(principal.id, 'up')}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                    title="Move earlier"
                    aria-label="Move former principal up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === data.formerPrincipals.length - 1}
                    onClick={() => void reorderFormerPrincipal(principal.id, 'down')}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                    title="Move later"
                    aria-label="Move former principal down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingItem(principal);
                    }}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                    title="Edit record"
                    aria-label="Edit former principal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteFormerPrincipal(principal.id)}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    title="Delete record"
                    aria-label="Delete former principal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

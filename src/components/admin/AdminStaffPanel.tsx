import React, { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Edit2, Trash2, Upload, UserPlus, X } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { StaffMember, StaffSectionCategory } from '../../types/school';
import {
  cleanBilingual,
  hasAnyText,
  pickText,
  readImageFileAsDataUrl,
} from '../../utils/schoolHelpers';
import { SafeImage } from '../SafeImage';

const SECTION_OPTIONS: StaffSectionCategory[] = ['Primary', 'Secondary', 'GCE A/L'];

function getInitials(name: string): string {
  const cleaned = name
    .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Rev\.|திருமதி|திரு\.|செல்வி)\s*/i, '')
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'T';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const AdminStaffPanel: React.FC = () => {
  const {
    data,
    upsertStaffMember,
    deleteStaffMember,
    reorderStaffMember,
    showToast,
  } = useSchoolData();

  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCreate = () => {
    setIsCreating(true);
    setEditingMember({
      id: `staff-${Date.now()}`,
      name: { en: '', ta: '' },
      role: { en: '', ta: '' },
      qualifications: { en: '', ta: '' },
      category: 'Secondary',
      photoUrl: '',
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editingMember) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file, { maxDimension: 800, quality: 0.85 });
      setEditingMember({ ...editingMember, photoUrl: dataUrl });
      showToast('Teacher photo uploaded.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to load image.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    if (!hasAnyText(editingMember.name)) {
      showToast('Please enter the teacher name in English or Tamil.', 'error');
      return;
    }
    if (!hasAnyText(editingMember.role)) {
      showToast('Please enter the subject or role in English or Tamil.', 'error');
      return;
    }

    const cleanedQual = cleanBilingual(editingMember.qualifications);
    await upsertStaffMember({
      ...editingMember,
      photoUrl: editingMember.photoUrl.trim(),
      name: cleanBilingual(editingMember.name),
      role: cleanBilingual(editingMember.role),
      qualifications: hasAnyText(cleanedQual) ? cleanedQual : undefined,
    });
    setEditingMember(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Teachers / Staff Directory
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Add, edit, reorder, or delete faculty profiles for Primary, Secondary, and GCE A/L sections. Enter English, Tamil, or both.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white shrink-0 cursor-pointer hover:opacity-90"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          <span>Add Teacher</span>
        </button>
      </div>

      {editingMember && (
        <form
          onSubmit={handleSave}
          className="rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              {isCreating ? 'Add Teacher Profile' : 'Edit Teacher Profile'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingMember(null);
                setIsCreating(false);
              }}
              className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Live Square Thumbnail / Initials Preview + File Uploader */}
            <div className="lg:col-span-3 space-y-2.5">
              <span className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
                Portrait (Optional)
              </span>
              <div className="w-32 h-32 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                {editingMember.photoUrl.trim() ? (
                  <SafeImage
                    src={editingMember.photoUrl.trim()}
                    alt={pickText(editingMember.name, 'en') || 'Teacher preview'}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-display font-semibold text-2xl"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    {getInitials(pickText(editingMember.name, 'en') || 'Teacher')}
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Upload Image</span>
                </button>
                {editingMember.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setEditingMember({ ...editingMember, photoUrl: '' })}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 border border-stone-200 dark:border-stone-700 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                If no photo is uploaded, an automatic initials badge is displayed.
              </p>
            </div>

            <div className="lg:col-span-9 space-y-3.5">
              <div className="sm:max-w-xs">
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Section Category *
                </label>
                <select
                  value={editingMember.category}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      category: e.target.value as StaffSectionCategory,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                >
                  {SECTION_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Full Name (English — optional if Tamil entered)
                  </label>
                  <input
                    type="text"
                    value={editingMember.name.en}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        name: { ...editingMember.name, en: e.target.value },
                      })
                    }
                    placeholder="e.g., Mrs. K. Sivasubramaniam"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Full Name (தமிழ் — optional if English entered)
                  </label>
                  <input
                    type="text"
                    value={editingMember.name.ta}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        name: { ...editingMember.name, ta: e.target.value },
                      })
                    }
                    placeholder="திருமதி க. சிவசுப்பிரமணியம்"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Subject / Role (English — optional if Tamil entered)
                  </label>
                  <input
                    type="text"
                    value={editingMember.role.en}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        role: { ...editingMember.role, en: e.target.value },
                      })
                    }
                    placeholder="e.g., Senior Teacher — Combined Mathematics"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Subject / Role (தமிழ் — optional if English entered)
                  </label>
                  <input
                    type="text"
                    value={editingMember.role.ta}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        role: { ...editingMember.role, ta: e.target.value },
                      })
                    }
                    placeholder="சிரேஷ்ட ஆசிரியை — இணைந்த கணிதம்"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Qualifications (English, Optional)
                  </label>
                  <input
                    type="text"
                    value={editingMember.qualifications?.en || ''}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        qualifications: {
                          en: e.target.value,
                          ta: editingMember.qualifications?.ta || '',
                        },
                      })
                    }
                    placeholder="e.g., B.Sc. (Hons) Jaffna, PGDE"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Qualifications (தமிழ், Optional)
                  </label>
                  <input
                    type="text"
                    value={editingMember.qualifications?.ta || ''}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        qualifications: {
                          en: editingMember.qualifications?.en || '',
                          ta: e.target.value,
                        },
                      })
                    }
                    placeholder="B.Sc. (Hons) யாழ்ப்பாணம், PGDE"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMember(null);
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
                  {isCreating ? 'Add Teacher' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {data.staffMembers.length === 0 ? (
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-10 text-center text-sm text-stone-500 dark:text-stone-400">
          No teacher profiles yet. Click "Add Teacher" to add a faculty member.
        </div>
      ) : (
        <div className="space-y-3">
          {data.staffMembers.map((member, index) => {
            const displayName = pickText(member.name, 'en');
            const displayRole = pickText(member.role, 'en');
            const displayQual = pickText(member.qualifications, 'en');
            return (
              <div
                key={member.id}
                className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-mono-num text-xs font-semibold text-stone-400 w-6 shrink-0 text-center">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0 flex items-center justify-center">
                    {member.photoUrl ? (
                      <SafeImage
                        src={member.photoUrl}
                        alt={displayName}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white font-display font-semibold text-sm"
                        style={{ backgroundColor: 'var(--brand-primary)' }}
                      >
                        {getInitials(displayName)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-accent)]">
                      {member.category}
                    </div>
                    <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100 truncate">
                      {displayName}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 truncate">
                      {displayRole}
                      {displayQual ? ` · ${displayQual}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => void reorderStaffMember(member.id, 'up')}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                    title="Move up"
                    aria-label="Move teacher up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === data.staffMembers.length - 1}
                    onClick={() => void reorderStaffMember(member.id, 'down')}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                    title="Move down"
                    aria-label="Move teacher down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingMember({
                        ...member,
                        qualifications: member.qualifications
                          ? { ...member.qualifications }
                          : { en: '', ta: '' },
                      });
                    }}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                    title="Edit teacher"
                    aria-label="Edit teacher"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteStaffMember(member.id)}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    title="Delete teacher"
                    aria-label="Delete teacher"
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

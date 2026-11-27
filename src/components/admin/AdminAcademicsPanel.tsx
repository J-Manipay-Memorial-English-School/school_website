import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Edit2,
  Loader2,
  Plus,
  Save,
  Tag,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  AcademicFilterTab,
  AcademicIconKey,
  AcademicProgram,
  AcademicsConfig,
} from '../../types/school';
import { cleanBilingual, hasAnyText, pickText } from '../../utils/schoolHelpers';
import { ACADEMIC_ICON_PRESETS, AcademicProgramIcon, resolveAcademicIconKey } from '../AcademicProgramIcon';

interface SubjectRow {
  rowId: string;
  en: string;
  ta: string;
}

function toSubjectRows(subjects: { en: string[]; ta: string[] } | undefined): SubjectRow[] {
  const enArr = Array.isArray(subjects?.en) ? subjects.en : [];
  const taArr = Array.isArray(subjects?.ta) ? subjects.ta : [];
  const len = Math.max(enArr.length, taArr.length);
  const rows: SubjectRow[] = [];
  for (let i = 0; i < len; i += 1) {
    const enVal = enArr[i] || '';
    const taVal = taArr[i] || '';
    if (enVal.trim() || taVal.trim()) {
      rows.push({
        rowId: `sub-${i}-${Math.random().toString(36).slice(2, 7)}`,
        en: enVal,
        ta: taVal,
      });
    }
  }
  return rows;
}

export const AdminAcademicsPanel: React.FC = () => {
  const {
    data,
    updateAcademicsConfig,
    upsertAcademicProgram,
    deleteAcademicProgram,
    reorderAcademicProgram,
    uploadAdminImage,
    showToast,
  } = useSchoolData();

  // Section header state
  const [headerForm, setHeaderForm] = useState<AcademicsConfig>(data.academicsConfig);
  const [isSavingHeader, setIsSavingHeader] = useState(false);

  // Filter tab form state
  const [editingFilter, setEditingFilter] = useState<AcademicFilterTab | null>(null);
  const [isCreatingFilter, setIsCreatingFilter] = useState(false);
  const [isSavingFilter, setIsSavingFilter] = useState(false);

  // Pathway / stream card form state
  const [editingProgram, setEditingProgram] = useState<AcademicProgram | null>(null);
  const [subjectRows, setSubjectRows] = useState<SubjectRow[]>([]);
  const [isCreatingProgram, setIsCreatingProgram] = useState(false);
  const [isSavingProgram, setIsSavingProgram] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const iconFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHeaderForm(data.academicsConfig);
  }, [data.academicsConfig]);

  const filters = data.academicsConfig.filters || [];
  const categoryFilters = filters.filter((f) => !f.isAll);

  // --- Section Header Handlers ---
  const handleSaveHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAnyText(headerForm.heading)) {
      showToast('Please enter the section main heading in English or Tamil.', 'error');
      return;
    }

    setIsSavingHeader(true);
    try {
      await updateAcademicsConfig({
        ...data.academicsConfig,
        kicker: cleanBilingual(headerForm.kicker),
        heading: cleanBilingual(headerForm.heading),
        subtitle: cleanBilingual(headerForm.subtitle),
        subjectsHeading: cleanBilingual(headerForm.subjectsHeading),
      });
    } catch {
      // Toast error handled in SchoolDataContext
    } finally {
      setIsSavingHeader(false);
    }
  };

  // --- Filter Tab Handlers ---
  const startCreateFilter = () => {
    setIsCreatingFilter(true);
    setEditingFilter({
      id: `filter-${Date.now()}`,
      label: { en: '', ta: '' },
      isAll: false,
    });
  };

  const handleSaveFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFilter) return;

    if (!hasAnyText(editingFilter.label)) {
      showToast('Please enter a filter tab label in English or Tamil.', 'error');
      return;
    }

    const cleanedFilter: AcademicFilterTab = {
      id: editingFilter.id,
      label: cleanBilingual(editingFilter.label),
      isAll: Boolean(editingFilter.isAll),
    };

    const nextFilters = isCreatingFilter
      ? [...filters, cleanedFilter]
      : filters.map((f) => (f.id === cleanedFilter.id ? cleanedFilter : f));

    setIsSavingFilter(true);
    try {
      await updateAcademicsConfig({
        ...data.academicsConfig,
        filters: nextFilters,
      });
      setEditingFilter(null);
      setIsCreatingFilter(false);
    } catch {
      // Toast handled in SchoolDataContext
    } finally {
      setIsSavingFilter(false);
    }
  };

  const handleReorderFilter = async (id: string, direction: 'up' | 'down') => {
    const list = [...filters];
    const idx = list.findIndex((f) => f.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);

    try {
      await updateAcademicsConfig({
        ...data.academicsConfig,
        filters: list,
      });
    } catch {
      // Toast handled in SchoolDataContext
    }
  };

  const handleDeleteFilter = async (filterItem: AcademicFilterTab) => {
    const nextFilters = filters.filter((f) => f.id !== filterItem.id);
    const fallbackStageId = nextFilters.find((f) => !f.isAll)?.id || '';
    const updatedPrograms = data.academics.map((prog) =>
      !filterItem.isAll && prog.stage === filterItem.id
        ? { ...prog, stage: fallbackStageId }
        : prog
    );

    try {
      await updateAcademicsConfig(
        {
          ...data.academicsConfig,
          filters: nextFilters,
        },
        updatedPrograms
      );
      if (editingFilter?.id === filterItem.id) {
        setEditingFilter(null);
        setIsCreatingFilter(false);
      }
    } catch {
      // Toast handled in SchoolDataContext
    }
  };

  // --- Pathway / Stream Card Handlers ---
  const startCreateProgram = () => {
    const defaultStage = categoryFilters[0]?.id || '';
    setIsCreatingProgram(true);
    setEditingProgram({
      id: `prog-${Date.now()}`,
      stage: defaultStage,
      streamCode: '',
      iconKey: 'book',
      iconImageUrl: '',
      title: { en: '', ta: '' },
      grades: { en: '', ta: '' },
      overview: { en: '', ta: '' },
      subjects: { en: [''], ta: [''] },
    });
    setSubjectRows([
      { rowId: `sub-${Date.now()}-1`, en: '', ta: '' },
    ]);
  };

  const startEditProgram = (program: AcademicProgram) => {
    setIsCreatingProgram(false);
    setEditingProgram({
      ...program,
      iconKey: resolveAcademicIconKey(program.iconKey, program.streamCode),
      iconImageUrl: program.iconImageUrl || '',
    });
    const rows = toSubjectRows(program.subjects);
    setSubjectRows(
      rows.length > 0
        ? rows
        : [{ rowId: `sub-${Date.now()}-1`, en: '', ta: '' }]
    );
  };

  const handleIconImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editingProgram) return;

    setIsUploadingIcon(true);
    try {
      const uploadedUrl = await uploadAdminImage(file, {
        maxDimension: 320,
        quality: 0.9,
      });
      setEditingProgram({ ...editingProgram, iconImageUrl: uploadedUrl });
      showToast('Custom pathway icon uploaded to Cloudinary.');
    } catch (err) {
      if (err instanceof Error && err.name !== 'UnauthorizedError') {
        showToast(err.message || 'Unable to upload custom icon.', 'error');
      }
    } finally {
      setIsUploadingIcon(false);
    }
  };

  const addSubjectRow = () => {
    setSubjectRows((prev) => [
      ...prev,
      { rowId: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, en: '', ta: '' },
    ]);
  };

  const updateSubjectRow = (rowId: string, lang: 'en' | 'ta', value: string) => {
    setSubjectRows((prev) =>
      prev.map((row) => (row.rowId === rowId ? { ...row, [lang]: value } : row))
    );
  };

  const moveSubjectRow = (index: number, direction: 'up' | 'down') => {
    setSubjectRows((prev) => {
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
  };

  const removeSubjectRow = (rowId: string) => {
    setSubjectRows((prev) => prev.filter((row) => row.rowId !== rowId));
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;

    if (!hasAnyText(editingProgram.title)) {
      showToast('Please enter the pathway/stream title in English or Tamil.', 'error');
      return;
    }

    const validSubjectRows = subjectRows.filter(
      (row) => row.en.trim() || row.ta.trim()
    );

    const normalizedProgram: AcademicProgram = {
      ...editingProgram,
      stage: editingProgram.stage.trim(),
      streamCode: editingProgram.streamCode.trim(),
      iconKey: editingProgram.iconKey || 'book',
      iconImageUrl: editingProgram.iconImageUrl?.trim() || '',
      title: cleanBilingual(editingProgram.title),
      grades: cleanBilingual(editingProgram.grades),
      overview: cleanBilingual(editingProgram.overview),
      subjects: {
        en: validSubjectRows.map((row) => row.en.trim()),
        ta: validSubjectRows.map((row) => row.ta.trim()),
      },
    };

    setIsSavingProgram(true);
    try {
      await upsertAcademicProgram(normalizedProgram);
      setEditingProgram(null);
      setIsCreatingProgram(false);
      setSubjectRows([]);
    } catch {
      // Toast handled in SchoolDataContext
    } finally {
      setIsSavingProgram(false);
    }
  };

  const resolveFilterLabel = (stageId: string): { label: string; isMissing: boolean } => {
    const matched = categoryFilters.find((f) => f.id === stageId);
    if (matched) {
      return { label: pickText(matched.label, 'en'), isMissing: false };
    }
    return {
      label: stageId ? `Unlinked (${stageId})` : 'Unassigned',
      isMissing: true,
    };
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
          Academic Pathways &amp; Streams Manager
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Customize the Academics section heading, manage filter tabs, and add, reorder, or edit pathway cards, icons, and individual subjects. All changes save to Cloudflare KV, with custom icons uploaded to Cloudinary.
        </p>
      </div>

      {/* 1. Section Header & Intro Copy */}
      <form
        onSubmit={handleSaveHeader}
        className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              1. Section Eyebrow, Heading &amp; Description
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Single-language entry supported—if one language is left blank, the other is displayed automatically.
            </p>
          </div>
          <button
            type="submit"
            disabled={isSavingHeader}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-60 shrink-0"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            {isSavingHeader ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="w-4 h-4" aria-hidden="true" />
            )}
            <span>Save Section Header</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Eyebrow / Curriculum Label (English)
            </label>
            <input
              type="text"
              value={headerForm.kicker.en}
              onChange={(e) =>
                setHeaderForm({
                  ...headerForm,
                  kicker: { ...headerForm.kicker, en: e.target.value },
                })
              }
              placeholder="e.g., 1C Provincial Curriculum · Medium of Instruction: Tamil"
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Eyebrow / Curriculum Label (தமிழ்)
            </label>
            <input
              type="text"
              value={headerForm.kicker.ta}
              onChange={(e) =>
                setHeaderForm({
                  ...headerForm,
                  kicker: { ...headerForm.kicker, ta: e.target.value },
                })
              }
              placeholder="உ-ம்: 1C மாகாணக் கலைத்திட்டம் · மொழி மூலம்: தமிழ்"
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Main Section Heading (English)
            </label>
            <input
              type="text"
              value={headerForm.heading.en}
              onChange={(e) =>
                setHeaderForm({
                  ...headerForm,
                  heading: { ...headerForm.heading, en: e.target.value },
                })
              }
              placeholder="e.g., Academic Pathways & Streams"
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Main Section Heading (தமிழ்)
            </label>
            <input
              type="text"
              value={headerForm.heading.ta}
              onChange={(e) =>
                setHeaderForm({
                  ...headerForm,
                  heading: { ...headerForm.heading, ta: e.target.value },
                })
              }
              placeholder="உ-ம்: கல்விப் பாதைகளும் பிரிவுகளும்"
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Section Subtitle / Description (English)
            </label>
            <textarea
              rows={2}
              value={headerForm.subtitle.en}
              onChange={(e) =>
                setHeaderForm({
                  ...headerForm,
                  subtitle: { ...headerForm.subtitle, en: e.target.value },
                })
              }
              placeholder="Structured progression from foundational primary literacy..."
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Section Subtitle / Description (தமிழ்)
            </label>
            <textarea
              rows={2}
              value={headerForm.subtitle.ta}
              onChange={(e) =>
                setHeaderForm({
                  ...headerForm,
                  subtitle: { ...headerForm.subtitle, ta: e.target.value },
                })
              }
              placeholder="ஆரம்பக் கல்வி முதல் க.பொ.த. உயர்தர..."
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Card Subjects Heading (English)
            </label>
            <input
              type="text"
              value={headerForm.subjectsHeading.en}
              onChange={(e) =>
                setHeaderForm({
                  ...headerForm,
                  subjectsHeading: { ...headerForm.subjectsHeading, en: e.target.value },
                })
              }
              placeholder="e.g., Core & Elective Subjects"
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Card Subjects Heading (தமிழ்)
            </label>
            <input
              type="text"
              value={headerForm.subjectsHeading.ta}
              onChange={(e) =>
                setHeaderForm({
                  ...headerForm,
                  subjectsHeading: { ...headerForm.subjectsHeading, ta: e.target.value },
                })
              }
              placeholder="உ-ம்: முதன்மை மற்றும் விருப்பப் பாடங்கள்"
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
        </div>
      </form>

      {/* 2. Filter Tabs Manager */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              2. Filter Tabs &amp; Categories
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Add, rename, reorder, or delete the sub-navigation filter tabs. Link pathway cards below to any non-&ldquo;All&rdquo; category.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreateFilter}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white cursor-pointer hover:opacity-90 shrink-0"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add Filter Tab</span>
          </button>
        </div>

        {editingFilter && (
          <form
            onSubmit={handleSaveFilter}
            className="rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {isCreatingFilter ? 'Add New Filter Tab' : 'Edit Filter Tab'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setEditingFilter(null);
                  setIsCreatingFilter(false);
                }}
                className="p-1 rounded-lg text-stone-500 hover:bg-stone-200/70 dark:hover:bg-stone-800 cursor-pointer"
                aria-label="Close filter editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Tab Label (English)
                </label>
                <input
                  type="text"
                  value={editingFilter.label.en}
                  onChange={(e) =>
                    setEditingFilter({
                      ...editingFilter,
                      label: { ...editingFilter.label, en: e.target.value },
                    })
                  }
                  placeholder="e.g., Primary (1–5)"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Tab Label (தமிழ்)
                </label>
                <input
                  type="text"
                  value={editingFilter.label.ta}
                  onChange={(e) =>
                    setEditingFilter({
                      ...editingFilter,
                      label: { ...editingFilter.label, ta: e.target.value },
                    })
                  }
                  placeholder="உ-ம்: ஆரம்பப் பிரிவு (1–5)"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(editingFilter.isAll)}
                onChange={(e) =>
                  setEditingFilter({ ...editingFilter, isAll: e.target.checked })
                }
                className="rounded border-stone-300 text-[var(--brand-primary)]"
              />
              <span>
                Act as &ldquo;All Levels&rdquo; catch-all tab (displays every pathway card)
              </span>
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingFilter(null);
                  setIsCreatingFilter(false);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-stone-300 dark:border-stone-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingFilter}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {isSavingFilter && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isCreatingFilter ? 'Add Filter Tab' : 'Save Filter Tab'}</span>
              </button>
            </div>
          </form>
        )}

        {filters.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 dark:border-stone-700 p-6 text-center text-sm text-stone-500 dark:text-stone-400">
            No filter tabs configured. Add filter tabs so visitors can filter academic pathways, or leave empty to show all cards without filter tabs.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filters.map((filterItem, idx) => {
              const linkedCount = filterItem.isAll
                ? data.academics.length
                : data.academics.filter((p) => p.stage === filterItem.id).length;
              return (
                <div
                  key={filterItem.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950/60 px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono-num text-xs font-semibold text-stone-400 w-5 text-center shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {pickText(filterItem.label, 'en')}
                        </span>
                        {filterItem.label.ta &&
                          filterItem.label.en &&
                          filterItem.label.ta !== filterItem.label.en && (
                            <span className="text-xs text-stone-500 dark:text-stone-400">
                              / {filterItem.label.ta}
                            </span>
                          )}
                        {filterItem.isAll && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
                            Shows All Cards
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {linkedCount} {linkedCount === 1 ? 'card' : 'cards'} matched
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => void handleReorderFilter(filterItem.id, 'up')}
                      className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                      title="Move filter left / up"
                      aria-label="Move filter tab up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === filters.length - 1}
                      onClick={() => void handleReorderFilter(filterItem.id, 'down')}
                      className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                      title="Move filter right / down"
                      aria-label="Move filter tab down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingFilter(false);
                        setEditingFilter(filterItem);
                      }}
                      className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                      title="Edit filter tab"
                      aria-label="Edit filter tab"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteFilter(filterItem)}
                      className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                      title="Delete filter tab"
                      aria-label="Delete filter tab"
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

      {/* 3. Academic Pathway & Stream Cards Manager */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              3. Academic Pathway &amp; Stream Cards
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Add, edit, reorder, or delete cards. Configure badge code, linked filter category, title, subtitle, description, icon (preset or Cloudinary upload), and individual subjects.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreateProgram}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white cursor-pointer hover:opacity-90 shrink-0"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add Pathway Card</span>
          </button>
        </div>

        {editingProgram && (
          <form
            onSubmit={handleSaveProgram}
            className="rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 p-5 sm:p-6 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h4 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                {isCreatingProgram ? 'Create New Pathway / Stream Card' : 'Edit Pathway / Stream Card'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setEditingProgram(null);
                  setIsCreatingProgram(false);
                }}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200/70 dark:hover:bg-stone-800 cursor-pointer"
                aria-label="Cancel card editing"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Link + Code Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Linked Filter / Category Tab
                </label>
                <select
                  value={editingProgram.stage}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, stage: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                >
                  <option value="">Unassigned (Visible in &ldquo;All&rdquo; tab only)</option>
                  {categoryFilters.map((f) => (
                    <option key={f.id} value={f.id}>
                      {pickText(f.label, 'en')}
                      {f.label.ta && f.label.en && f.label.ta !== f.label.en
                        ? ` (${f.label.ta})`
                        : ''}
                    </option>
                  ))}
                  {editingProgram.stage &&
                    !categoryFilters.some((f) => f.id === editingProgram.stage) && (
                      <option value={editingProgram.stage}>
                        Legacy / Unlinked: {editingProgram.stage}
                      </option>
                    )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Code / Badge (e.g., GR 01–05, A/L TECH)
                </label>
                <input
                  type="text"
                  value={editingProgram.streamCode}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, streamCode: e.target.value })
                  }
                  placeholder="e.g., A/L TECH"
                  className="w-full px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
            </div>

            {/* Title EN / TA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Card Title (English — optional if Tamil entered)
                </label>
                <input
                  type="text"
                  value={editingProgram.title.en}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      title: { ...editingProgram.title, en: e.target.value },
                    })
                  }
                  placeholder="e.g., Primary Foundation Wing"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Card Title (தமிழ் — optional if English entered)
                </label>
                <input
                  type="text"
                  value={editingProgram.title.ta}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      title: { ...editingProgram.title, ta: e.target.value },
                    })
                  }
                  placeholder="உ-ம்: ஆரம்பக் கல்விப் பிரிவு"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
            </div>

            {/* Subtitle / Grade Range EN / TA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Subtitle / Grade Level (English)
                </label>
                <input
                  type="text"
                  value={editingProgram.grades.en}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      grades: { ...editingProgram.grades, en: e.target.value },
                    })
                  }
                  placeholder="e.g., Grades 1 to 5 · Scholarship Preparation"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Subtitle / Grade Level (தமிழ்)
                </label>
                <input
                  type="text"
                  value={editingProgram.grades.ta}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      grades: { ...editingProgram.grades, ta: e.target.value },
                    })
                  }
                  placeholder="உ-ம்: தரம் 1 முதல் 5 வரை · புலமைப்பரிசில் வழிகாட்டல்"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
            </div>

            {/* Overview / Description EN / TA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Description / Overview (English)
                </label>
                <textarea
                  rows={3}
                  value={editingProgram.overview.en}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      overview: { ...editingProgram.overview, en: e.target.value },
                    })
                  }
                  placeholder="Describe this wing or stream..."
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Description / Overview (தமிழ்)
                </label>
                <textarea
                  rows={3}
                  value={editingProgram.overview.ta}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      overview: { ...editingProgram.overview, ta: e.target.value },
                    })
                  }
                  placeholder="பிரிவின் விளக்கத்தை உள்ளிடவும்..."
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
            </div>

            {/* Icon Selector + Custom Upload to Cloudinary */}
            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-200">
                    Card Icon or Custom Uploaded Image
                  </h5>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Choose a built-in icon preset or upload a custom icon/emblem image (stored via Cloudinary).
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center border border-stone-200 dark:border-stone-700 text-[var(--brand-primary)] dark:text-[var(--brand-accent)]"
                    style={{ backgroundColor: 'var(--brand-primary-soft)' }}
                  >
                    <AcademicProgramIcon
                      iconKey={editingProgram.iconKey}
                      iconImageUrl={editingProgram.iconImageUrl}
                      streamCode={editingProgram.streamCode}
                      alt="Selected icon preview"
                      iconClassName="w-5 h-5"
                      imageClassName="w-7 h-7 object-contain rounded"
                    />
                  </div>
                  <input
                    ref={iconFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => void handleIconImageUpload(e)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingIcon}
                    onClick={() => iconFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer disabled:opacity-60"
                  >
                    {isUploadingIcon ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span>{isUploadingIcon ? 'Uploading...' : 'Upload Custom Icon'}</span>
                  </button>
                  {editingProgram.iconImageUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        setEditingProgram({ ...editingProgram, iconImageUrl: '' })
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Use Preset</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 gap-2">
                {ACADEMIC_ICON_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const active =
                    !editingProgram.iconImageUrl &&
                    (editingProgram.iconKey || 'book') === preset.key;
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() =>
                        setEditingProgram({
                          ...editingProgram,
                          iconKey: preset.key as AcademicIconKey,
                          iconImageUrl: '',
                        })
                      }
                      title={preset.label}
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                        active
                          ? 'text-white border-transparent'
                          : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                      style={active ? { backgroundColor: 'var(--brand-primary)' } : undefined}
                    >
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="truncate w-full text-center leading-tight">
                        {preset.label.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Individual Subject List Editor */}
            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-200">
                    Core &amp; Elective Subjects ({subjectRows.length})
                  </h5>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Add, edit, reorder, or remove individual subjects displayed inside this card.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addSubjectRow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 shrink-0 self-start sm:self-auto"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Add Subject</span>
                </button>
              </div>

              {subjectRows.length === 0 ? (
                <div className="py-5 text-center text-xs text-stone-500 dark:text-stone-400">
                  No subjects added yet. Click &ldquo;Add Subject&rdquo; above to list subjects for this pathway.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {subjectRows.map((row, idx) => (
                    <div
                      key={row.rowId}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950 p-2.5"
                    >
                      <span className="font-mono-num text-xs font-semibold text-stone-400 w-6 text-center shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={row.en}
                          onChange={(e) => updateSubjectRow(row.rowId, 'en', e.target.value)}
                          placeholder="Subject name (English)"
                          className="w-full px-2.5 py-1.5 rounded-md text-xs sm:text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                        <input
                          type="text"
                          value={row.ta}
                          onChange={(e) => updateSubjectRow(row.rowId, 'ta', e.target.value)}
                          placeholder="பாடத்தின் பெயர் (தமிழ்)"
                          className="w-full px-2.5 py-1.5 rounded-md text-xs sm:text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      <div className="flex items-center gap-1 justify-end shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveSubjectRow(idx, 'up')}
                          className="p-1.5 rounded-md border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                          title="Move subject up"
                          aria-label="Move subject up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === subjectRows.length - 1}
                          onClick={() => moveSubjectRow(idx, 'down')}
                          className="p-1.5 rounded-md border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                          title="Move subject down"
                          aria-label="Move subject down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSubjectRow(row.rowId)}
                          className="p-1.5 rounded-md border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                          title="Remove subject"
                          aria-label="Remove subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setEditingProgram(null);
                  setIsCreatingProgram(false);
                }}
                className="px-4 py-2 rounded-lg text-sm border border-stone-300 dark:border-stone-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingProgram || isUploadingIcon}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {isSavingProgram && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                <span>{isCreatingProgram ? 'Add Pathway Card' : 'Save Card Changes'}</span>
              </button>
            </div>
          </form>
        )}

        {data.academics.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 dark:border-stone-700 p-10 text-center text-sm text-stone-500 dark:text-stone-400">
            No academic pathway cards yet. Click &ldquo;Add Pathway Card&rdquo; to create your first wing or A/L stream.
          </div>
        ) : (
          <div className="space-y-3">
            {data.academics.map((program, idx) => {
              const displayTitle = pickText(program.title, 'en');
              const displayGrades = pickText(program.grades, 'en');
              const filterMeta = resolveFilterLabel(program.stage);
              const subjectCount = Math.max(
                program.subjects?.en?.filter((s) => s.trim()).length || 0,
                program.subjects?.ta?.filter((s) => s.trim()).length || 0
              );

              return (
                <div
                  key={program.id}
                  className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <span className="font-mono-num text-xs font-semibold text-stone-400 w-6 shrink-0 text-center mt-2 sm:mt-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-[var(--brand-primary)] dark:text-[var(--brand-accent)]"
                      style={{ backgroundColor: 'var(--brand-primary-soft)' }}
                    >
                      <AcademicProgramIcon
                        iconKey={program.iconKey}
                        iconImageUrl={program.iconImageUrl}
                        streamCode={program.streamCode}
                        alt={displayTitle}
                        iconClassName="w-5 h-5"
                        imageClassName="w-7 h-7 object-contain rounded"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        {program.streamCode && (
                          <span className="font-mono-num text-xs font-semibold text-stone-600 dark:text-stone-300">
                            {program.streamCode}
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            filterMeta.isMissing
                              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200'
                              : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {filterMeta.isMissing ? (
                            <AlertCircle className="w-3 h-3" aria-hidden="true" />
                          ) : (
                            <Tag className="w-3 h-3" aria-hidden="true" />
                          )}
                          <span>{filterMeta.label}</span>
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400">
                          · {subjectCount} {subjectCount === 1 ? 'subject' : 'subjects'}
                        </span>
                      </div>

                      <h4 className="font-medium text-sm text-stone-900 dark:text-stone-100 truncate">
                        {displayTitle}
                      </h4>
                      {displayGrades && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                          {displayGrades}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => void reorderAcademicProgram(program.id, 'up').catch(() => undefined)}
                      className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                      title="Move card earlier"
                      aria-label="Move pathway card up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.academics.length - 1}
                      onClick={() => void reorderAcademicProgram(program.id, 'down').catch(() => undefined)}
                      className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                      title="Move card later"
                      aria-label="Move pathway card down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startEditProgram(program)}
                      className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                      title="Edit pathway card"
                      aria-label="Edit pathway card"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteAcademicProgram(program.id).catch(() => undefined)}
                      className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                      title="Delete pathway card"
                      aria-label="Delete pathway card"
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
    </div>
  );
};

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Save, Trash2, Upload } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { ClassStrengthItem, PrincipalConfig, SchoolStats } from '../../types/school';
import { hasAnyText, readImageFileAsDataUrl } from '../../utils/schoolHelpers';
import { SafeImage } from '../SafeImage';

export const AdminPrincipalStatsPanel: React.FC = () => {
  const { data, updatePrincipalAndStats, showToast } = useSchoolData();
  const [principal, setPrincipal] = useState<PrincipalConfig>(data.principal);
  const [stats, setStats] = useState<SchoolStats>(data.stats);
  const [studentStrength, setStudentStrength] = useState<ClassStrengthItem[]>(data.studentStrength);
  const [saving, setSaving] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPrincipal(data.principal);
    setStats(data.stats);
    setStudentStrength(data.studentStrength);
  }, [data.principal, data.stats, data.studentStrength]);

  const strengthTotals = useMemo(() => {
    return studentStrength.reduce(
      (acc, cls) => {
        const boys = Number(cls.boys) || 0;
        const girls = Number(cls.girls) || 0;
        return {
          boys: acc.boys + boys,
          girls: acc.girls + girls,
          total: acc.total + boys + girls,
        };
      },
      { boys: 0, girls: 0, total: 0 }
    );
  }, [studentStrength]);

  const handlePrincipalPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file, { maxDimension: 1000, quality: 0.85 });
      setPrincipal((prev) => ({ ...prev, photoUrl: dataUrl }));
      showToast('Principal portrait uploaded. Click Save Changes to publish.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to load image file.', 'error');
    }
  };

  const handleAddClass = () => {
    const nextNum = studentStrength.length + 1;
    setStudentStrength((prev) => [
      ...prev,
      {
        id: `cls-${Date.now()}`,
        grade: { en: `Grade ${nextNum}`, ta: `தரம் ${nextNum}` },
        boys: 0,
        girls: 0,
      },
    ]);
  };

  const handleUpdateClass = (
    id: string,
    updater: (item: ClassStrengthItem) => ClassStrengthItem
  ) => {
    setStudentStrength((prev) => prev.map((item) => (item.id === id ? updater(item) : item)));
  };

  const handleDeleteClass = (id: string) => {
    setStudentStrength((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveClass = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= studentStrength.length) return;
    setStudentStrength((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAnyText(principal.name)) {
      showToast('Please enter the Principal name in English or Tamil.', 'error');
      return;
    }
    const invalidClass = studentStrength.some((cls) => !hasAnyText(cls.grade));
    if (invalidClass) {
      showToast('Each class row must have a grade name in English or Tamil.', 'error');
      return;
    }
    setSaving(true);
    try {
      await updatePrincipalAndStats({
        principal,
        stats: {
          ...stats,
          students: strengthTotals.total,
        },
        studentStrength,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Principal, Statistics & Student Strength
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Manage class-by-class Boys/Girls strength (auto-sums Active Students), live counters, and Principal profile. Enter English, Tamil, or both.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shrink-0 cursor-pointer hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Live Counters Summary */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            Live Statistics Bar Numbers
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Active Students, Total Boys, and Total Girls are automatically summed from the Class-Wise Student Strength table below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 p-3.5">
            <span className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Active Students (Auto-Sum)
            </span>
            <div
              className="text-2xl font-display font-semibold font-mono-num"
              style={{ color: 'var(--brand-primary)' }}
            >
              <span className="dark:text-[var(--brand-accent)]">
                {strengthTotals.total.toLocaleString()}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono-num">
              Boys: {strengthTotals.boys.toLocaleString()} · Girls: {strengthTotals.girls.toLocaleString()}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Academic Staff
            </label>
            <input
              type="number"
              min={0}
              value={stats.academicStaff}
              onChange={(e) => setStats({ ...stats, academicStaff: Number(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Non-Academic Staff
            </label>
            <input
              type="number"
              min={0}
              value={stats.nonAcademicStaff}
              onChange={(e) =>
                setStats({ ...stats, nonAcademicStaff: Number(e.target.value) || 0 })
              }
              className="w-full px-3.5 py-2.5 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Prefects
            </label>
            <input
              type="number"
              min={0}
              value={stats.prefects}
              onChange={(e) => setStats({ ...stats, prefects: Number(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>
      </div>

      {/* Class-Wise Student Strength Manager */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              Class-Wise Student Strength (மாணவர்கள் / ஆண்கள் / பெண்கள்)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Add, edit, reorder, or remove classes/grades and update Boys & Girls counts. Enter English, Tamil, or both.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddClass}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white shrink-0 cursor-pointer hover:opacity-90"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add Class / Grade</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 text-[11px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-3 min-w-[170px]">Grade / Class (English)</th>
                <th className="py-2.5 px-3 min-w-[170px]">Grade / Class (தமிழ்)</th>
                <th className="py-2.5 px-3 w-28">Boys (ஆண்கள்)</th>
                <th className="py-2.5 px-3 w-28">Girls (பெண்கள்)</th>
                <th className="py-2.5 px-3 w-24 text-right">Total</th>
                <th className="py-2.5 px-3 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-sm">
              {studentStrength.map((cls, index) => {
                const rowTotal = (Number(cls.boys) || 0) + (Number(cls.girls) || 0);
                return (
                  <tr key={cls.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                    <td className="py-2.5 px-3 text-center font-mono-num text-xs text-stone-400">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={cls.grade.en}
                        onChange={(e) =>
                          handleUpdateClass(cls.id, (item) => ({
                            ...item,
                            grade: { ...item.grade, en: e.target.value },
                          }))
                        }
                        placeholder="Optional if Tamil entered"
                        className="w-full px-2.5 py-1.5 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={cls.grade.ta}
                        onChange={(e) =>
                          handleUpdateClass(cls.id, (item) => ({
                            ...item,
                            grade: { ...item.grade, ta: e.target.value },
                          }))
                        }
                        placeholder="விரும்பினால் தமிழ் பெயர்"
                        className="w-full px-2.5 py-1.5 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min={0}
                        value={cls.boys}
                        onChange={(e) =>
                          handleUpdateClass(cls.id, (item) => ({
                            ...item,
                            boys: Math.max(0, Number(e.target.value) || 0),
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min={0}
                        value={cls.girls}
                        onChange={(e) =>
                          handleUpdateClass(cls.id, (item) => ({
                            ...item,
                            girls: Math.max(0, Number(e.target.value) || 0),
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-num font-semibold text-stone-900 dark:text-stone-100">
                      {rowTotal.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveClass(index, 'up')}
                          className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                          aria-label="Move class up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === studentStrength.length - 1}
                          onClick={() => handleMoveClass(index, 'down')}
                          className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                          aria-label="Move class down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClass(cls.id)}
                          className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                          aria-label="Remove class"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 font-semibold text-sm">
                <td colSpan={3} className="py-3 px-4 text-stone-900 dark:text-stone-100">
                  Total Active Students ({studentStrength.length} classes)
                </td>
                <td className="py-3 px-3 font-mono-num text-stone-900 dark:text-stone-100">
                  {strengthTotals.boys.toLocaleString()}
                </td>
                <td className="py-3 px-3 font-mono-num text-stone-900 dark:text-stone-100">
                  {strengthTotals.girls.toLocaleString()}
                </td>
                <td
                  className="py-3 px-3 text-right font-mono-num"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  <span className="dark:text-[var(--brand-accent)]">
                    {strengthTotals.total.toLocaleString()}
                  </span>
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Principal Profile (Direct File Upload Only) */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
          Principal Profile & Message
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-3 space-y-2.5">
            <span className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
              Principal Portrait
            </span>
            <div className="aspect-[3/4] rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
              <SafeImage src={principal.photoUrl} alt="Principal portrait preview" />
            </div>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => void handlePrincipalPhotoUpload(e)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Upload Image / Choose File</span>
            </button>
          </div>

          <div className="lg:col-span-9 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Name (English)
                </label>
                <input
                  type="text"
                  value={principal.name.en}
                  onChange={(e) =>
                    setPrincipal({
                      ...principal,
                      name: { ...principal.name, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Name (தமிழ்)
                </label>
                <input
                  type="text"
                  value={principal.name.ta}
                  onChange={(e) =>
                    setPrincipal({
                      ...principal,
                      name: { ...principal.name, ta: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Credentials (English)
                </label>
                <input
                  type="text"
                  value={principal.credentials.en}
                  onChange={(e) =>
                    setPrincipal({
                      ...principal,
                      credentials: { ...principal.credentials, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Credentials (தமிழ்)
                </label>
                <input
                  type="text"
                  value={principal.credentials.ta}
                  onChange={(e) =>
                    setPrincipal({
                      ...principal,
                      credentials: { ...principal.credentials, ta: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Opening Welcome Message (English)
                </label>
                <textarea
                  rows={4}
                  value={principal.summaryMessage.en}
                  onChange={(e) =>
                    setPrincipal({
                      ...principal,
                      summaryMessage: { ...principal.summaryMessage, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Opening Welcome Message (தமிழ்)
                </label>
                <textarea
                  rows={4}
                  value={principal.summaryMessage.ta}
                  onChange={(e) =>
                    setPrincipal({
                      ...principal,
                      summaryMessage: { ...principal.summaryMessage, ta: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Expanded Address (English)
                </label>
                <textarea
                  rows={4}
                  value={principal.fullMessage.en}
                  onChange={(e) =>
                    setPrincipal({
                      ...principal,
                      fullMessage: { ...principal.fullMessage, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Expanded Address (தமிழ்)
                </label>
                <textarea
                  rows={4}
                  value={principal.fullMessage.ta}
                  onChange={(e) =>
                    setPrincipal({
                      ...principal,
                      fullMessage: { ...principal.fullMessage, ta: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

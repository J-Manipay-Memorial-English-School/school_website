import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  BellRing,
  CalendarClock,
  ClipboardCheck,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { SmartSystemIconKey, SmartSystemItem } from '../../types/school';
import { cleanBilingual, hasAnyText } from '../../utils/schoolHelpers';

function getIcon(key: SmartSystemIconKey) {
  switch (key) {
    case 'relief':
      return CalendarClock;
    case 'attendance':
      return ClipboardCheck;
    case 'marks':
      return BarChart3;
    case 'bell':
      return BellRing;
    default:
      return CalendarClock;
  }
}

export const AdminSmartSystemsPanel: React.FC = () => {
  const { data, updateSmartSystems, showToast } = useSchoolData();
  const [systems, setSystems] = useState<SmartSystemItem[]>(data.smartSystems);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSystems(data.smartSystems);
  }, [data.smartSystems]);

  const updateItem = (id: string, patch: Partial<SmartSystemItem>) => {
    setSystems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const invalid = systems.find((sys) => !hasAnyText(sys.title));
    if (invalid) {
      showToast('Each system requires a title in English or Tamil.', 'error');
      return;
    }

    setSaving(true);
    try {
      await updateSmartSystems(
        systems.map((sys) => ({
          ...sys,
          title: cleanBilingual(sys.title),
          description: cleanBilingual(sys.description),
          url: sys.url.trim(),
        }))
      );
    } catch {
      // Toast error handled in SchoolDataContext
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Smart Systems Manager
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Edit titles, brief descriptions, launch URLs, and visibility toggles for &quot;Our Smart Systems&quot; displayed on the Home page. Enter English, Tamil, or both.
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

      <div className="space-y-4">
        {systems.map((sys, idx) => {
          const Icon = getIcon(sys.iconKey);
          return (
            <div
              key={sys.id}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--brand-primary)] dark:text-[var(--brand-accent)]"
                    style={{ backgroundColor: 'var(--brand-primary-soft)' }}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-mono-num text-stone-400 uppercase tracking-wider block">
                      System 0{idx + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {sys.title.en || sys.title.ta}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => updateItem(sys.id, { enabled: !sys.enabled })}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    sys.enabled
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                  }`}
                >
                  {sys.enabled ? (
                    <>
                      <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Visible on Home</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    System Title (English — optional if Tamil entered)
                  </label>
                  <input
                    type="text"
                    value={sys.title.en}
                    onChange={(e) =>
                      updateItem(sys.id, { title: { ...sys.title, en: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    System Title (தமிழ் — optional if English entered)
                  </label>
                  <input
                    type="text"
                    value={sys.title.ta}
                    onChange={(e) =>
                      updateItem(sys.id, { title: { ...sys.title, ta: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Short Description (English — Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={sys.description.en}
                    onChange={(e) =>
                      updateItem(sys.id, {
                        description: { ...sys.description, en: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Short Description (தமிழ் — Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={sys.description.ta}
                    onChange={(e) =>
                      updateItem(sys.id, {
                        description: { ...sys.description, ta: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  External Portal Link URL (opens in a new tab; leave blank or # if pending)
                </label>
                <input
                  type="text"
                  value={sys.url}
                  onChange={(e) => updateItem(sys.id, { url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                />
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
};

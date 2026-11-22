import React, { useEffect, useState } from 'react';
import { AlertTriangle, Check, Mail, Palette, RotateCcw } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { ThemeBrandConfig } from '../../types/school';

const BRAND_PRESETS: ThemeBrandConfig[] = [
  {
    presetName: 'Heritage Crimson & Gold',
    primaryColor: '#6B1D2F',
    accentColor: '#B47B2B',
  },
  {
    presetName: 'Jaffna Royal Lapis',
    primaryColor: '#1E3A8A',
    accentColor: '#C27803',
  },
  {
    presetName: 'Palmyra Forest & Bronze',
    primaryColor: '#14532D',
    accentColor: '#A16207',
  },
  {
    presetName: 'Academic Slate & Terracotta',
    primaryColor: '#1F2937',
    accentColor: '#9A3412',
  },
];

export const AdminThemeBrandPanel: React.FC = () => {
  const { data, updateBrandTheme, resetAllToDefaults, inquiries, markInquiryRead } = useSchoolData();
  const [primaryColor, setPrimaryColor] = useState(data.brandTheme.primaryColor);
  const [accentColor, setAccentColor] = useState(data.brandTheme.accentColor);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  useEffect(() => {
    setPrimaryColor(data.brandTheme.primaryColor);
    setAccentColor(data.brandTheme.accentColor);
  }, [data.brandTheme]);

  const applyCustomColors = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBrandTheme({
        primaryColor,
        accentColor,
        presetName: 'Custom Brand Palette',
      });
    } catch {
      // Toast error handled in SchoolDataContext
    }
  };

  const handleConfirmReset = async () => {
    try {
      await resetAllToDefaults();
      setConfirmResetOpen(false);
    } catch {
      // Toast error handled in SchoolDataContext
    }
  };

  return (
    <div className="space-y-10">
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
          Theme & Brand Studio
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Customize the school’s primary and accent brand colors across the entire site in real time, review inquiries, or restore defaults.
        </p>
      </div>

      {/* Presets & Custom Hex Picker */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-6">
        <div className="flex items-center gap-2 text-base font-semibold text-stone-900 dark:text-stone-100">
          <Palette className="w-4 h-4 text-[var(--brand-primary)] dark:text-[var(--brand-accent)]" aria-hidden="true" />
          <span>Institutional Color Swatches</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BRAND_PRESETS.map((preset) => {
            const active =
              data.brandTheme.primaryColor.toLowerCase() === preset.primaryColor.toLowerCase() &&
              data.brandTheme.accentColor.toLowerCase() === preset.accentColor.toLowerCase();
            return (
              <button
                key={preset.presetName}
                type="button"
                onClick={() => void updateBrandTheme(preset).catch(() => undefined)}
                className={`text-left rounded-xl border p-4 transition-all cursor-pointer ${
                  active
                    ? 'border-[var(--brand-primary)] dark:border-[var(--brand-accent)] bg-stone-50 dark:bg-stone-950'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-6 h-6 rounded-md border border-black/10"
                      style={{ backgroundColor: preset.primaryColor }}
                    />
                    <span
                      className="w-6 h-6 rounded-md border border-black/10"
                      style={{ backgroundColor: preset.accentColor }}
                    />
                  </div>
                  {active && (
                    <Check className="w-4 h-4 text-[var(--brand-primary)] dark:text-[var(--brand-accent)]" aria-hidden="true" />
                  )}
                </div>
                <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  {preset.presetName}
                </div>
                <div className="text-[11px] font-mono-num text-stone-500 dark:text-stone-400 mt-0.5">
                  {preset.primaryColor} · {preset.accentColor}
                </div>
              </button>
            );
          })}
        </div>

        <form
          onSubmit={applyCustomColors}
          className="pt-5 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-end gap-4"
        >
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
              Custom Primary Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-stone-200 dark:border-stone-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-28 px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
              Custom Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-stone-200 dark:border-stone-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-28 px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            Apply Custom Brand Colors
          </button>
        </form>
      </div>

      {/* Visitor Inquiries Inbox */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-semibold text-stone-900 dark:text-stone-100">
            <Mail className="w-4 h-4 text-[var(--brand-primary)] dark:text-[var(--brand-accent)]" aria-hidden="true" />
            <span>Contact Form Inquiries ({inquiries.length})</span>
          </div>
        </div>

        {inquiries.length === 0 ? (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            No visitor inquiries received yet. Messages sent via the public Contact form appear here.
          </p>
        ) : (
          <div className="divide-y divide-stone-200 dark:divide-stone-800 border-t border-stone-200 dark:border-stone-800">
            {inquiries.map((inq) => (
              <div key={inq.id} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {inq.name}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{inq.email}</span>
                    {inq.phone && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-num">{inq.phone}</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold">
                      {inq.status === 'unread' ? 'Unread' : 'Read'}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                    {inq.subject}
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {inq.message}
                  </p>
                </div>

                {inq.status === 'unread' && (
                  <button
                    type="button"
                    onClick={() => void markInquiryRead(inq.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 shrink-0 cursor-pointer"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reset to Default Data */}
      <div className="rounded-xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-stone-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            Reset CMS to Default Data
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Restore original J/Manipay Memorial English School notices, gallery photos, counters, and brand palette.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setConfirmResetOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Reset to Default Data</span>
        </button>
      </div>

      {confirmResetOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm CMS reset"
        >
          <div className="max-w-md w-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h4 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">
                  Reset all CMS data?
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                  This will replace all edited hero details, notices, gallery entries, and custom colors with the default school dataset.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-stone-300 dark:border-stone-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmReset()}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

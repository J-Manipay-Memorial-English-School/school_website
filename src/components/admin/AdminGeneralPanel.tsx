import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Save, Upload } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { HeritageConfig, HeroConfig } from '../../types/school';
import { SafeImage } from '../SafeImage';
import { SchoolCrest } from '../SchoolCrest';

export const AdminGeneralPanel: React.FC = () => {
  const { data, updateGeneralAndHero, resetSchoolLogo, uploadAdminImage, showToast } =
    useSchoolData();
  const [schoolLogoUrl, setSchoolLogoUrl] = useState<string>(data.schoolLogoUrl);
  const [hero, setHero] = useState<HeroConfig>(data.hero);
  const [heritage, setHeritage] = useState<HeritageConfig>(data.heritage);
  const [saving, setSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSchoolLogoUrl(data.schoolLogoUrl);
    setHero(data.hero);
    setHeritage(data.heritage);
  }, [data.schoolLogoUrl, data.hero, data.heritage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateGeneralAndHero({ schoolLogoUrl, hero, heritage });
    } catch {
      // Toast error handled in SchoolDataContext
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await uploadAdminImage(file, { maxDimension: 800, quality: 0.9 });
      setSchoolLogoUrl(dataUrl);
      showToast('Crest image uploaded. Click Save Changes to publish.');
    } catch (err) {
      if (err instanceof Error && err.name !== 'UnauthorizedError') {
        showToast(err.message || 'Unable to load crest image.', 'error');
      }
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await uploadAdminImage(file, { maxDimension: 1600, quality: 0.84 });
      setHero((prev) => ({ ...prev, bannerUrl: dataUrl }));
      showToast('School banner uploaded. Click Save Changes to publish.');
    } catch (err) {
      if (err instanceof Error && err.name !== 'UnauthorizedError') {
        showToast(err.message || 'Unable to load banner image.', 'error');
      }
    }
  };

  const handleResetLogo = async () => {
    try {
      const defaultUrl = await resetSchoolLogo();
      setSchoolLogoUrl(defaultUrl);
    } catch {
      // Toast error handled in SchoolDataContext
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
            General, Crest Identity & Heritage
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Manage the official School Crest logo, bilingual hero copy, school banner photo, history, vision, mission, motto, and school anthem.
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

      {/* School Crest / Logo Manager (File Upload Only) */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            School Crest / Logo
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Displayed in true, unmodified original colors inside a clean neutral badge across the Navbar, Hero, Motto Card, and Footer regardless of Dark/Light mode or Brand Theme color.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Light & Dark Neutral Backing Live Previews */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-stone-200 bg-[#FBF9F5] p-4 flex flex-col items-center justify-center gap-2">
              <SchoolCrest srcOverride={schoolLogoUrl} className="w-16 h-16" />
              <span className="text-[11px] font-medium text-stone-600">Light Header Preview</span>
            </div>
            <div className="rounded-xl border border-stone-700 bg-stone-950 p-4 flex flex-col items-center justify-center gap-2">
              <SchoolCrest srcOverride={schoolLogoUrl} className="w-16 h-16" />
              <span className="text-[11px] font-medium text-stone-300">Dark Footer Preview</span>
            </div>
          </div>

          {/* Direct File Upload & Reset */}
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Upload your school crest image directly from your computer or phone gallery (PNG, JPG, SVG, or WebP).
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => void handleLogoUpload(e)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span>Upload Crest / Choose File</span>
              </button>

              <button
                type="button"
                onClick={() => void handleResetLogo()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset to Default Logo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Editor */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
          Hero Banner & Headlines
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Hero Title (English)
                </label>
                <input
                  type="text"
                  value={hero.title.en}
                  onChange={(e) =>
                    setHero({ ...hero, title: { ...hero.title, en: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Hero Title (தமிழ்)
                </label>
                <input
                  type="text"
                  value={hero.title.ta}
                  onChange={(e) =>
                    setHero({ ...hero, title: { ...hero.title, ta: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Hero Subtitle (English)
                </label>
                <textarea
                  rows={3}
                  value={hero.subtitle.en}
                  onChange={(e) =>
                    setHero({ ...hero, subtitle: { ...hero.subtitle, en: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Hero Subtitle (தமிழ்)
                </label>
                <textarea
                  rows={3}
                  value={hero.subtitle.ta}
                  onChange={(e) =>
                    setHero({ ...hero, subtitle: { ...hero.subtitle, ta: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-2.5">
            <span className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
              School Hero Banner Photo
            </span>
            <div className="aspect-video rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
              <SafeImage src={hero.bannerUrl} alt="School banner preview" />
            </div>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => void handleBannerUpload(e)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Upload Image / Choose File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Heritage, Motto, Vision & Mission */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
          Identity, History, Vision & Mission
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Founded Year
            </label>
            <input
              type="text"
              value={heritage.foundedYear}
              onChange={(e) => setHeritage({ ...heritage, foundedYear: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Founded By (English)
            </label>
            <input
              type="text"
              value={heritage.foundedBy.en}
              onChange={(e) =>
                setHeritage({
                  ...heritage,
                  foundedBy: { ...heritage.foundedBy, en: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Founded By (தமிழ்)
            </label>
            <input
              type="text"
              value={heritage.foundedBy.ta}
              onChange={(e) =>
                setHeritage({
                  ...heritage,
                  foundedBy: { ...heritage.foundedBy, ta: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              School Motto (English)
            </label>
            <input
              type="text"
              value={heritage.motto.en}
              onChange={(e) =>
                setHeritage({ ...heritage, motto: { ...heritage.motto, en: e.target.value } })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              School Motto (தமிழ்)
            </label>
            <input
              type="text"
              value={heritage.motto.ta}
              onChange={(e) =>
                setHeritage({ ...heritage, motto: { ...heritage.motto, ta: e.target.value } })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Vision Statement (English)
            </label>
            <textarea
              rows={3}
              value={heritage.vision.en}
              onChange={(e) =>
                setHeritage({ ...heritage, vision: { ...heritage.vision, en: e.target.value } })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Vision Statement (தமிழ்)
            </label>
            <textarea
              rows={3}
              value={heritage.vision.ta}
              onChange={(e) =>
                setHeritage({ ...heritage, vision: { ...heritage.vision, ta: e.target.value } })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Mission Statement (English)
            </label>
            <textarea
              rows={3}
              value={heritage.mission.en}
              onChange={(e) =>
                setHeritage({ ...heritage, mission: { ...heritage.mission, en: e.target.value } })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Mission Statement (தமிழ்)
            </label>
            <textarea
              rows={3}
              value={heritage.mission.ta}
              onChange={(e) =>
                setHeritage({ ...heritage, mission: { ...heritage.mission, ta: e.target.value } })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              School History (English)
            </label>
            <textarea
              rows={4}
              value={heritage.history.en}
              onChange={(e) =>
                setHeritage({ ...heritage, history: { ...heritage.history, en: e.target.value } })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              School History (தமிழ்)
            </label>
            <textarea
              rows={4}
              value={heritage.history.ta}
              onChange={(e) =>
                setHeritage({ ...heritage, history: { ...heritage.history, ta: e.target.value } })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-200 dark:border-stone-800">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Anthem Verses (English — separate stanzas with blank line)
            </label>
            <textarea
              rows={6}
              value={heritage.anthemVerses.en.join('\n\n')}
              onChange={(e) =>
                setHeritage({
                  ...heritage,
                  anthemVerses: {
                    ...heritage.anthemVerses,
                    en: e.target.value.split(/\n\s*\n/).filter(Boolean),
                  },
                })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Anthem Verses (தமிழ் — இரு வரி இடைவெளியால் பிரிக்கவும்)
            </label>
            <textarea
              rows={6}
              value={heritage.anthemVerses.ta.join('\n\n')}
              onChange={(e) =>
                setHeritage({
                  ...heritage,
                  anthemVerses: {
                    ...heritage.anthemVerses,
                    ta: e.target.value.split(/\n\s*\n/).filter(Boolean),
                  },
                })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

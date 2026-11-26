import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { BilingualText, HeritageConfig, HeroConfig } from '../../types/school';
import {
  cleanBilingual,
  hasAnyText,
  normalizeLineBreaks,
  splitParagraphs,
} from '../../utils/schoolHelpers';
import { SafeImage } from '../SafeImage';
import { SchoolCrest } from '../SchoolCrest';

interface TickerRow {
  rowId: string;
  en: string;
  ta: string;
}

function toTickerRows(items: BilingualText[] | undefined): TickerRow[] {
  return (items || []).map((item, idx) => ({
    rowId: `tkr-${idx}-${Math.random().toString(36).slice(2, 7)}`,
    en: item?.en || '',
    ta: item?.ta || '',
  }));
}

export const AdminGeneralPanel: React.FC = () => {
  const {
    data,
    updateGeneralAndHero,
    resetSchoolLogo,
    uploadAdminImage,
    showToast,
  } = useSchoolData();

  const [schoolName, setSchoolName] = useState<BilingualText>(data.schoolName);
  const [shortName, setShortName] = useState<BilingualText>(data.shortName);
  const [schoolLogoUrl, setSchoolLogoUrl] = useState<string>(data.schoolLogoUrl);
  const [headerTickerLabel, setHeaderTickerLabel] = useState<BilingualText>(
    data.headerTickerLabel || { en: 'Bulletins', ta: 'முக்கிய செய்திகள்' }
  );
  const [tickerRows, setTickerRows] = useState<TickerRow[]>(() =>
    toTickerRows(data.tickerAnnouncements)
  );
  const [primaryAddress, setPrimaryAddress] = useState<BilingualText>(data.contact.address);
  const [schoolType, setSchoolType] = useState<BilingualText>(data.contact.schoolType);
  const [hero, setHero] = useState<HeroConfig>(data.hero);
  const [heritage, setHeritage] = useState<HeritageConfig>(data.heritage);
  const [anthemTextEn, setAnthemTextEn] = useState<string>(() =>
    (data.heritage.anthemVerses?.en || []).join('\n\n')
  );
  const [anthemTextTa, setAnthemTextTa] = useState<string>(() =>
    (data.heritage.anthemVerses?.ta || []).join('\n\n')
  );

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSchoolName(data.schoolName);
    setShortName(data.shortName);
    setSchoolLogoUrl(data.schoolLogoUrl);
    setHeaderTickerLabel(
      data.headerTickerLabel || { en: 'Bulletins', ta: 'முக்கிய செய்திகள்' }
    );
    setTickerRows(toTickerRows(data.tickerAnnouncements));
    setPrimaryAddress(data.contact.address);
    setSchoolType(data.contact.schoolType);
    setHero(data.hero);
    setHeritage(data.heritage);
    setAnthemTextEn((data.heritage.anthemVerses?.en || []).join('\n\n'));
    setAnthemTextTa((data.heritage.anthemVerses?.ta || []).join('\n\n'));
  }, [
    data.schoolName,
    data.shortName,
    data.schoolLogoUrl,
    data.headerTickerLabel,
    data.tickerAnnouncements,
    data.contact.address,
    data.contact.schoolType,
    data.hero,
    data.heritage,
  ]);

  const addTickerRow = () => {
    setTickerRows((prev) => [
      ...prev,
      { rowId: `tkr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, en: '', ta: '' },
    ]);
  };

  const updateTickerRow = (rowId: string, lang: 'en' | 'ta', value: string) => {
    setTickerRows((prev) =>
      prev.map((row) => (row.rowId === rowId ? { ...row, [lang]: value } : row))
    );
  };

  const moveTickerRow = (index: number, direction: 'up' | 'down') => {
    setTickerRows((prev) => {
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
  };

  const removeTickerRow = (rowId: string) => {
    setTickerRows((prev) => prev.filter((row) => row.rowId !== rowId));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAnyText(schoolName)) {
      showToast('Please enter the full school name in English or Tamil.', 'error');
      return;
    }

    const cleanedAnnouncements = tickerRows
      .filter((row) => row.en.trim() || row.ta.trim())
      .map((row) => cleanBilingual({ en: row.en, ta: row.ta }));

    setSaving(true);
    try {
      await updateGeneralAndHero({
        schoolName: cleanBilingual(schoolName),
        shortName: hasAnyText(shortName)
          ? cleanBilingual(shortName)
          : cleanBilingual(schoolName),
        schoolLogoUrl,
        headerTickerLabel: cleanBilingual(headerTickerLabel),
        tickerAnnouncements: cleanedAnnouncements,
        primaryAddress: cleanBilingual(primaryAddress),
        schoolType: cleanBilingual(schoolType),
        hero: {
          ...hero,
          eyebrow: cleanBilingual(hero.eyebrow),
          title: cleanBilingual(hero.title),
          subtitle: cleanBilingual(hero.subtitle),
          primaryCtaLabel: cleanBilingual(hero.primaryCtaLabel),
          secondaryCtaLabel: cleanBilingual(hero.secondaryCtaLabel),
        },
        heritage: {
          ...heritage,
          foundedYear: heritage.foundedYear.trim(),
          foundedBy: cleanBilingual(heritage.foundedBy),
          motto: cleanBilingual(heritage.motto),
          mottoExplanation: cleanBilingual(heritage.mottoExplanation),
          vision: cleanBilingual(heritage.vision),
          mission: cleanBilingual(heritage.mission),
          history: cleanBilingual(heritage.history),
          anthemTitle: cleanBilingual(heritage.anthemTitle),
          anthemVerses: {
            en: splitParagraphs(normalizeLineBreaks(anthemTextEn)),
            ta: splitParagraphs(normalizeLineBreaks(anthemTextTa)),
          },
        },
      });
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
    setUploadingLogo(true);
    try {
      const uploadedUrl = await uploadAdminImage(file, { maxDimension: 800, quality: 0.9 });
      setSchoolLogoUrl(uploadedUrl);
      showToast('Crest uploaded to Cloudinary. Click Save Changes to publish.');
    } catch (err) {
      if (err instanceof Error && err.name !== 'UnauthorizedError') {
        showToast(err.message || 'Unable to upload crest image.', 'error');
      }
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingBanner(true);
    try {
      const uploadedUrl = await uploadAdminImage(file, { maxDimension: 1600, quality: 0.84 });
      setHero((prev) => ({ ...prev, bannerUrl: uploadedUrl }));
      showToast('School banner uploaded to Cloudinary. Click Save Changes to publish.');
    } catch (err) {
      if (err instanceof Error && err.name !== 'UnauthorizedError') {
        showToast(err.message || 'Unable to upload banner image.', 'error');
      }
    } finally {
      setUploadingBanner(false);
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
            Identity, Header, Banner &amp; Heritage
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Manage the school name, navbar title, crest logo (via Cloudinary), announcement ticker, hero banner &amp; location tag, primary address, and school heritage. All changes save to Cloudflare KV.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shrink-0 cursor-pointer hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="w-4 h-4" aria-hidden="true" />
          )}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* 1. School Name, Navbar Title, Address & Classification */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            1. School Name, Navbar Identity &amp; Primary Location
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Displayed in the Header navbar, Browser tab title, Hero identity block, and Footer. Single-language input falls back automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Full School Name (English)
            </label>
            <input
              type="text"
              value={schoolName.en}
              onChange={(e) => setSchoolName({ ...schoolName, en: e.target.value })}
              placeholder="e.g., J/Manipay Memorial English School"
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Full School Name (தமிழ்)
            </label>
            <input
              type="text"
              value={schoolName.ta}
              onChange={(e) => setSchoolName({ ...schoolName, ta: e.target.value })}
              placeholder="உ-ம்: யா/மானிப்பாய் மெமோரியல் ஆங்கிலப் பாடசாலை"
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Navbar Compact Title (English)
            </label>
            <input
              type="text"
              value={shortName.en}
              onChange={(e) => setShortName({ ...shortName, en: e.target.value })}
              placeholder="e.g., J/Manipay Memorial"
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Navbar Compact Title (தமிழ்)
            </label>
            <input
              type="text"
              value={shortName.ta}
              onChange={(e) => setShortName({ ...shortName, ta: e.target.value })}
              placeholder="உ-ம்: யா/மானிப்பாய் மெமோரியல்"
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Primary Address / Location (English)
            </label>
            <textarea
              rows={2}
              value={primaryAddress.en}
              onChange={(e) => setPrimaryAddress({ ...primaryAddress, en: e.target.value })}
              placeholder="Memorial Lane, Manipay, Jaffna 40000, Sri Lanka"
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Primary Address / Location (தமிழ்)
            </label>
            <textarea
              rows={2}
              value={primaryAddress.ta}
              onChange={(e) => setPrimaryAddress({ ...primaryAddress, ta: e.target.value })}
              placeholder="மெமோரியல் லேன், மானிப்பாய், யாழ்ப்பாணம் 40000, இலங்கை"
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              School Classification / Type (English)
            </label>
            <input
              type="text"
              value={schoolType.en}
              onChange={(e) => setSchoolType({ ...schoolType, en: e.target.value })}
              placeholder="e.g., 1AC Provincial School · Mixed · Bilingual"
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              School Classification / Type (தமிழ்)
            </label>
            <input
              type="text"
              value={schoolType.ta}
              onChange={(e) => setSchoolType({ ...schoolType, ta: e.target.value })}
              placeholder="உ-ம்: 1AC மாகாணப் பாடசாலை · இருபாலர் · தமிழ் மற்றும் ஆங்கில மொழி"
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>
      </div>

      {/* 2. School Crest / Logo Manager (Cloudinary Upload) */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            2. School Crest / Logo
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
              Upload your school crest image directly from your computer or phone gallery (stored on Cloudinary via /api/upload).
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
                disabled={uploadingLogo}
                onClick={() => logoInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {uploadingLogo ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Upload className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{uploadingLogo ? 'Uploading Crest...' : 'Upload Crest / Choose File'}</span>
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

      {/* 3. Header Announcement Ticker */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              3. Top Header Announcement Ticker
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Add, edit, reorder, or remove scrolling bulletin announcements in the top bar. Leave empty to hide the ticker bar.
            </p>
          </div>
          <button
            type="button"
            onClick={addTickerRow}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 shrink-0"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add Announcement</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Ticker Badge Label (English)
            </label>
            <input
              type="text"
              value={headerTickerLabel.en}
              onChange={(e) =>
                setHeaderTickerLabel({ ...headerTickerLabel, en: e.target.value })
              }
              placeholder="e.g., Bulletins"
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Ticker Badge Label (தமிழ்)
            </label>
            <input
              type="text"
              value={headerTickerLabel.ta}
              onChange={(e) =>
                setHeaderTickerLabel({ ...headerTickerLabel, ta: e.target.value })
              }
              placeholder="உ-ம்: முக்கிய செய்திகள்"
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        {tickerRows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 dark:border-stone-700 p-4 text-center text-xs text-stone-500 dark:text-stone-400">
            No ticker announcements active. Click &ldquo;Add Announcement&rdquo; above to show the top scrolling ticker.
          </div>
        ) : (
          <div className="space-y-3">
            {tickerRows.map((row, index) => (
              <div
                key={row.rowId}
                className="rounded-lg border border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950/60 p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-num text-xs font-semibold text-stone-500 dark:text-stone-400">
                    Bulletin #{String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveTickerRow(index, 'up')}
                      className="p-1.5 rounded border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                      title="Move up"
                      aria-label="Move ticker item up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === tickerRows.length - 1}
                      onClick={() => moveTickerRow(index, 'down')}
                      className="p-1.5 rounded border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                      title="Move down"
                      aria-label="Move ticker item down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTickerRow(row.rowId)}
                      className="p-1.5 rounded border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                      title="Remove bulletin"
                      aria-label="Remove ticker item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={row.en}
                    onChange={(e) => updateTickerRow(row.rowId, 'en', e.target.value)}
                    placeholder="Announcement text (English)"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                  />
                  <input
                    type="text"
                    value={row.ta}
                    onChange={(e) => updateTickerRow(row.rowId, 'ta', e.target.value)}
                    placeholder="அறிவிப்பு வாசகம் (தமிழ்)"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Hero Banner, Location Tag, Headlines & CTA Buttons */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
          4. Hero Banner, Location / Established Tag &amp; Headlines
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Hero Location &amp; Established Tag (English)
                </label>
                <input
                  type="text"
                  value={hero.eyebrow.en}
                  onChange={(e) =>
                    setHero({ ...hero, eyebrow: { ...hero.eyebrow, en: e.target.value } })
                  }
                  placeholder="e.g., Memorial Lane, Manipay, Jaffna · Est. 1924"
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Hero Location &amp; Established Tag (தமிழ்)
                </label>
                <input
                  type="text"
                  value={hero.eyebrow.ta}
                  onChange={(e) =>
                    setHero({ ...hero, eyebrow: { ...hero.eyebrow, ta: e.target.value } })
                  }
                  placeholder="உ-ம்: மெமோரியல் லேன், மானிப்பாய், யாழ்ப்பாணம் · ஸ்தாபிக்கப்பட்டது 1924"
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Primary Button Label (English)
                </label>
                <input
                  type="text"
                  value={hero.primaryCtaLabel?.en || ''}
                  onChange={(e) =>
                    setHero({
                      ...hero,
                      primaryCtaLabel: {
                        en: e.target.value,
                        ta: hero.primaryCtaLabel?.ta || '',
                      },
                    })
                  }
                  placeholder="Explore Academics"
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Primary Button Label (தமிழ்)
                </label>
                <input
                  type="text"
                  value={hero.primaryCtaLabel?.ta || ''}
                  onChange={(e) =>
                    setHero({
                      ...hero,
                      primaryCtaLabel: {
                        en: hero.primaryCtaLabel?.en || '',
                        ta: e.target.value,
                      },
                    })
                  }
                  placeholder="கல்விப் பிரிவுகளைப் பார்க்க"
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Secondary Button Label (English)
                </label>
                <input
                  type="text"
                  value={hero.secondaryCtaLabel?.en || ''}
                  onChange={(e) =>
                    setHero({
                      ...hero,
                      secondaryCtaLabel: {
                        en: e.target.value,
                        ta: hero.secondaryCtaLabel?.ta || '',
                      },
                    })
                  }
                  placeholder="Contact & Location"
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Secondary Button Label (தமிழ்)
                </label>
                <input
                  type="text"
                  value={hero.secondaryCtaLabel?.ta || ''}
                  onChange={(e) =>
                    setHero({
                      ...hero,
                      secondaryCtaLabel: {
                        en: hero.secondaryCtaLabel?.en || '',
                        ta: e.target.value,
                      },
                    })
                  }
                  placeholder="தொடர்பு மற்றும் அமைவிடம்"
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-2.5">
            <span className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
              School Hero Banner Photo (Cloudinary)
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
              disabled={uploadingBanner}
              onClick={() => bannerInputRef.current?.click()}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer disabled:opacity-60"
            >
              {uploadingBanner ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{uploadingBanner ? 'Uploading Banner...' : 'Upload Image / Choose File'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Heritage, Motto, Vision & Mission */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
          5. Established Heritage, Motto, Vision, Mission &amp; School Anthem
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Established / Founded Year
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
              Motto Explanation (English)
            </label>
            <textarea
              rows={2}
              value={heritage.mottoExplanation.en}
              onChange={(e) =>
                setHeritage({
                  ...heritage,
                  mottoExplanation: { ...heritage.mottoExplanation, en: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Motto Explanation (தமிழ்)
            </label>
            <textarea
              rows={2}
              value={heritage.mottoExplanation.ta}
              onChange={(e) =>
                setHeritage({
                  ...heritage,
                  mottoExplanation: { ...heritage.mottoExplanation, ta: e.target.value },
                })
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
              School Anthem Title (English)
            </label>
            <input
              type="text"
              value={heritage.anthemTitle.en}
              onChange={(e) =>
                setHeritage({
                  ...heritage,
                  anthemTitle: { ...heritage.anthemTitle, en: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              School Anthem Title (தமிழ்)
            </label>
            <input
              type="text"
              value={heritage.anthemTitle.ta}
              onChange={(e) =>
                setHeritage({
                  ...heritage,
                  anthemTitle: { ...heritage.anthemTitle, ta: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Anthem Verses (English — separate stanzas with blank line)
            </label>
            <textarea
              rows={6}
              value={anthemTextEn}
              onChange={(e) => setAnthemTextEn(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Anthem Verses (தமிழ் — இரு வரி இடைவெளியால் பிரிக்கவும்)
            </label>
            <textarea
              rows={6}
              value={anthemTextTa}
              onChange={(e) => setAnthemTextTa(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="w-4 h-4" aria-hidden="true" />
          )}
          <span>{saving ? 'Saving...' : 'Save All Identity, Banner & Heritage Changes'}</span>
        </button>
      </div>
    </form>
  );
};

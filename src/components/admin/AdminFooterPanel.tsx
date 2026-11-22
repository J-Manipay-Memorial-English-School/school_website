import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Edit2,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  BilingualText,
  FooterColumn,
  FooterLinkItem,
  FooterLinkType,
  PublicTab,
} from '../../types/school';
import { cleanBilingual, hasAnyText, pickText } from '../../utils/schoolHelpers';

const PUBLIC_TAB_OPTIONS: { value: PublicTab; label: string }[] = [
  { value: 'home', label: 'Home Hub' },
  { value: 'heritage', label: 'Heritage & Vision' },
  { value: 'academics', label: 'Academics & Pathways' },
  { value: 'staff', label: 'Academic Staff' },
  { value: 'formerPrincipals', label: 'Former Principals' },
  { value: 'examResults', label: 'Exam Results' },
  { value: 'notices', label: 'Notices & Circulars' },
  { value: 'achievements', label: 'Honours & Achievements' },
  { value: 'gallery', label: 'Event Gallery' },
  { value: 'contact', label: 'Contact & School Location' },
];

export const AdminFooterPanel: React.FC = () => {
  const { data, updateFooterConfig, showToast } = useSchoolData();

  // Brand summary & bottom copyright bar state
  const [description, setDescription] = useState<BilingualText>(data.footer.description);
  const [showSocialLinks, setShowSocialLinks] = useState<boolean>(
    data.footer.showSocialLinks !== false
  );
  const [copyrightText, setCopyrightText] = useState<BilingualText>(
    data.footer.copyrightText
  );
  const [showYearPrefix, setShowYearPrefix] = useState<boolean>(
    data.footer.showYearPrefix !== false
  );
  const [adminPortalLabel, setAdminPortalLabel] = useState<BilingualText>(
    data.footer.adminPortalLabel
  );
  const [savingSettings, setSavingSettings] = useState(false);

  // Column editor state
  const [editingColumn, setEditingColumn] = useState<FooterColumn | null>(null);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [savingColumn, setSavingColumn] = useState(false);

  // Link editor state (scoped by targetColumnId)
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<FooterLinkItem | null>(null);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [savingLink, setSavingLink] = useState(false);

  useEffect(() => {
    setDescription(data.footer.description);
    setShowSocialLinks(data.footer.showSocialLinks !== false);
    setCopyrightText(data.footer.copyrightText);
    setShowYearPrefix(data.footer.showYearPrefix !== false);
    setAdminPortalLabel(data.footer.adminPortalLabel);
  }, [data.footer]);

  const columns = data.footer.columns || [];

  // --- General Footer Settings Save ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateFooterConfig({
        ...data.footer,
        description: cleanBilingual(description),
        showSocialLinks,
        copyrightText: cleanBilingual(copyrightText),
        showYearPrefix,
        adminPortalLabel: cleanBilingual(adminPortalLabel),
      });
    } catch {
      // Toast handled in SchoolDataContext
    } finally {
      setSavingSettings(false);
    }
  };

  // --- Footer Column Handlers ---
  const startCreateColumn = () => {
    setIsCreatingColumn(true);
    setEditingColumn({
      id: `fcol-${Date.now()}`,
      title: { en: '', ta: '' },
      layout: 'one-col',
      links: [],
    });
  };

  const handleSaveColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingColumn) return;

    if (!hasAnyText(editingColumn.title)) {
      showToast('Please enter a column title in English or Tamil.', 'error');
      return;
    }

    const cleanedCol: FooterColumn = {
      id: editingColumn.id,
      title: cleanBilingual(editingColumn.title),
      layout: editingColumn.layout === 'two-col' ? 'two-col' : 'one-col',
      links: editingColumn.links || [],
    };

    const nextColumns = isCreatingColumn
      ? [...columns, cleanedCol]
      : columns.map((col) => (col.id === cleanedCol.id ? cleanedCol : col));

    setSavingColumn(true);
    try {
      await updateFooterConfig({ ...data.footer, columns: nextColumns });
      setEditingColumn(null);
      setIsCreatingColumn(false);
    } catch {
      // Toast handled in SchoolDataContext
    } finally {
      setSavingColumn(false);
    }
  };

  const handleReorderColumn = async (id: string, direction: 'up' | 'down') => {
    const list = [...columns];
    const idx = list.findIndex((col) => col.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);

    try {
      await updateFooterConfig({ ...data.footer, columns: list });
    } catch {
      // Toast handled in SchoolDataContext
    }
  };

  const handleDeleteColumn = async (id: string) => {
    const nextColumns = columns.filter((col) => col.id !== id);
    try {
      await updateFooterConfig({ ...data.footer, columns: nextColumns });
      if (editingColumn?.id === id) {
        setEditingColumn(null);
        setIsCreatingColumn(false);
      }
      if (targetColumnId === id) {
        setTargetColumnId(null);
        setEditingLink(null);
      }
    } catch {
      // Toast handled in SchoolDataContext
    }
  };

  // --- Footer Link / Item Handlers ---
  const startCreateLink = (colId: string) => {
    setTargetColumnId(colId);
    setIsCreatingLink(true);
    setEditingLink({
      id: `flink-${Date.now()}`,
      label: { en: '', ta: '' },
      linkType: 'tab',
      tab: 'home',
      url: '',
    });
  };

  const startEditLink = (colId: string, item: FooterLinkItem) => {
    setTargetColumnId(colId);
    setIsCreatingLink(false);
    setEditingLink({ ...item });
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetColumnId || !editingLink) return;

    if (!hasAnyText(editingLink.label)) {
      showToast('Please enter the item label in English or Tamil.', 'error');
      return;
    }

    if (editingLink.linkType === 'url' && !editingLink.url?.trim()) {
      showToast('Please enter the destination URL (or tel:/mailto: link).', 'error');
      return;
    }

    const cleanedLink: FooterLinkItem = {
      id: editingLink.id,
      label: cleanBilingual(editingLink.label),
      linkType: editingLink.linkType,
      tab: editingLink.linkType === 'tab' ? editingLink.tab || 'home' : undefined,
      url: editingLink.linkType === 'url' ? editingLink.url?.trim() || '' : undefined,
    };

    const nextColumns = columns.map((col) => {
      if (col.id !== targetColumnId) return col;
      const nextLinks = isCreatingLink
        ? [...col.links, cleanedLink]
        : col.links.map((item) => (item.id === cleanedLink.id ? cleanedLink : item));
      return { ...col, links: nextLinks };
    });

    setSavingLink(true);
    try {
      await updateFooterConfig({ ...data.footer, columns: nextColumns });
      setEditingLink(null);
      setTargetColumnId(null);
      setIsCreatingLink(false);
    } catch {
      // Toast handled in SchoolDataContext
    } finally {
      setSavingLink(false);
    }
  };

  const handleReorderLink = async (
    colId: string,
    linkId: string,
    direction: 'up' | 'down'
  ) => {
    const nextColumns = columns.map((col) => {
      if (col.id !== colId) return col;
      const list = [...col.links];
      const idx = list.findIndex((l) => l.id === linkId);
      if (idx === -1) return col;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return col;
      const [moved] = list.splice(idx, 1);
      list.splice(targetIdx, 0, moved);
      return { ...col, links: list };
    });

    try {
      await updateFooterConfig({ ...data.footer, columns: nextColumns });
    } catch {
      // Toast handled in SchoolDataContext
    }
  };

  const handleDeleteLink = async (colId: string, linkId: string) => {
    const nextColumns = columns.map((col) => {
      if (col.id !== colId) return col;
      return { ...col, links: col.links.filter((l) => l.id !== linkId) };
    });

    try {
      await updateFooterConfig({ ...data.footer, columns: nextColumns });
      if (editingLink?.id === linkId) {
        setEditingLink(null);
        setTargetColumnId(null);
      }
    } catch {
      // Toast handled in SchoolDataContext
    }
  };

  const handleImportContactDetails = async (colId: string) => {
    const imported: FooterLinkItem[] = [];
    if (hasAnyText(data.contact.address)) {
      imported.push({
        id: `fi-addr-${Date.now()}`,
        label: cleanBilingual(data.contact.address),
        linkType: 'text',
      });
    }
    if (data.contact.phone?.trim()) {
      imported.push({
        id: `fi-phone-${Date.now() + 1}`,
        label: { en: data.contact.phone.trim(), ta: data.contact.phone.trim() },
        linkType: 'url',
        url: `tel:${data.contact.phone.replace(/[^+\d]/g, '')}`,
      });
    }
    if (data.contact.email?.trim()) {
      imported.push({
        id: `fi-email-${Date.now() + 2}`,
        label: { en: data.contact.email.trim(), ta: data.contact.email.trim() },
        linkType: 'url',
        url: `mailto:${data.contact.email.trim()}`,
      });
    }
    if (hasAnyText(data.contact.schoolType)) {
      imported.push({
        id: `fi-type-${Date.now() + 3}`,
        label: cleanBilingual(data.contact.schoolType),
        linkType: 'text',
      });
    }

    if (imported.length === 0) {
      showToast('No contact details found to import.', 'info');
      return;
    }

    const nextColumns = columns.map((col) =>
      col.id === colId ? { ...col, links: imported } : col
    );

    try {
      await updateFooterConfig({ ...data.footer, columns: nextColumns });
    } catch {
      // Toast handled in SchoolDataContext
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
          Footer Layout, Columns &amp; Copyright Manager
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Edit the footer school description, toggle social links, manage footer columns and links (portal tabs, external URLs, tel/mailto, or text lines), and update the copyright bar. All changes persist in Cloudflare KV.
        </p>
      </div>

      {/* 1. Brand Summary & Copyright Bar */}
      <form
        onSubmit={handleSaveSettings}
        className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              1. Brand Summary, Copyright &amp; Bottom Bar
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              The footer crest and school name automatically sync from General Identity settings.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingSettings}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-60 shrink-0"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            {savingSettings ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{savingSettings ? 'Saving...' : 'Save Footer Settings'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Footer Brand Description (English)
            </label>
            <textarea
              rows={3}
              value={description.en}
              onChange={(e) => setDescription({ ...description, en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Footer Brand Description (தமிழ்)
            </label>
            <textarea
              rows={3}
              value={description.ta}
              onChange={(e) => setDescription({ ...description, ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Copyright Text (English)
            </label>
            <input
              type="text"
              value={copyrightText.en}
              onChange={(e) => setCopyrightText({ ...copyrightText, en: e.target.value })}
              placeholder="e.g., J/Manipay Memorial English School. All rights reserved."
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Copyright Text (தமிழ்)
            </label>
            <input
              type="text"
              value={copyrightText.ta}
              onChange={(e) => setCopyrightText({ ...copyrightText, ta: e.target.value })}
              placeholder="உ-ம்: யா/மானிப்பாய் மெமோரியல் ஆங்கிலப் பாடசாலை. அனைத்து உரிமைகளும்..."
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Admin Portal Button Label (English)
            </label>
            <input
              type="text"
              value={adminPortalLabel.en}
              onChange={(e) =>
                setAdminPortalLabel({ ...adminPortalLabel, en: e.target.value })
              }
              placeholder="Admin Portal"
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Admin Portal Button Label (தமிழ்)
            </label>
            <input
              type="text"
              value={adminPortalLabel.ta}
              onChange={(e) =>
                setAdminPortalLabel({ ...adminPortalLabel, ta: e.target.value })
              }
              placeholder="நிர்வாகப் பக்கம்"
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="inline-flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showYearPrefix}
              onChange={(e) => setShowYearPrefix(e.target.checked)}
              className="rounded border-stone-300 text-[var(--brand-primary)]"
            />
            <span>Prefix copyright with current year (&copy; {new Date().getFullYear()})</span>
          </label>

          <label className="inline-flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showSocialLinks}
              onChange={(e) => setShowSocialLinks(e.target.checked)}
              className="rounded border-stone-300 text-[var(--brand-primary)]"
            />
            <span>Show Social &amp; Quick Links from Contact Manager in Footer</span>
          </label>
        </div>
      </form>

      {/* 2. Footer Columns & Links Manager */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              2. Footer Columns &amp; Links
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Add, rename, reorder, or remove columns and manage links inside each column.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreateColumn}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white cursor-pointer hover:opacity-90 shrink-0"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add Footer Column</span>
          </button>
        </div>

        {editingColumn && (
          <form
            onSubmit={handleSaveColumn}
            className="rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 p-4 sm:p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {isCreatingColumn ? 'Add Footer Column' : 'Edit Footer Column'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setEditingColumn(null);
                  setIsCreatingColumn(false);
                }}
                className="p-1 rounded-lg text-stone-500 hover:bg-stone-200/70 dark:hover:bg-stone-800 cursor-pointer"
                aria-label="Close column editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Column Title (English)
                </label>
                <input
                  type="text"
                  value={editingColumn.title.en}
                  onChange={(e) =>
                    setEditingColumn({
                      ...editingColumn,
                      title: { ...editingColumn.title, en: e.target.value },
                    })
                  }
                  placeholder="e.g., Quick Links"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Column Title (தமிழ்)
                </label>
                <input
                  type="text"
                  value={editingColumn.title.ta}
                  onChange={(e) =>
                    setEditingColumn({
                      ...editingColumn,
                      title: { ...editingColumn.title, ta: e.target.value },
                    })
                  }
                  placeholder="உ-ம்: விரைவு இணைப்புகள்"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Link List Layout
                </label>
                <select
                  value={editingColumn.layout || 'one-col'}
                  onChange={(e) =>
                    setEditingColumn({
                      ...editingColumn,
                      layout: e.target.value === 'two-col' ? 'two-col' : 'one-col',
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                >
                  <option value="one-col">Single Column List</option>
                  <option value="two-col">Compact Two-Column Grid</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingColumn(null);
                  setIsCreatingColumn(false);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-stone-300 dark:border-stone-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingColumn}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {savingColumn && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isCreatingColumn ? 'Add Column' : 'Save Column'}</span>
              </button>
            </div>
          </form>
        )}

        {columns.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 dark:border-stone-700 p-6 text-center text-sm text-stone-500 dark:text-stone-400">
            No footer columns configured. Click &ldquo;Add Footer Column&rdquo; to create navigation or school details columns.
          </div>
        ) : (
          <div className="space-y-5">
            {columns.map((col, colIdx) => {
              const isEditingThisColLink = targetColumnId === col.id && editingLink !== null;
              return (
                <div
                  key={col.id}
                  className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950/60 p-4 sm:p-5 space-y-4"
                >
                  {/* Column Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono-num text-xs font-semibold text-stone-400">
                          Col #{String(colIdx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {pickText(col.title, 'en')}
                        </h4>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {col.layout === 'two-col' ? '2-column grid' : '1-column list'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {col.links.length} {col.links.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => void handleImportContactDetails(col.id)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                        title="Replace items in this column with current Contact Address, Phone, Email & Type"
                      >
                        Import Contact Info
                      </button>
                      <button
                        type="button"
                        onClick={() => startCreateLink(col.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white cursor-pointer hover:opacity-90"
                        style={{ backgroundColor: 'var(--brand-primary)' }}
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Add Item</span>
                      </button>
                      <button
                        type="button"
                        disabled={colIdx === 0}
                        onClick={() => void handleReorderColumn(col.id, 'up')}
                        className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                        title="Move column up / left"
                        aria-label="Move column up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={colIdx === columns.length - 1}
                        onClick={() => void handleReorderColumn(col.id, 'down')}
                        className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                        title="Move column down / right"
                        aria-label="Move column down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingColumn(false);
                          setEditingColumn(col);
                        }}
                        className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                        title="Edit column"
                        aria-label="Edit column"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteColumn(col.id)}
                        className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                        title="Delete column"
                        aria-label="Delete column"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Link / Item Editor inside this Column */}
                  {isEditingThisColLink && editingLink && (
                    <form
                      onSubmit={handleSaveLink}
                      className="rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-4 space-y-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-200">
                          {isCreatingLink ? 'Add Footer Link / Line' : 'Edit Footer Link / Line'}
                        </h5>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLink(null);
                            setTargetColumnId(null);
                          }}
                          className="p-1 rounded text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                          aria-label="Cancel link editing"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                            Item Label (English)
                          </label>
                          <input
                            type="text"
                            value={editingLink.label.en}
                            onChange={(e) =>
                              setEditingLink({
                                ...editingLink,
                                label: { ...editingLink.label, en: e.target.value },
                              })
                            }
                            placeholder="e.g., Exam Results"
                            className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                            Item Label (தமிழ்)
                          </label>
                          <input
                            type="text"
                            value={editingLink.label.ta}
                            onChange={(e) =>
                              setEditingLink({
                                ...editingLink,
                                label: { ...editingLink.label, ta: e.target.value },
                              })
                            }
                            placeholder="உ-ம்: தேர்வு பெறுபேறுகள்"
                            className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                            Action Type
                          </label>
                          <select
                            value={editingLink.linkType}
                            onChange={(e) =>
                              setEditingLink({
                                ...editingLink,
                                linkType: e.target.value as FooterLinkType,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                          >
                            <option value="tab">Navigate to Portal Page / Tab</option>
                            <option value="url">External URL / tel: / mailto:</option>
                            <option value="text">Plain Text Info Line (No Link)</option>
                          </select>
                        </div>

                        {editingLink.linkType === 'tab' && (
                          <div>
                            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                              Target Portal Section
                            </label>
                            <select
                              value={editingLink.tab || 'home'}
                              onChange={(e) =>
                                setEditingLink({
                                  ...editingLink,
                                  tab: e.target.value as PublicTab,
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                            >
                              {PUBLIC_TAB_OPTIONS.map((t) => (
                                <option key={t.value} value={t.value}>
                                  {t.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {editingLink.linkType === 'url' && (
                          <div>
                            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                              Target URL
                            </label>
                            <input
                              type="text"
                              value={editingLink.url || ''}
                              onChange={(e) =>
                                setEditingLink({ ...editingLink, url: e.target.value })
                              }
                              placeholder="https://... or tel:+94... or mailto:..."
                              className="w-full px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLink(null);
                            setTargetColumnId(null);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-300 dark:border-stone-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={savingLink}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-60"
                          style={{ backgroundColor: 'var(--brand-primary)' }}
                        >
                          {savingLink && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>{isCreatingLink ? 'Add Item' : 'Save Item'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Column Links List */}
                  {col.links.length === 0 ? (
                    <p className="text-xs text-stone-500 dark:text-stone-400 italic py-2">
                      No items in this column yet. Click &ldquo;Add Item&rdquo; above.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {col.links.map((item, linkIdx) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3.5 py-2.5"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-mono-num font-bold uppercase px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                                {item.linkType === 'tab'
                                  ? `tab:${item.tab || 'home'}`
                                  : item.linkType}
                              </span>
                              <span className="text-xs sm:text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                                {pickText(item.label, 'en')}
                              </span>
                            </div>
                            {item.linkType === 'url' && item.url && (
                              <p className="text-[11px] font-mono-num text-stone-500 dark:text-stone-400 truncate mt-0.5">
                                {item.url}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              disabled={linkIdx === 0}
                              onClick={() => void handleReorderLink(col.id, item.id, 'up')}
                              className="p-1.5 rounded border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                              title="Move up"
                              aria-label="Move footer item up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={linkIdx === col.links.length - 1}
                              onClick={() => void handleReorderLink(col.id, item.id, 'down')}
                              className="p-1.5 rounded border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                              title="Move down"
                              aria-label="Move footer item down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => startEditLink(col.id, item)}
                              className="p-1.5 rounded border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                              title="Edit item"
                              aria-label="Edit footer item"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteLink(col.id, item.id)}
                              className="p-1.5 rounded border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                              title="Delete item"
                              aria-label="Delete footer item"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

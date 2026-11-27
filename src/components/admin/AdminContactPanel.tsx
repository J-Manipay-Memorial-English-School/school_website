import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Edit2,
  ExternalLink,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  BilingualText,
  ContactDetailItem,
  ContactItemType,
  SocialPlatform,
  SocialQuickLink,
} from '../../types/school';
import { cleanBilingual, hasAnyText, pickText } from '../../utils/schoolHelpers';

const CONTACT_ITEM_TYPES: { value: ContactItemType; label: string }[] = [
  { value: 'address', label: 'Address / Location' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'email', label: 'Email Address' },
  { value: 'hours', label: 'Office Hours' },
  { value: 'website', label: 'Website / Portal' },
  { value: 'social', label: 'Social Handle / Channel' },
  { value: 'other', label: 'Other Detail' },
];

const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'website', label: 'Website' },
  { value: 'email', label: 'Email' },
  { value: 'other', label: 'Other Link' },
];

function extractIframeSrc(rawInput: string): string {
  const trimmed = rawInput.trim();
  const match = trimmed.match(/src=["']([^"']+)["']/i);
  return match?.[1] ? match[1].trim() : trimmed;
}

export const AdminContactPanel: React.FC = () => {
  const { data, updateContactInfo, showToast } = useSchoolData();

  // Section header & map state
  const [kicker, setKicker] = useState<BilingualText>(
    data.contact.kicker || { en: '', ta: '' }
  );
  const [heading, setHeading] = useState<BilingualText>(
    data.contact.heading || { en: '', ta: '' }
  );
  const [subtitle, setSubtitle] = useState<BilingualText>(
    data.contact.subtitle || { en: '', ta: '' }
  );
  const [schoolType, setSchoolType] = useState<BilingualText>(data.contact.schoolType);
  const [mapEmbedUrl, setMapEmbedUrl] = useState<string>(data.contact.mapEmbedUrl || '');
  const [mapTitle, setMapTitle] = useState<BilingualText>(
    data.contact.mapTitle || { en: '', ta: '' }
  );
  const [savingHeader, setSavingHeader] = useState(false);

  // Contact items form state
  const [editingItem, setEditingItem] = useState<ContactDetailItem | null>(null);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [savingItem, setSavingItem] = useState(false);

  // Social / quick links form state
  const [editingSocial, setEditingSocial] = useState<SocialQuickLink | null>(null);
  const [isCreatingSocial, setIsCreatingSocial] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);

  useEffect(() => {
    setKicker(data.contact.kicker || { en: '', ta: '' });
    setHeading(data.contact.heading || { en: '', ta: '' });
    setSubtitle(data.contact.subtitle || { en: '', ta: '' });
    setSchoolType(data.contact.schoolType);
    setMapEmbedUrl(data.contact.mapEmbedUrl || '');
    setMapTitle(data.contact.mapTitle || { en: '', ta: '' });
  }, [data.contact]);

  const contactItems = data.contact.items || [];
  const socialLinks = data.contact.socialLinks || [];

  // --- Header & Map Save ---
  const handleSaveHeaderAndMap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAnyText(heading)) {
      showToast('Please enter the Contact section heading in English or Tamil.', 'error');
      return;
    }

    setSavingHeader(true);
    try {
      await updateContactInfo({
        ...data.contact,
        kicker: cleanBilingual(kicker),
        heading: cleanBilingual(heading),
        subtitle: cleanBilingual(subtitle),
        schoolType: cleanBilingual(schoolType),
        mapEmbedUrl: extractIframeSrc(mapEmbedUrl),
        mapTitle: cleanBilingual(mapTitle),
      });
    } catch {
      // Toast handled in SchoolDataContext
    } finally {
      setSavingHeader(false);
    }
  };

  // --- Contact Detail Items Handlers ---
  const startCreateItem = () => {
    setIsCreatingItem(true);
    setEditingItem({
      id: `cnt-${Date.now()}`,
      type: 'phone',
      label: { en: '', ta: '' },
      value: { en: '', ta: '' },
      href: '',
    });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!hasAnyText(editingItem.label) || !hasAnyText(editingItem.value)) {
      showToast('Please enter both the contact label and value in English or Tamil.', 'error');
      return;
    }

    const cleanedItem: ContactDetailItem = {
      id: editingItem.id,
      type: editingItem.type,
      label: cleanBilingual(editingItem.label),
      value: cleanBilingual(editingItem.value),
      href: editingItem.href?.trim() || undefined,
    };

    const nextItems = isCreatingItem
      ? [...contactItems, cleanedItem]
      : contactItems.map((item) => (item.id === cleanedItem.id ? cleanedItem : item));

    setSavingItem(true);
    try {
      await updateContactInfo({
        ...data.contact,
        items: nextItems,
      });
      setEditingItem(null);
      setIsCreatingItem(false);
    } catch {
      // Toast handled in SchoolDataContext
    } finally {
      setSavingItem(false);
    }
  };

  const handleReorderItem = async (id: string, direction: 'up' | 'down') => {
    const list = [...contactItems];
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);

    try {
      await updateContactInfo({ ...data.contact, items: list });
    } catch {
      // Toast handled in SchoolDataContext
    }
  };

  const handleDeleteItem = async (id: string) => {
    const nextItems = contactItems.filter((item) => item.id !== id);
    try {
      await updateContactInfo({ ...data.contact, items: nextItems });
      if (editingItem?.id === id) {
        setEditingItem(null);
        setIsCreatingItem(false);
      }
    } catch {
      // Toast handled in SchoolDataContext
    }
  };

  // --- Social & Quick Links Handlers ---
  const startCreateSocial = () => {
    setIsCreatingSocial(true);
    setEditingSocial({
      id: `soc-${Date.now()}`,
      platform: 'facebook',
      label: { en: '', ta: '' },
      url: '',
    });
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocial) return;

    if (!editingSocial.url.trim()) {
      showToast('Please enter a valid URL or link destination.', 'error');
      return;
    }

    const cleanedSocial: SocialQuickLink = {
      id: editingSocial.id,
      platform: editingSocial.platform,
      label: hasAnyText(editingSocial.label)
        ? cleanBilingual(editingSocial.label)
        : { en: editingSocial.platform, ta: '' },
      url: editingSocial.url.trim(),
    };

    const nextLinks = isCreatingSocial
      ? [...socialLinks, cleanedSocial]
      : socialLinks.map((link) => (link.id === cleanedSocial.id ? cleanedSocial : link));

    setSavingSocial(true);
    try {
      await updateContactInfo({
        ...data.contact,
        socialLinks: nextLinks,
      });
      setEditingSocial(null);
      setIsCreatingSocial(false);
    } catch {
      // Toast handled in SchoolDataContext
    } finally {
      setSavingSocial(false);
    }
  };

  const handleReorderSocial = async (id: string, direction: 'up' | 'down') => {
    const list = [...socialLinks];
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);

    try {
      await updateContactInfo({ ...data.contact, socialLinks: list });
    } catch {
      // Toast handled in SchoolDataContext
    }
  };

  const handleDeleteSocial = async (id: string) => {
    const nextLinks = socialLinks.filter((link) => link.id !== id);
    try {
      await updateContactInfo({ ...data.contact, socialLinks: nextLinks });
      if (editingSocial?.id === id) {
        setEditingSocial(null);
        setIsCreatingSocial(false);
      }
    } catch {
      // Toast handled in SchoolDataContext
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
          Contact &amp; Location Manager
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Customize the Contact section headings, add/reorder/remove phone numbers, emails, addresses, office hours, social &amp; quick links, and the embedded map. All changes persist in Cloudflare KV.
        </p>
      </div>

      {/* 1. Section Header & Map Settings */}
      <form
        onSubmit={handleSaveHeaderAndMap}
        className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              1. Section Header, Classification &amp; Location Map
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Paste a Google Maps embed URL or full &lt;iframe&gt; snippet—the embed URL is extracted automatically.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingHeader}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-60 shrink-0"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            {savingHeader ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{savingHeader ? 'Saving...' : 'Save Header & Map'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Section Kicker / Eyebrow (English)
            </label>
            <input
              type="text"
              value={kicker.en}
              onChange={(e) => setKicker({ ...kicker, en: e.target.value })}
              placeholder="e.g., Visit & Connect"
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Section Kicker / Eyebrow (தமிழ்)
            </label>
            <input
              type="text"
              value={kicker.ta}
              onChange={(e) => setKicker({ ...kicker, ta: e.target.value })}
              placeholder="உ-ம்: வருகை மற்றும் தொடர்பு"
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Main Heading (English)
            </label>
            <input
              type="text"
              value={heading.en}
              onChange={(e) => setHeading({ ...heading, en: e.target.value })}
              placeholder="e.g., Contact & School Location"
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Main Heading (தமிழ்)
            </label>
            <input
              type="text"
              value={heading.ta}
              onChange={(e) => setHeading({ ...heading, ta: e.target.value })}
              placeholder="உ-ம்: தொடர்புகள் மற்றும் பாடசாலை அமைவிடம்"
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Subtitle / Description (English)
            </label>
            <textarea
              rows={2}
              value={subtitle.en}
              onChange={(e) => setSubtitle({ ...subtitle, en: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Subtitle / Description (தமிழ்)
            </label>
            <textarea
              rows={2}
              value={subtitle.ta}
              onChange={(e) => setSubtitle({ ...subtitle, ta: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              School Classification / Type (English)
            </label>
            <input
              type="text"
              value={schoolType.en}
              onChange={(e) => setSchoolType({ ...schoolType, en: e.target.value })}
              placeholder="e.g., 1C Provincial School · Mixed · Medium of Instruction: Tamil"
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
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
              placeholder="உ-ம்: 1C மாகாணப் பாடசாலை · இருபாலர் · மொழி மூலம்: தமிழ்"
              className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Google Maps Embed URL (leave blank to hide map)
            </label>
            <input
              type="text"
              value={mapEmbedUrl}
              onChange={(e) => setMapEmbedUrl(extractIframeSrc(e.target.value))}
              placeholder="https://maps.google.com/maps?q=Manipay,+Jaffna..."
              className="w-full px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Map Accessibility Title (English)
              </label>
              <input
                type="text"
                value={mapTitle.en}
                onChange={(e) => setMapTitle({ ...mapTitle, en: e.target.value })}
                placeholder="e.g., School Location Map — Manipay, Jaffna"
                className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Map Accessibility Title (தமிழ்)
              </label>
              <input
                type="text"
                value={mapTitle.ta}
                onChange={(e) => setMapTitle({ ...mapTitle, ta: e.target.value })}
                placeholder="உ-ம்: பாடசாலை வரைபடம் — மானிப்பாய், யாழ்ப்பாணம்"
                className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950"
              />
            </div>
          </div>
        </div>
      </form>

      {/* 2. Dynamic Contact Cards Manager */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              2. Contact Cards (Addresses, Phones, Emails, Hours &amp; Custom Items)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Add multiple phone numbers, emails, office hours, or custom contact cards. Reorder or remove any item.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreateItem}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white cursor-pointer hover:opacity-90 shrink-0"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add Contact Item</span>
          </button>
        </div>

        {editingItem && (
          <form
            onSubmit={handleSaveItem}
            className="rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 p-4 sm:p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {isCreatingItem ? 'Add Contact Item' : 'Edit Contact Item'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setIsCreatingItem(false);
                }}
                className="p-1 rounded-lg text-stone-500 hover:bg-stone-200/70 dark:hover:bg-stone-800 cursor-pointer"
                aria-label="Close contact item editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Item Type / Icon
                </label>
                <select
                  value={editingItem.type}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      type: e.target.value as ContactItemType,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                >
                  {CONTACT_ITEM_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Optional Custom Link (tel:, mailto:, or https://)
                </label>
                <input
                  type="text"
                  value={editingItem.href || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, href: e.target.value })
                  }
                  placeholder="Leave blank to auto-link phones, emails & websites"
                  className="w-full px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Card Label (English)
                </label>
                <input
                  type="text"
                  value={editingItem.label.en}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      label: { ...editingItem.label, en: e.target.value },
                    })
                  }
                  placeholder="e.g., Principal Office Phone"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Card Label (தமிழ்)
                </label>
                <input
                  type="text"
                  value={editingItem.label.ta}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      label: { ...editingItem.label, ta: e.target.value },
                    })
                  }
                  placeholder="உ-ம்: அதிபர் அலுவலக தொலைபேசி"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Display Value (English)
                </label>
                {editingItem.type === 'address' ||
                editingItem.type === 'hours' ||
                editingItem.type === 'other' ? (
                  <textarea
                    rows={2}
                    value={editingItem.value.en}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        value: { ...editingItem.value, en: e.target.value },
                      })
                    }
                    placeholder="e.g., Memorial Lane, Manipay, Jaffna"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                ) : (
                  <input
                    type="text"
                    value={editingItem.value.en}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        value: { ...editingItem.value, en: e.target.value },
                      })
                    }
                    placeholder="e.g., +94 21 225 5412"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Display Value (தமிழ் — optional if same)
                </label>
                {editingItem.type === 'address' ||
                editingItem.type === 'hours' ||
                editingItem.type === 'other' ? (
                  <textarea
                    rows={2}
                    value={editingItem.value.ta}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        value: { ...editingItem.value, ta: e.target.value },
                      })
                    }
                    placeholder="உ-ம்: மெமோரியல் லேன், மானிப்பாய்"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                ) : (
                  <input
                    type="text"
                    value={editingItem.value.ta}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        value: { ...editingItem.value, ta: e.target.value },
                      })
                    }
                    placeholder="+94 21 225 5412"
                    className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setIsCreatingItem(false);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-stone-300 dark:border-stone-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingItem}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {savingItem && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isCreatingItem ? 'Add Contact Item' : 'Save Contact Item'}</span>
              </button>
            </div>
          </form>
        )}

        {contactItems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 dark:border-stone-700 p-6 text-center text-sm text-stone-500 dark:text-stone-400">
            No contact cards added yet. Click &ldquo;Add Contact Item&rdquo; to display address, phone, email, or office hours cards.
          </div>
        ) : (
          <div className="space-y-2.5">
            {contactItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950/60 px-4 py-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="font-mono-num text-xs font-semibold text-stone-400 w-5 text-center shrink-0 mt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono-num font-bold uppercase px-2 py-0.5 rounded bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {item.type}
                      </span>
                      <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {pickText(item.label, 'en')}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 break-words">
                      {pickText(item.value, 'en')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => void handleReorderItem(item.id, 'up')}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                    title="Move up"
                    aria-label="Move contact item up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === contactItems.length - 1}
                    onClick={() => void handleReorderItem(item.id, 'down')}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                    title="Move down"
                    aria-label="Move contact item down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingItem(false);
                      setEditingItem(item);
                    }}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                    title="Edit contact item"
                    aria-label="Edit contact item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteItem(item.id)}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    title="Delete contact item"
                    aria-label="Delete contact item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Social & Quick Links Manager */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              3. Social &amp; Quick Links
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Add official social channels (Facebook, YouTube, WhatsApp, Instagram) or quick links shown in the Contact page and optionally in the Footer.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreateSocial}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white cursor-pointer hover:opacity-90 shrink-0"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add Social / Quick Link</span>
          </button>
        </div>

        {editingSocial && (
          <form
            onSubmit={handleSaveSocial}
            className="rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 p-4 sm:p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {isCreatingSocial ? 'Add Social / Quick Link' : 'Edit Social / Quick Link'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setEditingSocial(null);
                  setIsCreatingSocial(false);
                }}
                className="p-1 rounded-lg text-stone-500 hover:bg-stone-200/70 dark:hover:bg-stone-800 cursor-pointer"
                aria-label="Close social link editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Platform
                </label>
                <select
                  value={editingSocial.platform}
                  onChange={(e) =>
                    setEditingSocial({
                      ...editingSocial,
                      platform: e.target.value as SocialPlatform,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={editingSocial.url}
                  onChange={(e) =>
                    setEditingSocial({ ...editingSocial, url: e.target.value })
                  }
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Button Label (English)
                </label>
                <input
                  type="text"
                  value={editingSocial.label.en}
                  onChange={(e) =>
                    setEditingSocial({
                      ...editingSocial,
                      label: { ...editingSocial.label, en: e.target.value },
                    })
                  }
                  placeholder="e.g., Official Facebook Page"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Button Label (தமிழ் — optional)
                </label>
                <input
                  type="text"
                  value={editingSocial.label.ta}
                  onChange={(e) =>
                    setEditingSocial({
                      ...editingSocial,
                      label: { ...editingSocial.label, ta: e.target.value },
                    })
                  }
                  placeholder="உ-ம்: உத்தியோகபூர்வ பேஸ்புக் பக்கம்"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingSocial(null);
                  setIsCreatingSocial(false);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-stone-300 dark:border-stone-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingSocial}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {savingSocial && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isCreatingSocial ? 'Add Link' : 'Save Link'}</span>
              </button>
            </div>
          </form>
        )}

        {socialLinks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 dark:border-stone-700 p-6 text-center text-sm text-stone-500 dark:text-stone-400">
            No social or quick links configured. Click &ldquo;Add Social / Quick Link&rdquo; above if you wish to display them.
          </div>
        ) : (
          <div className="space-y-2.5">
            {socialLinks.map((link, idx) => (
              <div
                key={link.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950/60 px-4 py-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="font-mono-num text-xs font-semibold text-stone-400 w-5 text-center shrink-0 mt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono-num font-bold uppercase px-2 py-0.5 rounded bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {link.platform}
                      </span>
                      <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {pickText(link.label, 'en')}
                      </span>
                    </div>
                    <p className="text-xs font-mono-num text-stone-500 dark:text-stone-400 mt-1 truncate max-w-md flex items-center gap-1">
                      <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                      <span className="truncate">{link.url}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => void handleReorderSocial(link.id, 'up')}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                    title="Move up"
                    aria-label="Move social link up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === socialLinks.length - 1}
                    onClick={() => void handleReorderSocial(link.id, 'down')}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                    title="Move down"
                    aria-label="Move social link down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingSocial(false);
                      setEditingSocial(link);
                    }}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                    title="Edit link"
                    aria-label="Edit social link"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteSocial(link.id)}
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    title="Delete link"
                    aria-label="Delete social link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

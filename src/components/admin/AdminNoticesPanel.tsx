import React, { useRef, useState } from 'react';
import { Edit2, FileText, Paperclip, Pin, Plus, Trash2, Upload, X } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { NoticeCategory, NoticeItem } from '../../types/school';
import {
  cleanBilingual,
  hasAnyText,
  pickText,
  readAttachmentFile,
} from '../../utils/schoolHelpers';

const EMPTY_NOTICE: Omit<NoticeItem, 'id'> = {
  title: { en: '', ta: '' },
  summary: { en: '', ta: '' },
  content: { en: '', ta: '' },
  category: 'Circulars',
  date: new Date().toISOString().slice(0, 10),
  pinned: false,
  referenceCode: 'JMMES/CIR/2026-NEW',
};

export const AdminNoticesPanel: React.FC = () => {
  const { data, upsertNotice, deleteNotice, togglePinNotice, showToast } = useSchoolData();
  const [editing, setEditing] = useState<NoticeItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const startCreate = () => {
    setIsCreating(true);
    setEditing({
      ...EMPTY_NOTICE,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      referenceCode: `JMMES/CIR/2026-${String(data.notices.length + 1).padStart(2, '0')}`,
    });
  };

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editing) return;
    try {
      const attachment = await readAttachmentFile(file);
      setEditing({ ...editing, attachment });
      showToast(`Attached "${attachment.name}".`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to attach file.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    if (!hasAnyText(editing.title)) {
      showToast('Please enter a notice title in English or Tamil.', 'error');
      return;
    }
    if (!hasAnyText(editing.summary)) {
      showToast('Please enter a short summary in English or Tamil.', 'error');
      return;
    }

    const cleanedContent = cleanBilingual(editing.content);
    const cleanedSummary = cleanBilingual(editing.summary);

    await upsertNotice({
      ...editing,
      title: cleanBilingual(editing.title),
      summary: cleanedSummary,
      content: hasAnyText(cleanedContent) ? cleanedContent : cleanedSummary,
    });
    setEditing(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Notices Manager
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Create, edit, pin, or attach PDFs/images to official school circulars and exam timetables. Enter English, Tamil, or both.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white shrink-0 cursor-pointer hover:opacity-90"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>New Notice</span>
        </button>
      </div>

      {editing && (
        <form
          onSubmit={handleSave}
          className="rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              {isCreating ? 'Publish New Notice' : 'Edit Notice'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setIsCreating(false);
              }}
              className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Category
              </label>
              <select
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value as NoticeCategory })
                }
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
              >
                <option value="Exams">Exams</option>
                <option value="Circulars">Circulars</option>
                <option value="Events">Events</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={editing.date}
                onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Reference Code
              </label>
              <input
                type="text"
                required
                value={editing.referenceCode}
                onChange={(e) => setEditing({ ...editing, referenceCode: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg text-sm font-mono-num border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Title (English — optional if Tamil entered)
              </label>
              <input
                type="text"
                value={editing.title.en}
                onChange={(e) =>
                  setEditing({ ...editing, title: { ...editing.title, en: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Title (தமிழ் — optional if English entered)
              </label>
              <input
                type="text"
                value={editing.title.ta}
                onChange={(e) =>
                  setEditing({ ...editing, title: { ...editing.title, ta: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Short Summary (English — optional if Tamil entered)
              </label>
              <textarea
                rows={2}
                value={editing.summary.en}
                onChange={(e) =>
                  setEditing({ ...editing, summary: { ...editing.summary, en: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Short Summary (தமிழ் — optional if English entered)
              </label>
              <textarea
                rows={2}
                value={editing.summary.ta}
                onChange={(e) =>
                  setEditing({ ...editing, summary: { ...editing.summary, ta: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Full Notice Content (English, Optional)
              </label>
              <textarea
                rows={4}
                value={editing.content.en}
                onChange={(e) =>
                  setEditing({ ...editing, content: { ...editing.content, en: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Full Notice Content (தமிழ், Optional)
              </label>
              <textarea
                rows={4}
                value={editing.content.ta}
                onChange={(e) =>
                  setEditing({ ...editing, content: { ...editing.content, ta: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          {/* Optional PDF / Document Attachment Upload */}
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950 p-4 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-semibold text-stone-700 dark:text-stone-200">
                  Attach Document (PDF / Image) — Optional
                </span>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Attach exam timetables, circulars, or scanned letters directly from your phone or computer.
                </p>
              </div>
              <input
                ref={attachmentInputRef}
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => void handleAttachmentUpload(e)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => attachmentInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 shrink-0 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {editing.attachment ? 'Replace Attachment' : 'Attach Document (PDF / Image)'}
                </span>
              </button>
            </div>

            {editing.attachment && (
              <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText
                    className="w-4 h-4 text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-medium text-stone-800 dark:text-stone-100 truncate">
                    {editing.attachment.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing({ ...editing, attachment: undefined })}
                  className="text-red-600 dark:text-red-400 font-semibold hover:underline shrink-0 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="inline-flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.pinned}
                onChange={(e) => setEditing({ ...editing, pinned: e.target.checked })}
                className="rounded border-stone-300"
              />
              <span>Pin notice to top of board</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setIsCreating(false);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {isCreating ? 'Publish Notice' : 'Update Notice'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 divide-y divide-stone-200 dark:divide-stone-800">
        {data.notices.length === 0 ? (
          <div className="p-8 text-center text-sm text-stone-500">
            No notices published yet. Click "New Notice" to add one.
          </div>
        ) : (
          data.notices.map((notice) => (
            <div
              key={notice.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <span className="font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-accent)]">
                    {notice.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">{notice.date}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">{notice.referenceCode}</span>
                  {notice.pinned && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-stone-700 dark:text-stone-200">
                        Pinned
                      </span>
                    </>
                  )}
                  {notice.attachment && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 font-medium text-stone-700 dark:text-stone-200">
                        <Paperclip className="w-3 h-3" aria-hidden="true" />
                        <span>{notice.attachment.name}</span>
                      </span>
                    </>
                  )}
                </div>
                <h4 className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100 truncate">
                  {pickText(notice.title, 'en')}
                </h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => void togglePinNotice(notice.id)}
                  className={`p-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    notice.pinned
                      ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] dark:border-[var(--brand-accent)] dark:text-[var(--brand-accent)]'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                  title={notice.pinned ? 'Unpin notice' : 'Pin notice'}
                >
                  <Pin className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditing(notice);
                  }}
                  className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  title="Edit notice"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void deleteNotice(notice.id)}
                  className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                  title="Delete notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

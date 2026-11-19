import { BilingualText, Language } from '../types/school';

/**
 * Smart bilingual selector:
 * - Returns text in the active language if non-empty.
 * - Falls back to the other language if only one language was entered by admin.
 */
export function pickText(text: BilingualText | undefined, lang: Language): string {
  if (!text) return '';
  const primary = text[lang]?.trim();
  if (primary) return primary;
  const fallback: Language = lang === 'en' ? 'ta' : 'en';
  return text[fallback]?.trim() || '';
}

/**
 * Smart bilingual array selector (e.g. curriculum subjects, anthem verses):
 * - Returns non-empty entries in the active language if present.
 * - Falls back to the other language's array if active language array is empty.
 */
export function pickList(
  lists: { en: string[]; ta: string[] } | undefined,
  lang: Language
): string[] {
  if (!lists) return [];
  const primary = (lists[lang] || []).map((item) => item.trim()).filter(Boolean);
  if (primary.length > 0) return primary;
  const fallback: Language = lang === 'en' ? 'ta' : 'en';
  return (lists[fallback] || []).map((item) => item.trim()).filter(Boolean);
}

/**
 * Normalizes a bilingual form input without forcing both languages.
 */
export function cleanBilingual(text: BilingualText | undefined): BilingualText {
  return {
    en: text?.en?.trim() || '',
    ta: text?.ta?.trim() || '',
  };
}

export function hasAnyText(text: BilingualText | undefined): boolean {
  return Boolean(text?.en?.trim() || text?.ta?.trim());
}

/**
 * Reads an uploaded image from phone/desktop and compresses large photos cleanly
 * so multiple uploads fit reliably inside localStorage.
 */
export function readImageFileAsDataUrl(
  file: File,
  options: { maxDimension?: number; quality?: number } = {}
): Promise<string> {
  const { maxDimension = 1400, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read selected image file.'));
    reader.onload = () => {
      const rawDataUrl = reader.result;
      if (typeof rawDataUrl !== 'string') {
        reject(new Error('Unexpected file read result.'));
        return;
      }

      // Preserve crisp SVGs and small PNGs directly
      if (file.type === 'image/svg+xml' || (file.type === 'image/png' && file.size < 250 * 1024)) {
        resolve(rawDataUrl);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const targetW = Math.max(1, Math.round(img.width * scale));
        const targetH = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        // Preserve transparency for PNG logos if resized
        if (file.type === 'image/png') {
          ctx.clearRect(0, 0, targetW, targetH);
          ctx.drawImage(img, 0, 0, targetW, targetH);
          resolve(canvas.toDataURL('image/png'));
        } else {
          ctx.drawImage(img, 0, 0, targetW, targetH);
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Reads a PDF or image document attachment into a data URL.
 */
export function readAttachmentFile(
  file: File,
  maxBytes = 4 * 1024 * 1024
): Promise<{ name: string; mimeType: string; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');
    if (!isPdf && !isImage) {
      reject(new Error('Please select a PDF document or image file.'));
      return;
    }

    if (isImage) {
      readImageFileAsDataUrl(file, { maxDimension: 1400, quality: 0.82 })
        .then((dataUrl) =>
          resolve({
            name: file.name,
            mimeType: file.type || 'image/jpeg',
            dataUrl,
          })
        )
        .catch(reject);
      return;
    }

    if (file.size > maxBytes) {
      reject(new Error('PDF file size must be under 4 MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read document file.'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Unexpected file read result.'));
        return;
      }
      resolve({
        name: file.name,
        mimeType: 'application/pdf',
        dataUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  });
}

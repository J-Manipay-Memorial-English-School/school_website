import { DEFAULT_SCHOOL_DATA } from '../data/defaultSchoolData';
import { InquiryMessage, SchoolData } from '../types/school';

const STORAGE_KEY = 'jmmes_school_data_v1';
const INQUIRIES_KEY = 'jmmes_inquiries_v1';
const ADMIN_SESSION_KEY = 'jmmes_admin_session_v1';

function cloneDefaultData(): SchoolData {
  return JSON.parse(JSON.stringify(DEFAULT_SCHOOL_DATA)) as SchoolData;
}

export async function fetchSchoolData(): Promise<SchoolData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = cloneDefaultData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as Partial<SchoolData>;
    const defaults = cloneDefaultData();
    const resolvedStrength =
      Array.isArray(parsed.studentStrength) && parsed.studentStrength.length > 0
        ? parsed.studentStrength
        : defaults.studentStrength;
    const computedStudents = resolvedStrength.reduce(
      (sum, item) => sum + (Number(item.boys) || 0) + (Number(item.girls) || 0),
      0
    );
    const resolvedStats = {
      ...defaults.stats,
      ...(parsed.stats || {}),
      students: computedStudents,
    };

    const resolvedGallery = (
      Array.isArray(parsed.gallery) && parsed.gallery.length > 0
        ? parsed.gallery
        : defaults.gallery
    ).map((item) => ({
      ...item,
      photos:
        Array.isArray(item.photos) && item.photos.length > 0 ? item.photos : [item.url],
    }));

    return {
      ...defaults,
      ...parsed,
      schoolLogoUrl:
        typeof parsed.schoolLogoUrl === 'string' && parsed.schoolLogoUrl.trim()
          ? parsed.schoolLogoUrl
          : defaults.schoolLogoUrl,
      stats: resolvedStats,
      studentStrength: resolvedStrength,
      gallery: resolvedGallery,
      schoolGlimpses:
        Array.isArray(parsed.schoolGlimpses) && parsed.schoolGlimpses.length > 0
          ? parsed.schoolGlimpses
          : defaults.schoolGlimpses,
      staffMembers:
        Array.isArray(parsed.staffMembers) && parsed.staffMembers.length > 0
          ? parsed.staffMembers
          : defaults.staffMembers,
      formerPrincipals: Array.isArray(parsed.formerPrincipals)
        ? parsed.formerPrincipals
        : defaults.formerPrincipals,
      examResults: Array.isArray(parsed.examResults)
        ? parsed.examResults
        : defaults.examResults,
      smartSystems:
        Array.isArray(parsed.smartSystems) && parsed.smartSystems.length > 0
          ? parsed.smartSystems
          : defaults.smartSystems,
    };
  } catch {
    return cloneDefaultData();
  }
}

export async function persistSchoolData(data: SchoolData): Promise<SchoolData> {
  const payload: SchoolData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export async function resetSchoolDataToDefault(): Promise<SchoolData> {
  const fresh = cloneDefaultData();
  fresh.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

export async function fetchInquiries(): Promise<InquiryMessage[]> {
  try {
    const raw = localStorage.getItem(INQUIRIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InquiryMessage[];
  } catch {
    return [];
  }
}

export async function createInquiry(
  input: Omit<InquiryMessage, 'id' | 'submittedAt' | 'status'>
): Promise<InquiryMessage> {
  const existing = await fetchInquiries();
  const created: InquiryMessage = {
    ...input,
    id: `inq-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'unread',
  };
  const updated = [created, ...existing];
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
  return created;
}

export async function markInquiryAsRead(id: string): Promise<InquiryMessage[]> {
  const existing = await fetchInquiries();
  const updated = existing.map((item) =>
    item.id === id ? { ...item, status: 'read' as const } : item
  );
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
  return updated;
}

export async function authenticateAdmin(
  username: string,
  password: string
): Promise<boolean> {
  const valid = username.trim() === 'admin' && password === 'manipay2026';
  if (valid) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
  }
  return valid;
}

export function checkAdminSession(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated';
  } catch {
    return false;
  }
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // ignore
  }
}

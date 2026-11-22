import { DEFAULT_SCHOOL_DATA } from '../data/defaultSchoolData';
import { InquiryMessage, SchoolData } from '../types/school';

const STORAGE_KEY = 'jmmes_school_data_v1';
const INQUIRIES_KEY = 'jmmes_inquiries_v1';

export class UnauthorizedError extends Error {
  status = 401;

  constructor(message = 'Unauthorized: Invalid administrator password.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class AdminApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
  }
}

function cloneDefaultData(): SchoolData {
  return JSON.parse(JSON.stringify(DEFAULT_SCHOOL_DATA)) as SchoolData;
}

function normalizeSchoolData(parsed: Partial<SchoolData>): SchoolData {
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
}

async function parseErrorResponse(res: Response, fallbackMessage: string): Promise<string> {
  try {
    const json = (await res.json()) as { error?: unknown };
    if (typeof json?.error === 'string' && json.error.trim()) {
      return json.error.trim();
    }
  } catch {
    // ignore non-JSON body
  }
  return fallbackMessage;
}

export async function fetchSchoolData(): Promise<SchoolData> {
  try {
    const res = await fetch('/api/school-data', { cache: 'no-store' });
    if (res.ok) {
      const json = (await res.json()) as { data?: Partial<SchoolData> | null };
      if (json?.data && typeof json.data === 'object') {
        const normalized = normalizeSchoolData(json.data);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        } catch {
          // ignore storage quota errors
        }
        return normalized;
      }
    }
  } catch {
    // Fall back to local cache if API endpoint is unavailable
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = cloneDefaultData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as Partial<SchoolData>;
    return normalizeSchoolData(parsed);
  } catch {
    return cloneDefaultData();
  }
}

export async function verifyAdminPassword(
  password: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'x-admin-password': password,
      },
    });

    if (res.status === 401) {
      const msg = await parseErrorResponse(res, 'Unauthorized: Invalid administrator password.');
      return { ok: false, error: msg };
    }

    if (!res.ok) {
      const msg = await parseErrorResponse(res, 'Unable to verify administrator password.');
      return { ok: false, error: msg };
    }

    const body = (await res.json()) as { authenticated?: boolean; error?: string };
    if (body.authenticated) {
      return { ok: true };
    }
    return {
      ok: false,
      error: body.error || 'Unauthorized: Invalid administrator password.',
    };
  } catch {
    return {
      ok: false,
      error: 'Unable to reach the authentication server. Please try again.',
    };
  }
}

export async function persistSchoolData(
  data: SchoolData,
  adminPassword: string
): Promise<SchoolData> {
  const payload: SchoolData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const res = await fetch('/api/school-data', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': adminPassword,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    throw new UnauthorizedError(
      await parseErrorResponse(res, 'Unauthorized: Invalid administrator password.')
    );
  }

  if (!res.ok) {
    throw new AdminApiError(
      res.status,
      await parseErrorResponse(res, 'Failed to save school changes on the server.')
    );
  }

  let savedPayload = payload;
  try {
    const json = (await res.json()) as { data?: Partial<SchoolData> };
    if (json?.data && typeof json.data === 'object') {
      savedPayload = normalizeSchoolData(json.data);
    }
  } catch {
    // keep payload
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPayload));
  } catch {
    // ignore quota limits
  }
  return savedPayload;
}

export async function resetSchoolDataToDefault(adminPassword: string): Promise<SchoolData> {
  const res = await fetch('/api/school-data', {
    method: 'DELETE',
    headers: {
      'x-admin-password': adminPassword,
    },
  });

  if (res.status === 401) {
    throw new UnauthorizedError(
      await parseErrorResponse(res, 'Unauthorized: Invalid administrator password.')
    );
  }

  if (!res.ok) {
    throw new AdminApiError(
      res.status,
      await parseErrorResponse(res, 'Failed to reset school records on the server.')
    );
  }

  const fresh = cloneDefaultData();
  fresh.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    // ignore quota limits
  }
  return fresh;
}

export async function uploadMediaFile(
  payload: { name: string; mimeType: string; dataUrl: string },
  adminPassword: string
): Promise<{ url: string; name: string; mimeType: string }> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': adminPassword,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    throw new UnauthorizedError(
      await parseErrorResponse(res, 'Unauthorized: Invalid administrator password.')
    );
  }

  if (!res.ok) {
    throw new AdminApiError(
      res.status,
      await parseErrorResponse(res, 'Failed to upload media file.')
    );
  }

  const json = (await res.json()) as {
    url?: string;
    name?: string;
    mimeType?: string;
  };

  return {
    url: typeof json.url === 'string' && json.url ? json.url : payload.dataUrl,
    name: typeof json.name === 'string' && json.name ? json.name : payload.name,
    mimeType:
      typeof json.mimeType === 'string' && json.mimeType ? json.mimeType : payload.mimeType,
  };
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

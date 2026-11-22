import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_SCHOOL_DATA } from '../data/defaultSchoolData';
import { UI_STRINGS } from '../data/uiStrings';
import {
  createInquiry,
  fetchInquiries,
  fetchSchoolData,
  markInquiryAsRead,
  persistSchoolData,
  resetSchoolDataToDefault,
  UnauthorizedError,
  uploadMediaFile,
  verifyAdminPassword,
} from '../services/schoolService';
import {
  AcademicProgram,
  AcademicsConfig,
  AchievementItem,
  BilingualText,
  ClassStrengthItem,
  ContactInfo,
  ExamResultItem,
  FooterConfig,
  FormerPrincipal,
  GalleryPhoto,
  HeritageConfig,
  HeroConfig,
  InquiryMessage,
  Language,
  NoticeItem,
  PrincipalConfig,
  SchoolData,
  SchoolGlimpse,
  SchoolStats,
  SmartSystemItem,
  StaffMember,
  ThemeBrandConfig,
  ThemeMode,
  ToastItem,
} from '../types/school';
import { pickText, readAttachmentFile, readImageFileAsDataUrl } from '../utils/schoolHelpers';

const LANG_KEY = 'jmmes_lang_v1';
const THEME_KEY = 'jmmes_theme_v1';

function darkenHex(hex: string, amount = 18): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return `rgba(107, 29, 47, ${alpha})`;
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface SchoolDataContextValue {
  data: SchoolData;
  isLoading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  strings: typeof UI_STRINGS.en;
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastItem['type']) => void;
  dismissToast: (id: string) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => Promise<{ ok: boolean; error?: string }>;
  logoutAdmin: () => void;
  uploadAdminImage: (
    file: File,
    options?: { maxDimension?: number; quality?: number }
  ) => Promise<string>;
  uploadAdminAttachment: (
    file: File
  ) => Promise<{ name: string; mimeType: string; dataUrl: string }>;
  inquiries: InquiryMessage[];
  updateGeneralAndHero: (payload: {
    schoolName: BilingualText;
    shortName: BilingualText;
    schoolLogoUrl: string;
    headerTickerLabel: BilingualText;
    tickerAnnouncements: BilingualText[];
    primaryAddress: BilingualText;
    schoolType: BilingualText;
    hero: HeroConfig;
    heritage: HeritageConfig;
  }) => Promise<void>;
  resetSchoolLogo: () => Promise<string>;
  updatePrincipalAndStats: (payload: {
    principal: PrincipalConfig;
    stats: SchoolStats;
    studentStrength: ClassStrengthItem[];
  }) => Promise<void>;
  upsertNotice: (notice: NoticeItem) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
  togglePinNotice: (id: string) => Promise<void>;
  upsertAchievement: (achievement: AchievementItem) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
  upsertGalleryPhoto: (photo: GalleryPhoto) => Promise<void>;
  deleteGalleryPhoto: (id: string) => Promise<void>;
  upsertSchoolGlimpse: (photo: SchoolGlimpse) => Promise<void>;
  deleteSchoolGlimpse: (id: string) => Promise<void>;
  reorderSchoolGlimpse: (id: string, direction: 'up' | 'down') => Promise<void>;
  upsertStaffMember: (member: StaffMember) => Promise<void>;
  deleteStaffMember: (id: string) => Promise<void>;
  reorderStaffMember: (id: string, direction: 'up' | 'down') => Promise<void>;
  upsertFormerPrincipal: (item: FormerPrincipal) => Promise<void>;
  deleteFormerPrincipal: (id: string) => Promise<void>;
  reorderFormerPrincipal: (id: string, direction: 'up' | 'down') => Promise<void>;
  upsertExamResult: (result: ExamResultItem) => Promise<void>;
  deleteExamResult: (id: string) => Promise<void>;
  updateAcademicsConfig: (
    academicsConfig: AcademicsConfig,
    academicsOverride?: AcademicProgram[]
  ) => Promise<void>;
  upsertAcademicProgram: (program: AcademicProgram) => Promise<void>;
  deleteAcademicProgram: (id: string) => Promise<void>;
  reorderAcademicProgram: (id: string, direction: 'up' | 'down') => Promise<void>;
  updateContactInfo: (contact: ContactInfo) => Promise<void>;
  updateFooterConfig: (footer: FooterConfig) => Promise<void>;
  updateSmartSystems: (systems: SmartSystemItem[]) => Promise<void>;
  updateBrandTheme: (brandTheme: ThemeBrandConfig) => Promise<void>;
  resetAllToDefaults: () => Promise<void>;
  submitContactInquiry: (
    input: Omit<InquiryMessage, 'id' | 'submittedAt' | 'status'>
  ) => Promise<void>;
  markInquiryRead: (id: string) => Promise<void>;
}

const SchoolDataContext = createContext<SchoolDataContextValue | undefined>(undefined);

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SchoolData>(DEFAULT_SCHOOL_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [inquiries, setInquiries] = useState<InquiryMessage[]>([]);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const isAdminAuthenticated = adminPassword.length > 0;

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      return saved === 'ta' ? 'ta' : 'en';
    } catch {
      return 'en';
    }
  });

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const showToast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load initial school data & inquiries via service
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [loadedData, loadedInquiries] = await Promise.all([
        fetchSchoolData(),
        fetchInquiries(),
      ]);
      if (mounted) {
        setData(loadedData);
        setInquiries(loadedInquiries);
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Apply Dark/Light mode on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, themeMode);
    } catch {
      // ignore
    }
  }, [themeMode]);

  // Apply Language preference & sync document title
  useEffect(() => {
    document.documentElement.lang = language === 'ta' ? 'ta' : 'en';
    const resolvedName = pickText(data.schoolName, language);
    if (resolvedName) {
      document.title = resolvedName;
    }
    try {
      localStorage.setItem(LANG_KEY, language);
    } catch {
      // ignore
    }
  }, [language, data.schoolName]);

  // Apply Live Brand Color Customizer CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const primary = data.brandTheme.primaryColor || '#6B1D2F';
    const accent = data.brandTheme.accentColor || '#B47B2B';
    root.style.setProperty('--brand-primary', primary);
    root.style.setProperty('--brand-primary-hover', darkenHex(primary, 18));
    root.style.setProperty('--brand-accent', accent);
    root.style.setProperty('--brand-primary-soft', hexToRgba(primary, themeMode === 'dark' ? 0.2 : 0.08));
    root.style.setProperty('--brand-accent-soft', hexToRgba(accent, themeMode === 'dark' ? 0.22 : 0.12));
  }, [data.brandTheme, themeMode]);

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);
  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'en' ? 'ta' : 'en'));
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => setThemeModeState(mode), []);
  const toggleThemeMode = useCallback(() => {
    setThemeModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const handleProtectedApiError = useCallback(
    (err: unknown): never => {
      if (err instanceof UnauthorizedError) {
        setAdminPassword('');
        showToast(err.message, 'error');
      } else {
        showToast(
          err instanceof Error ? err.message : 'Unable to save changes on the server.',
          'error'
        );
      }
      throw err;
    },
    [showToast]
  );

  const saveAndSync = useCallback(
    async (nextData: SchoolData) => {
      try {
        const saved = await persistSchoolData(nextData, adminPassword);
        setData(saved);
        return saved;
      } catch (err) {
        return handleProtectedApiError(err);
      }
    },
    [adminPassword, handleProtectedApiError]
  );

  const uploadAdminImage = useCallback(
    async (
      file: File,
      options?: { maxDimension?: number; quality?: number }
    ): Promise<string> => {
      const dataUrl = await readImageFileAsDataUrl(file, options);
      try {
        const uploaded = await uploadMediaFile(
          {
            name: file.name,
            mimeType: file.type || 'image/jpeg',
            dataUrl,
          },
          adminPassword
        );
        return uploaded.url;
      } catch (err) {
        return handleProtectedApiError(err);
      }
    },
    [adminPassword, handleProtectedApiError]
  );

  const uploadAdminAttachment = useCallback(
    async (file: File): Promise<{ name: string; mimeType: string; dataUrl: string }> => {
      const attachment = await readAttachmentFile(file);
      try {
        const uploaded = await uploadMediaFile(attachment, adminPassword);
        return {
          name: uploaded.name,
          mimeType: uploaded.mimeType,
          dataUrl: uploaded.url,
        };
      } catch (err) {
        return handleProtectedApiError(err);
      }
    },
    [adminPassword, handleProtectedApiError]
  );

  const updateGeneralAndHero = useCallback(
    async (payload: {
      schoolName: BilingualText;
      shortName: BilingualText;
      schoolLogoUrl: string;
      headerTickerLabel: BilingualText;
      tickerAnnouncements: BilingualText[];
      primaryAddress: BilingualText;
      schoolType: BilingualText;
      hero: HeroConfig;
      heritage: HeritageConfig;
    }) => {
      const existingItems = data.contact.items || [];
      let updatedAddressItem = false;
      const syncedContactItems = existingItems.map((item) => {
        if (!updatedAddressItem && item.type === 'address') {
          updatedAddressItem = true;
          return { ...item, value: payload.primaryAddress };
        }
        return item;
      });

      await saveAndSync({
        ...data,
        schoolName: payload.schoolName,
        shortName: payload.shortName,
        schoolLogoUrl: payload.schoolLogoUrl.trim() || DEFAULT_SCHOOL_DATA.schoolLogoUrl,
        headerTickerLabel: payload.headerTickerLabel,
        tickerAnnouncements: payload.tickerAnnouncements,
        hero: payload.hero,
        heritage: payload.heritage,
        contact: {
          ...data.contact,
          address: payload.primaryAddress,
          schoolType: payload.schoolType,
          items: syncedContactItems,
        },
      });
      showToast('School identity, header, banner, crest & heritage saved.');
    },
    [data, saveAndSync, showToast]
  );

  const resetSchoolLogo = useCallback(async () => {
    const defaultUrl = DEFAULT_SCHOOL_DATA.schoolLogoUrl;
    await saveAndSync({ ...data, schoolLogoUrl: defaultUrl });
    showToast('School Crest reset to default emblem.', 'info');
    return defaultUrl;
  }, [data, saveAndSync, showToast]);

  const updatePrincipalAndStats = useCallback(
    async (payload: {
      principal: PrincipalConfig;
      stats: SchoolStats;
      studentStrength: ClassStrengthItem[];
    }) => {
      const totalStudents = payload.studentStrength.reduce(
        (sum, cls) => sum + (Number(cls.boys) || 0) + (Number(cls.girls) || 0),
        0
      );
      await saveAndSync({
        ...data,
        principal: payload.principal,
        studentStrength: payload.studentStrength,
        stats: {
          ...payload.stats,
          students: totalStudents,
        },
      });
      showToast('Principal profile, class strength & counters saved.');
    },
    [data, saveAndSync, showToast]
  );

  const upsertNotice = useCallback(
    async (notice: NoticeItem) => {
      const exists = data.notices.some((n) => n.id === notice.id);
      const notices = exists
        ? data.notices.map((n) => (n.id === notice.id ? notice : n))
        : [notice, ...data.notices];
      await saveAndSync({ ...data, notices });
      showToast(exists ? 'Notice updated.' : 'New notice published.');
    },
    [data, saveAndSync, showToast]
  );

  const deleteNotice = useCallback(
    async (id: string) => {
      const notices = data.notices.filter((n) => n.id !== id);
      await saveAndSync({ ...data, notices });
      showToast('Notice removed.', 'info');
    },
    [data, saveAndSync, showToast]
  );

  const togglePinNotice = useCallback(
    async (id: string) => {
      const notices = data.notices.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
      await saveAndSync({ ...data, notices });
      showToast('Notice pin status updated.');
    },
    [data, saveAndSync, showToast]
  );

  const upsertAchievement = useCallback(
    async (achievement: AchievementItem) => {
      const exists = data.achievements.some((a) => a.id === achievement.id);
      const achievements = exists
        ? data.achievements.map((a) => (a.id === achievement.id ? achievement : a))
        : [achievement, ...data.achievements];
      await saveAndSync({ ...data, achievements });
      showToast(exists ? 'Achievement updated.' : 'Achievement added.');
    },
    [data, saveAndSync, showToast]
  );

  const deleteAchievement = useCallback(
    async (id: string) => {
      const achievements = data.achievements.filter((a) => a.id !== id);
      await saveAndSync({ ...data, achievements });
      showToast('Achievement deleted.', 'info');
    },
    [data, saveAndSync, showToast]
  );

  const upsertGalleryPhoto = useCallback(
    async (photo: GalleryPhoto) => {
      const exists = data.gallery.some((g) => g.id === photo.id);
      const gallery = exists
        ? data.gallery.map((g) => (g.id === photo.id ? photo : g))
        : [photo, ...data.gallery];
      await saveAndSync({ ...data, gallery });
      showToast(exists ? 'Gallery photo updated.' : 'Photo added to gallery.');
    },
    [data, saveAndSync, showToast]
  );

  const deleteGalleryPhoto = useCallback(
    async (id: string) => {
      const gallery = data.gallery.filter((g) => g.id !== id);
      await saveAndSync({ ...data, gallery });
      showToast('Photo removed from gallery.', 'info');
    },
    [data, saveAndSync, showToast]
  );

  const upsertSchoolGlimpse = useCallback(
    async (photo: SchoolGlimpse) => {
      const exists = data.schoolGlimpses.some((g) => g.id === photo.id);
      const schoolGlimpses = exists
        ? data.schoolGlimpses.map((g) => (g.id === photo.id ? photo : g))
        : [photo, ...data.schoolGlimpses];
      await saveAndSync({ ...data, schoolGlimpses });
      showToast(exists ? 'School glimpse updated.' : 'School photo added to School Glimpses.');
    },
    [data, saveAndSync, showToast]
  );

  const deleteSchoolGlimpse = useCallback(
    async (id: string) => {
      const schoolGlimpses = data.schoolGlimpses.filter((g) => g.id !== id);
      await saveAndSync({ ...data, schoolGlimpses });
      showToast('Photo removed from School Glimpses.', 'info');
    },
    [data, saveAndSync, showToast]
  );

  const reorderSchoolGlimpse = useCallback(
    async (id: string, direction: 'up' | 'down') => {
      const list = [...data.schoolGlimpses];
      const idx = list.findIndex((item) => item.id === id);
      if (idx === -1) return;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return;
      const [moved] = list.splice(idx, 1);
      list.splice(targetIdx, 0, moved);
      await saveAndSync({ ...data, schoolGlimpses: list });
      showToast('School Glimpses order updated.');
    },
    [data, saveAndSync, showToast]
  );

  const upsertStaffMember = useCallback(
    async (member: StaffMember) => {
      const exists = data.staffMembers.some((s) => s.id === member.id);
      const staffMembers = exists
        ? data.staffMembers.map((s) => (s.id === member.id ? member : s))
        : [member, ...data.staffMembers];
      await saveAndSync({ ...data, staffMembers });
      showToast(exists ? 'Staff profile updated.' : 'New teacher added to Staff directory.');
    },
    [data, saveAndSync, showToast]
  );

  const deleteStaffMember = useCallback(
    async (id: string) => {
      const staffMembers = data.staffMembers.filter((s) => s.id !== id);
      await saveAndSync({ ...data, staffMembers });
      showToast('Staff profile removed.', 'info');
    },
    [data, saveAndSync, showToast]
  );

  const reorderStaffMember = useCallback(
    async (id: string, direction: 'up' | 'down') => {
      const list = [...data.staffMembers];
      const idx = list.findIndex((item) => item.id === id);
      if (idx === -1) return;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return;
      const [moved] = list.splice(idx, 1);
      list.splice(targetIdx, 0, moved);
      await saveAndSync({ ...data, staffMembers: list });
      showToast('Staff directory order updated.');
    },
    [data, saveAndSync, showToast]
  );

  const upsertFormerPrincipal = useCallback(
    async (item: FormerPrincipal) => {
      const exists = data.formerPrincipals.some((p) => p.id === item.id);
      const formerPrincipals = exists
        ? data.formerPrincipals.map((p) => (p.id === item.id ? item : p))
        : [...data.formerPrincipals, item];
      await saveAndSync({ ...data, formerPrincipals });
      showToast(exists ? 'Former principal record updated.' : 'Former principal record added.');
    },
    [data, saveAndSync, showToast]
  );

  const deleteFormerPrincipal = useCallback(
    async (id: string) => {
      const formerPrincipals = data.formerPrincipals.filter((p) => p.id !== id);
      await saveAndSync({ ...data, formerPrincipals });
      showToast('Former principal record removed.', 'info');
    },
    [data, saveAndSync, showToast]
  );

  const reorderFormerPrincipal = useCallback(
    async (id: string, direction: 'up' | 'down') => {
      const list = [...data.formerPrincipals];
      const idx = list.findIndex((item) => item.id === id);
      if (idx === -1) return;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return;
      const [moved] = list.splice(idx, 1);
      list.splice(targetIdx, 0, moved);
      await saveAndSync({ ...data, formerPrincipals: list });
      showToast('Former principals order updated.');
    },
    [data, saveAndSync, showToast]
  );

  const upsertExamResult = useCallback(
    async (result: ExamResultItem) => {
      const exists = data.examResults.some((item) => item.id === result.id);
      const examResults = exists
        ? data.examResults.map((item) => (item.id === result.id ? result : item))
        : [result, ...data.examResults];
      await saveAndSync({ ...data, examResults });
      showToast(exists ? 'Exam result record updated.' : 'Exam result record added.');
    },
    [data, saveAndSync, showToast]
  );

  const deleteExamResult = useCallback(
    async (id: string) => {
      const examResults = data.examResults.filter((item) => item.id !== id);
      await saveAndSync({ ...data, examResults });
      showToast('Exam result record removed.', 'info');
    },
    [data, saveAndSync, showToast]
  );

  const updateAcademicsConfig = useCallback(
    async (academicsConfig: AcademicsConfig, academicsOverride?: AcademicProgram[]) => {
      await saveAndSync({
        ...data,
        academicsConfig,
        academics: academicsOverride ?? data.academics,
      });
      showToast('Academic Pathways configuration saved.');
    },
    [data, saveAndSync, showToast]
  );

  const upsertAcademicProgram = useCallback(
    async (program: AcademicProgram) => {
      const exists = data.academics.some((p) => p.id === program.id);
      const academics = exists
        ? data.academics.map((p) => (p.id === program.id ? program : p))
        : [...data.academics, program];
      await saveAndSync({ ...data, academics });
      showToast(exists ? 'Academic pathway card updated.' : 'New academic pathway card added.');
    },
    [data, saveAndSync, showToast]
  );

  const deleteAcademicProgram = useCallback(
    async (id: string) => {
      const academics = data.academics.filter((p) => p.id !== id);
      await saveAndSync({ ...data, academics });
      showToast('Academic pathway card removed.', 'info');
    },
    [data, saveAndSync, showToast]
  );

  const reorderAcademicProgram = useCallback(
    async (id: string, direction: 'up' | 'down') => {
      const list = [...data.academics];
      const idx = list.findIndex((item) => item.id === id);
      if (idx === -1) return;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return;
      const [moved] = list.splice(idx, 1);
      list.splice(targetIdx, 0, moved);
      await saveAndSync({ ...data, academics: list });
      showToast('Academic pathway card order updated.');
    },
    [data, saveAndSync, showToast]
  );

  const updateContactInfo = useCallback(
    async (contact: ContactInfo) => {
      const items = contact.items || [];
      const firstAddress = items.find((i) => i.type === 'address');
      const firstPhone = items.find((i) => i.type === 'phone');
      const firstEmail = items.find((i) => i.type === 'email');
      const firstHours = items.find((i) => i.type === 'hours');

      const syncedContact: ContactInfo = {
        ...contact,
        address: firstAddress ? firstAddress.value : contact.address,
        phone: firstPhone ? pickText(firstPhone.value, 'en') : contact.phone,
        email: firstEmail ? pickText(firstEmail.value, 'en') : contact.email,
        officeHours: firstHours ? firstHours.value : contact.officeHours,
      };

      await saveAndSync({ ...data, contact: syncedContact });
      showToast('Contact details, map & social links saved.');
    },
    [data, saveAndSync, showToast]
  );

  const updateFooterConfig = useCallback(
    async (footer: FooterConfig) => {
      await saveAndSync({ ...data, footer });
      showToast('Footer layout, columns, links & copyright saved.');
    },
    [data, saveAndSync, showToast]
  );

  const updateSmartSystems = useCallback(
    async (smartSystems: SmartSystemItem[]) => {
      await saveAndSync({ ...data, smartSystems });
      showToast('Smart Systems configuration saved.');
    },
    [data, saveAndSync, showToast]
  );

  const updateBrandTheme = useCallback(
    async (brandTheme: ThemeBrandConfig) => {
      await saveAndSync({ ...data, brandTheme });
      showToast(`Brand theme "${brandTheme.presetName}" applied live.`);
    },
    [data, saveAndSync, showToast]
  );

  const resetAllToDefaults = useCallback(async () => {
    try {
      const fresh = await resetSchoolDataToDefault(adminPassword);
      setData(fresh);
      showToast('All CMS data reset to default school records.', 'info');
    } catch (err) {
      handleProtectedApiError(err);
    }
  }, [adminPassword, handleProtectedApiError, showToast]);

  const submitContactInquiry = useCallback(
    async (input: Omit<InquiryMessage, 'id' | 'submittedAt' | 'status'>) => {
      const created = await createInquiry(input);
      setInquiries((prev) => [created, ...prev]);
    },
    []
  );

  const markInquiryRead = useCallback(async (id: string) => {
    const updated = await markInquiryAsRead(id);
    setInquiries(updated);
  }, []);

  const loginAdmin = useCallback(async (password: string) => {
    const result = await verifyAdminPassword(password);
    if (result.ok) {
      setAdminPassword(password);
    }
    return result;
  }, []);

  const logoutAdmin = useCallback(() => {
    setAdminPassword('');
    showToast('Signed out of Admin Portal.', 'info');
  }, [showToast]);

  return (
    <SchoolDataContext.Provider
      value={{
        data,
        isLoading,
        language,
        setLanguage,
        toggleLanguage,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        strings: UI_STRINGS[language],
        toasts,
        showToast,
        dismissToast,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        uploadAdminImage,
        uploadAdminAttachment,
        inquiries,
        updateGeneralAndHero,
        resetSchoolLogo,
        updatePrincipalAndStats,
        upsertNotice,
        deleteNotice,
        togglePinNotice,
        upsertAchievement,
        deleteAchievement,
        upsertGalleryPhoto,
        deleteGalleryPhoto,
        upsertSchoolGlimpse,
        deleteSchoolGlimpse,
        reorderSchoolGlimpse,
        upsertStaffMember,
        deleteStaffMember,
        reorderStaffMember,
        upsertFormerPrincipal,
        deleteFormerPrincipal,
        reorderFormerPrincipal,
        upsertExamResult,
        deleteExamResult,
        updateAcademicsConfig,
        upsertAcademicProgram,
        deleteAcademicProgram,
        reorderAcademicProgram,
        updateContactInfo,
        updateFooterConfig,
        updateSmartSystems,
        updateBrandTheme,
        resetAllToDefaults,
        submitContactInquiry,
        markInquiryRead,
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
};

export function useSchoolData(): SchoolDataContextValue {
  const ctx = useContext(SchoolDataContext);
  if (!ctx) {
    throw new Error('useSchoolData must be used inside SchoolDataProvider');
  }
  return ctx;
}

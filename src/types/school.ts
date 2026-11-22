export type Language = 'en' | 'ta';
export type ThemeMode = 'light' | 'dark';
export type PublicTab =
  | 'home'
  | 'heritage'
  | 'academics'
  | 'staff'
  | 'formerPrincipals'
  | 'examResults'
  | 'notices'
  | 'achievements'
  | 'gallery'
  | 'contact';

export interface BilingualText {
  en: string;
  ta: string;
}

export interface SchoolStats {
  students: number;
  academicStaff: number;
  nonAcademicStaff: number;
  prefects: number;
}

export interface ClassStrengthItem {
  id: string;
  grade: BilingualText;
  boys: number;
  girls: number;
}

export interface HeroConfig {
  title: BilingualText;
  subtitle: BilingualText;
  eyebrow: BilingualText;
  bannerUrl: string;
}

export interface HeritageConfig {
  foundedYear: string;
  foundedBy: BilingualText;
  history: BilingualText;
  vision: BilingualText;
  mission: BilingualText;
  motto: BilingualText;
  mottoExplanation: BilingualText;
  anthemTitle: BilingualText;
  anthemVerses: {
    en: string[];
    ta: string[];
  };
}

export interface PrincipalConfig {
  name: BilingualText;
  credentials: BilingualText;
  tenure: BilingualText;
  photoUrl: string;
  summaryMessage: BilingualText;
  fullMessage: BilingualText;
}

export type NoticeCategory = 'Exams' | 'Circulars' | 'Events';

export interface NoticeAttachment {
  name: string;
  mimeType: string;
  dataUrl: string;
}

export interface NoticeItem {
  id: string;
  title: BilingualText;
  summary: BilingualText;
  content: BilingualText;
  category: NoticeCategory;
  date: string;
  pinned: boolean;
  referenceCode: string;
  attachment?: NoticeAttachment;
}

export type AchievementCategory = 'Academic' | 'Sports' | 'Co-Curricular';

export interface AchievementItem {
  id: string;
  title: BilingualText;
  recipient: BilingualText;
  description: BilingualText;
  category: AchievementCategory;
  year: string;
  distinction: BilingualText;
  photoUrl?: string;
}

export type GalleryCategory = 'Campus' | 'Academics' | 'Sports' | 'Cultural';

export interface GalleryPhoto {
  id: string;
  url: string;
  photos?: string[];
  caption: BilingualText;
  category: GalleryCategory;
  date: string;
}

export interface SchoolGlimpse {
  id: string;
  url: string;
  caption: BilingualText;
  date?: string;
}

export type StaffSectionCategory = 'Primary' | 'Secondary' | 'GCE A/L';

export interface StaffMember {
  id: string;
  name: BilingualText;
  role: BilingualText;
  qualifications?: BilingualText;
  category: StaffSectionCategory;
  photoUrl: string;
}

export interface FormerPrincipal {
  id: string;
  name: BilingualText;
  tenure: BilingualText;
  note?: BilingualText;
  photoUrl?: string;
}

export type ExamCategory = 'Scholarship' | 'O/L' | 'A/L';

export interface ExamTopPerformer {
  id: string;
  name: BilingualText;
  achievement: BilingualText;
  photoUrl?: string;
}

export interface ExamResultItem {
  id: string;
  category: ExamCategory;
  year: string;
  passPercentage: string;
  summary?: BilingualText;
  topPerformers: ExamTopPerformer[];
  photos?: string[];
}

export type SmartSystemIconKey = 'relief' | 'attendance' | 'marks' | 'bell';

export interface SmartSystemItem {
  id: string;
  iconKey: SmartSystemIconKey;
  title: BilingualText;
  description: BilingualText;
  url: string;
  enabled: boolean;
}

export type AcademicStage = string;

export type AcademicIconKey =
  | 'book'
  | 'graduation'
  | 'compass'
  | 'chart'
  | 'cpu'
  | 'flask'
  | 'palette'
  | 'globe'
  | 'code'
  | 'calculator'
  | 'award';

export interface AcademicFilterTab {
  id: string;
  label: BilingualText;
  isAll?: boolean;
}

export interface AcademicsConfig {
  kicker: BilingualText;
  heading: BilingualText;
  subtitle: BilingualText;
  subjectsHeading: BilingualText;
  filters: AcademicFilterTab[];
}

export interface AcademicProgram {
  id: string;
  stage: AcademicStage;
  streamCode: string;
  title: BilingualText;
  grades: BilingualText;
  overview: BilingualText;
  subjects: {
    en: string[];
    ta: string[];
  };
  pathways?: BilingualText;
  iconKey?: AcademicIconKey;
  iconImageUrl?: string;
}

export interface ContactInfo {
  address: BilingualText;
  phone: string;
  email: string;
  officeHours: BilingualText;
  schoolType: BilingualText;
  mapEmbedUrl: string;
}

export interface ThemeBrandConfig {
  primaryColor: string;
  accentColor: string;
  presetName: string;
}

export interface InquiryMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'unread' | 'read';
}

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface SchoolData {
  schoolName: BilingualText;
  shortName: BilingualText;
  schoolLogoUrl: string;
  tickerAnnouncements: BilingualText[];
  hero: HeroConfig;
  stats: SchoolStats;
  studentStrength: ClassStrengthItem[];
  principal: PrincipalConfig;
  heritage: HeritageConfig;
  academicsConfig: AcademicsConfig;
  academics: AcademicProgram[];
  notices: NoticeItem[];
  achievements: AchievementItem[];
  gallery: GalleryPhoto[];
  schoolGlimpses: SchoolGlimpse[];
  staffMembers: StaffMember[];
  formerPrincipals: FormerPrincipal[];
  examResults: ExamResultItem[];
  smartSystems: SmartSystemItem[];
  contact: ContactInfo;
  brandTheme: ThemeBrandConfig;
  updatedAt: string;
}

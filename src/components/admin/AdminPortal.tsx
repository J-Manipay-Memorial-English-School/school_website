import React, { useState } from 'react';
import {
  Award,
  Bell,
  Cpu,
  ExternalLink,
  GraduationCap,
  History,
  Image,
  LayoutDashboard,
  LogOut,
  Moon,
  Palette,
  Sun,
  Trophy,
  Users,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { SchoolCrest } from '../SchoolCrest';
import { AdminAchievementsGalleryPanel } from './AdminAchievementsGalleryPanel';
import { AdminExamResultsPanel } from './AdminExamResultsPanel';
import { AdminFormerPrincipalsPanel } from './AdminFormerPrincipalsPanel';
import { AdminGeneralPanel } from './AdminGeneralPanel';
import { AdminHomeGalleryPanel } from './AdminHomeGalleryPanel';
import { AdminLogin } from './AdminLogin';
import { AdminNoticesPanel } from './AdminNoticesPanel';
import { AdminPrincipalStatsPanel } from './AdminPrincipalStatsPanel';
import { AdminSmartSystemsPanel } from './AdminSmartSystemsPanel';
import { AdminStaffPanel } from './AdminStaffPanel';
import { AdminThemeBrandPanel } from './AdminThemeBrandPanel';

type AdminTab =
  | 'general'
  | 'principal'
  | 'staff'
  | 'formerPrincipals'
  | 'examResults'
  | 'homeGallery'
  | 'smartSystems'
  | 'notices'
  | 'achievements'
  | 'brand';

interface AdminPortalProps {
  onBackToSite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToSite }) => {
  const { isAdminAuthenticated, logoutAdmin, themeMode, toggleThemeMode, data } = useSchoolData();
  const [activeTab, setActiveTab] = useState<AdminTab>('general');

  if (!isAdminAuthenticated) {
    return <AdminLogin onBackToSite={onBackToSite} />;
  }

  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'general', label: 'General, Crest & Hero', icon: LayoutDashboard },
    { id: 'principal', label: 'Stats, Strength & Principal', icon: Users },
    { id: 'staff', label: 'Teachers / Staff', icon: GraduationCap },
    { id: 'formerPrincipals', label: 'Former Principals', icon: History },
    { id: 'examResults', label: 'Exam Results', icon: Trophy },
    { id: 'homeGallery', label: 'School Glimpses', icon: Image },
    { id: 'smartSystems', label: 'Smart Systems', icon: Cpu },
    { id: 'notices', label: 'Notices Manager', icon: Bell },
    { id: 'achievements', label: 'Achievements & Gallery', icon: Award },
    { id: 'brand', label: 'Theme & Brand Studio', icon: Palette },
  ];

  const activeLabel = navItems.find((i) => i.id === activeTab)?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col lg:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-[270px] shrink-0 border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3">
            <SchoolCrest className="w-9 h-9 shrink-0" />
            <div className="min-w-0">
              <div className="font-display text-sm font-semibold truncate">
                {data.shortName.en}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                School Admin CMS
              </div>
            </div>
          </div>

          <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'text-white'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                  style={active ? { backgroundColor: 'var(--brand-primary)' } : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:block p-4 border-t border-stone-200 dark:border-stone-800 space-y-2">
          <button
            type="button"
            onClick={onBackToSite}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            <span>View Live Site</span>
          </button>
          <button
            type="button"
            onClick={logoutAdmin}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 px-4 sm:px-8 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 truncate">
            <span>Admin CMS</span>
            <span className="mx-2">/</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              {activeLabel}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleThemeMode}
              className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
              aria-label="Toggle theme"
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>

            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              <span>View Live Site</span>
            </button>

            <button
              type="button"
              onClick={logoutAdmin}
              className="lg:hidden p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 cursor-pointer"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'general' && <AdminGeneralPanel />}
          {activeTab === 'principal' && <AdminPrincipalStatsPanel />}
          {activeTab === 'staff' && <AdminStaffPanel />}
          {activeTab === 'formerPrincipals' && <AdminFormerPrincipalsPanel />}
          {activeTab === 'examResults' && <AdminExamResultsPanel />}
          {activeTab === 'homeGallery' && <AdminHomeGalleryPanel />}
          {activeTab === 'smartSystems' && <AdminSmartSystemsPanel />}
          {activeTab === 'notices' && <AdminNoticesPanel />}
          {activeTab === 'achievements' && <AdminAchievementsGalleryPanel />}
          {activeTab === 'brand' && <AdminThemeBrandPanel />}
        </main>
      </div>
    </div>
  );
};

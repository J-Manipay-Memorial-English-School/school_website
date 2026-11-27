import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Globe, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { PublicTab } from '../types/school';
import { pickText } from '../utils/schoolHelpers';
import { SchoolCrest } from './SchoolCrest';

interface HeaderProps {
  activeTab: PublicTab;
  onSelectTab: (tab: PublicTab) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
}) => {
  const { data, language, toggleLanguage, themeMode, toggleThemeMode, strings } = useSchoolData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PublicTab; label: string }[] = [
    { id: 'home', label: strings.nav.home },
    { id: 'heritage', label: strings.nav.heritage },
    { id: 'academics', label: strings.nav.academics },
    { id: 'staff', label: strings.nav.staff },
    { id: 'formerPrincipals', label: strings.nav.formerPrincipals },
    { id: 'examResults', label: strings.nav.examResults },
    { id: 'notices', label: strings.nav.notices },
    { id: 'achievements', label: strings.nav.achievements },
    { id: 'gallery', label: strings.nav.gallery },
    { id: 'contact', label: strings.nav.contact },
  ];

  const handleNavClick = (tab: PublicTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Live Announcement Ticker */}
      {data.tickerAnnouncements.length > 0 && (
        <div
          className="w-full text-white text-xs sm:text-[13px] py-2 border-b border-white/15 overflow-hidden"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4">
            <span className="font-semibold tracking-wide shrink-0 uppercase text-[11px] opacity-90 border-r border-white/25 pr-3">
              {pickText(data.headerTickerLabel, language) || strings.header.tickerLabel}
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee">
                {[...data.tickerAnnouncements, ...data.tickerAnnouncements].map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center whitespace-nowrap mr-12 text-white/95"
                  >
                    <span>{pickText(item, language)}</span>
                    <span className="ml-12 opacity-40" aria-hidden="true">
                      ·
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Glassmorphic Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#FBF9F5]/90 dark:bg-stone-950/90 border-b border-stone-200/80 dark:border-stone-800/80 transition-colors duration-200">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 h-16 flex items-center justify-between gap-1.5 xl:gap-3">
          {/* Brand Zone: Crest + Compact Single-Line Title */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            title={pickText(data.schoolName, language)}
            className="flex items-center gap-2 min-w-0 shrink-0 text-left group cursor-pointer px-1.5 py-1 -ml-1.5 rounded-xl hover:bg-stone-100/80 dark:hover:bg-stone-900/70 transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            <SchoolCrest className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-150 group-hover:scale-105" />
            <span
              className={`font-display font-semibold tracking-tight text-stone-900 dark:text-stone-50 whitespace-nowrap truncate ${
                language === 'ta'
                  ? 'text-[11.5px] sm:text-[12.5px] max-w-[105px] sm:max-w-[125px] xl:max-w-[155px]'
                  : 'text-sm sm:text-[15px] max-w-[140px] sm:max-w-[175px] xl:max-w-[205px]'
              }`}
            >
              {pickText(data.shortName, language)}
            </span>
          </button>

          {/* Dedicated Tab Navigation Links (Single-line, Tamil-safe spacing) */}
          <nav
            className={`hidden lg:flex items-center justify-center min-w-0 ${
              language === 'ta' ? 'gap-0.5 xl:gap-1 2xl:gap-2' : 'gap-1 xl:gap-2.5 2xl:gap-3.5'
            }`}
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1.5 px-1 xl:px-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    language === 'ta'
                      ? 'text-[10px] xl:text-[11px] 2xl:text-[12.5px]'
                      : 'text-[11.5px] xl:text-[12.5px] 2xl:text-sm'
                  } ${
                    isActive
                      ? 'font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-accent)]'
                      : 'font-medium text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute left-1.5 right-1.5 bottom-0 h-[2px] rounded-full transition-opacity duration-150 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </nav>

          {/* Utility Controls: Search, Bilingual Switch, Light/Dark Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onOpenSearch}
              className="inline-flex items-center gap-1.5 p-2 xl:px-2.5 xl:py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100/90 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              aria-label={strings.header.searchTitle}
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden 2xl:inline font-mono-num text-[11px] text-stone-500 dark:text-stone-400">
                Ctrl+K
              </span>
            </button>

            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              aria-label="Switch language between English and Tamil"
            >
              <Globe
                className="w-3.5 h-3.5 text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shrink-0"
                aria-hidden="true"
              />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            <button
              type="button"
              onClick={toggleThemeMode}
              className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
              aria-label={strings.header.toggleTheme}
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
              aria-label={strings.header.openMenu}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="lg:hidden overflow-hidden border-t border-stone-200 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950"
              aria-label="Mobile navigation"
            >
              <div className="px-4 py-4 grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'text-white font-semibold'
                          : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900'
                      }`}
                      style={isActive ? { backgroundColor: 'var(--brand-primary)' } : undefined}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

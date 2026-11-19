import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AcademicsSection } from './components/AcademicsSection';
import { AchievementsSection } from './components/AchievementsSection';
import { AdminPortal } from './components/admin/AdminPortal';
import { CommandSearchModal } from './components/CommandSearchModal';
import { ContactSection } from './components/ContactSection';
import { ExamResultsSection } from './components/ExamResultsSection';
import { Footer } from './components/Footer';
import { FormerPrincipalsSection } from './components/FormerPrincipalsSection';
import { GallerySection } from './components/GallerySection';
import { Header } from './components/Header';
import { HeritageSection } from './components/HeritageSection';
import { HeroSection } from './components/HeroSection';
import { HomeGallerySection } from './components/HomeGallerySection';
import { MottoSpotlight } from './components/MottoSpotlight';
import { NoticesSection } from './components/NoticesSection';
import { PrincipalDesk } from './components/PrincipalDesk';
import { SmartSystemsSection } from './components/SmartSystemsSection';
import { StaffSection } from './components/StaffSection';
import { StatsBar } from './components/StatsBar';
import { ToastContainer } from './components/ToastContainer';
import { SchoolDataProvider } from './context/SchoolDataContext';
import { NoticeItem, PublicTab } from './types/school';

function AppShell() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return window.location.pathname.replace(/\/+$/, '') === '/admin';
  });
  const [activeTab, setActiveTab] = useState<PublicTab>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  useEffect(() => {
    const onPopState = () => {
      setIsAdminRoute(window.location.pathname.replace(/\/+$/, '') === '/admin');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Global Ctrl+K shortcut for quick academic search on public view
  useEffect(() => {
    if (isAdminRoute) return;
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isAdminRoute]);

  const handleSelectTab = useCallback((tab: PublicTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToAdmin = useCallback(() => {
    if (window.location.pathname !== '/admin') {
      window.history.pushState({}, '', '/admin');
    }
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const navigateToPublic = useCallback(() => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <>
      {isAdminRoute ? (
        <AdminPortal onBackToSite={navigateToPublic} />
      ) : (
        <div className="min-h-screen flex flex-col bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100">
          <Header
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          <main className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div
                  key="tab-home"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <HeroSection onSelectTab={handleSelectTab} />
                  <StatsBar />
                  <MottoSpotlight />
                  <PrincipalDesk />
                  <HomeGallerySection />
                  <SmartSystemsSection />
                </motion.div>
              )}

              {activeTab === 'heritage' && (
                <motion.div
                  key="tab-heritage"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <HeritageSection />
                </motion.div>
              )}

              {activeTab === 'academics' && (
                <motion.div
                  key="tab-academics"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <AcademicsSection />
                </motion.div>
              )}

              {activeTab === 'staff' && (
                <motion.div
                  key="tab-staff"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <StaffSection />
                </motion.div>
              )}

              {activeTab === 'formerPrincipals' && (
                <motion.div
                  key="tab-former-principals"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormerPrincipalsSection />
                </motion.div>
              )}

              {activeTab === 'examResults' && (
                <motion.div
                  key="tab-exam-results"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExamResultsSection />
                </motion.div>
              )}

              {activeTab === 'notices' && (
                <motion.div
                  key="tab-notices"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <NoticesSection
                    selectedNotice={selectedNotice}
                    onSelectNotice={setSelectedNotice}
                  />
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  key="tab-achievements"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <AchievementsSection />
                </motion.div>
              )}

              {activeTab === 'gallery' && (
                <motion.div
                  key="tab-gallery"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <GallerySection />
                </motion.div>
              )}

              {activeTab === 'contact' && (
                <motion.div
                  key="tab-contact"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <ContactSection />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <Footer onSelectTab={handleSelectTab} onOpenAdmin={navigateToAdmin} />

          <CommandSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectTab={handleSelectTab}
            onSelectNotice={(notice) => {
              setSelectedNotice(notice);
            }}
          />
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <SchoolDataProvider>
      <AppShell />
    </SchoolDataProvider>
  );
}

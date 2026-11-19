import React from 'react';
import { Lock } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { PublicTab } from '../types/school';
import { pickText } from '../utils/schoolHelpers';
import { SchoolCrest } from './SchoolCrest';

interface FooterProps {
  onSelectTab: (tab: PublicTab) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenAdmin }) => {
  const { data, language, strings } = useSchoolData();

  const quickTabs: { id: PublicTab; label: string }[] = [
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

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-stone-800">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <SchoolCrest className="w-9 h-9 shrink-0" />
              <span className="font-display text-lg font-semibold text-white">
                {pickText(data.schoolName, language)}
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md">
              {strings.footer.description}
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-stone-400 mb-4">
              {strings.footer.quickLinks}
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {quickTabs.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => onSelectTab(t.id)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-stone-400 mb-4">
              {strings.footer.schoolInfo}
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>{pickText(data.contact.address, language)}</li>
              <li className="font-mono-num">{data.contact.phone}</li>
              <li>{data.contact.email}</li>
              <li>{pickText(data.contact.schoolType, language)}</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} {strings.footer.copyright}
          </p>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded"
          >
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{strings.footer.adminPortal}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

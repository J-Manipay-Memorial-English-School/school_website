import React from 'react';
import { ExternalLink, Lock } from 'lucide-react';
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

  const footer = data.footer;
  const columns = footer?.columns ?? [];
  const socialLinks = data.contact?.socialLinks ?? [];
  const descriptionText =
    pickText(footer?.description, language) || strings.footer.description;
  const copyrightText =
    pickText(footer?.copyrightText, language) || strings.footer.copyright;
  const adminLabelText =
    pickText(footer?.adminPortalLabel, language) || strings.footer.adminPortal;
  const showYear = footer?.showYearPrefix !== false;

  const columnsGridClass =
    columns.length <= 1
      ? 'grid-cols-1'
      : columns.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-10 border-b border-stone-800">
          {/* School Identity & Brand Summary */}
          <div className={columns.length > 0 ? 'lg:col-span-5' : 'lg:col-span-12'}>
            <div className="flex items-center gap-3 mb-4">
              <SchoolCrest className="w-9 h-9 shrink-0" />
              <span className="font-display text-lg font-semibold text-white">
                {pickText(data.schoolName, language)}
              </span>
            </div>
            {descriptionText && (
              <p className="text-sm text-stone-400 leading-relaxed max-w-md">
                {descriptionText}
              </p>
            )}

            {footer?.showSocialLinks !== false && socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-5">
                {socialLinks.map((link) => {
                  const labelText = pickText(link.label, language) || link.platform;
                  const isExternal = /^https?:\/\//i.test(link.url);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-600 transition-colors"
                    >
                      <span>{labelText}</span>
                      {isExternal && <ExternalLink className="w-3 h-3 opacity-70" aria-hidden="true" />}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dynamic Footer Columns */}
          {columns.length > 0 && (
            <div className={`lg:col-span-7 grid ${columnsGridClass} gap-8`}>
              {columns.map((col) => {
                const colTitle = pickText(col.title, language);
                const listLayout =
                  col.layout === 'two-col'
                    ? 'grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm'
                    : 'space-y-2.5 text-sm';

                return (
                  <div key={col.id}>
                    {colTitle && (
                      <h3 className="text-xs uppercase tracking-widest font-semibold text-stone-400 mb-4">
                        {colTitle}
                      </h3>
                    )}
                    <ul className={listLayout}>
                      {col.links.map((item) => {
                        const labelText = pickText(item.label, language);
                        if (!labelText) return null;

                        if (item.linkType === 'tab' && item.tab) {
                          return (
                            <li key={item.id}>
                              <button
                                type="button"
                                onClick={() => onSelectTab(item.tab!)}
                                className="hover:text-white transition-colors text-left cursor-pointer"
                              >
                                {labelText}
                              </button>
                            </li>
                          );
                        }

                        if (item.linkType === 'url' && item.url?.trim()) {
                          const isExternal = /^https?:\/\//i.test(item.url);
                          return (
                            <li key={item.id}>
                              <a
                                href={item.url}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                className="inline-flex items-center gap-1 hover:text-white transition-colors text-stone-400 break-words"
                              >
                                <span>{labelText}</span>
                                {isExternal && (
                                  <ExternalLink className="w-3 h-3 shrink-0 opacity-70" aria-hidden="true" />
                                )}
                              </a>
                            </li>
                          );
                        }

                        return (
                          <li key={item.id} className="text-stone-400 break-words">
                            {labelText}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            {showYear ? `© ${new Date().getFullYear()} ` : ''}
            {copyrightText}
          </p>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded"
          >
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{adminLabelText}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};


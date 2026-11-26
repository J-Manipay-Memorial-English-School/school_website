import React from 'react';
import {
  Clock,
  ExternalLink,
  Globe,
  Info,
  Mail,
  MapPin,
  Phone,
  Share2,
} from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { ContactItemType, SocialPlatform } from '../types/school';
import { pickText } from '../utils/schoolHelpers';
import { FormattedText } from './FormattedText';

function getContactItemIcon(type: ContactItemType) {
  switch (type) {
    case 'address':
      return MapPin;
    case 'phone':
      return Phone;
    case 'email':
      return Mail;
    case 'hours':
      return Clock;
    case 'website':
      return Globe;
    case 'social':
      return Share2;
    default:
      return Info;
  }
}

function resolveContactHref(type: ContactItemType, rawValue: string, explicitHref?: string): string {
  const custom = explicitHref?.trim();
  if (custom) return custom;
  const val = rawValue.trim();
  if (!val) return '';
  if (type === 'email' && val.includes('@')) return `mailto:${val}`;
  if (type === 'phone') return `tel:${val.replace(/[^+\d]/g, '')}`;
  if (type === 'website' && /^https?:\/\//i.test(val)) return val;
  return '';
}

function getPlatformBadge(platform: SocialPlatform): string {
  switch (platform) {
    case 'facebook':
      return 'FB';
    case 'youtube':
      return 'YT';
    case 'instagram':
      return 'IG';
    case 'whatsapp':
      return 'WA';
    case 'linkedin':
      return 'IN';
    case 'twitter':
      return 'X';
    case 'email':
      return '@';
    default:
      return 'WEB';
  }
}

export const ContactSection: React.FC = () => {
  const { data, language, strings } = useSchoolData();

  const kickerText =
    pickText(data.contact.kicker, language) || strings.contact.kicker;
  const headingText =
    pickText(data.contact.heading, language) || strings.contact.heading;
  const subtitleText =
    pickText(data.contact.subtitle, language) || strings.contact.subtitle;
  const mapTitleText =
    pickText(data.contact.mapTitle, language) ||
    `${pickText(data.schoolName, language)} Map`;

  const contactItems = data.contact.items ?? [];
  const socialLinks = data.contact.socialLinks ?? [];

  const gridColsClass =
    contactItems.length === 1
      ? 'grid-cols-1 max-w-md mx-auto'
      : contactItems.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : contactItems.length === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <section id="contact" className="py-14 lg:py-20 bg-[#FBF9F5] dark:bg-stone-950 min-h-[72vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          {kickerText && (
            <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
              {kickerText}
            </p>
          )}
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
            {headingText}
          </h2>
          {subtitleText && (
            <FormattedText
              text={subtitleText}
              className="space-y-2 text-stone-600 dark:text-stone-300 text-base leading-relaxed"
            />
          )}
        </div>

        <div className="space-y-6">
          {/* Dynamic Contact Details Grid */}
          {contactItems.length > 0 && (
            <div className={`grid ${gridColsClass} gap-4`}>
              {contactItems.map((item) => {
                const Icon = getContactItemIcon(item.type);
                const labelText = pickText(item.label, language);
                const valueText = pickText(item.value, language);
                const href = resolveContactHref(item.type, valueText, item.href);
                const isExternal = /^https?:\/\//i.test(href);

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5"
                  >
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mb-2">
                      <Icon
                        className="w-4 h-4 text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shrink-0"
                        aria-hidden="true"
                      />
                      <span>{labelText}</span>
                    </div>
                    {href ? (
                      <a
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className={`inline-flex items-center gap-1.5 text-sm font-medium text-stone-900 dark:text-stone-100 hover:underline leading-relaxed break-words ${
                          item.type === 'phone' ? 'font-mono-num' : ''
                        } ${item.type === 'email' || item.type === 'website' ? 'break-all' : ''}`}
                      >
                        <span className="whitespace-pre-line">{valueText}</span>
                        {isExternal && <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" aria-hidden="true" />}
                      </a>
                    ) : (
                      <FormattedText
                        text={valueText}
                        className={`space-y-1.5 text-sm font-medium text-stone-900 dark:text-stone-100 leading-relaxed break-words ${
                          item.type === 'phone' ? 'font-mono-num' : ''
                        } ${item.type === 'email' ? 'break-all' : ''}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Social & Quick Links Row */}
          {socialLinks.length > 0 && (
            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 flex flex-wrap items-center justify-center gap-3">
              {socialLinks.map((link) => {
                const labelText = pickText(link.label, language) || link.platform;
                const isExternal = /^https?:\/\//i.test(link.url);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 hover:border-stone-400 dark:hover:border-stone-500 transition-colors"
                  >
                    <span
                      className="text-[10px] font-mono-num font-bold px-1.5 py-0.5 rounded text-white"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                      {getPlatformBadge(link.platform)}
                    </span>
                    <span>{labelText}</span>
                    {isExternal && <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />}
                  </a>
                );
              })}
            </div>
          )}

          {/* Responsive Embedded Map */}
          {data.contact.mapEmbedUrl?.trim() && (
            <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-200 dark:bg-stone-800 shadow-sm h-[360px] sm:h-[420px]">
              <iframe
                title={mapTitleText}
                src={data.contact.mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};


import React from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { pickText } from '../utils/schoolHelpers';

export const ContactSection: React.FC = () => {
  const { data, language, strings } = useSchoolData();

  return (
    <section id="contact" className="py-14 lg:py-20 bg-[#FBF9F5] dark:bg-stone-950 min-h-[72vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
            {strings.contact.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
            {strings.contact.heading}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed">
            {strings.contact.subtitle}
          </p>
        </div>

        <div className="space-y-6">
          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mb-2">
                <MapPin
                  className="w-4 h-4 text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shrink-0"
                  aria-hidden="true"
                />
                <span>{strings.contact.addressLabel}</span>
              </div>
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100 leading-relaxed">
                {pickText(data.contact.address, language)}
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mb-2">
                <Phone
                  className="w-4 h-4 text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shrink-0"
                  aria-hidden="true"
                />
                <span>{strings.contact.phoneLabel}</span>
              </div>
              <p className="text-sm font-medium font-mono-num text-stone-900 dark:text-stone-100">
                {data.contact.phone}
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mb-2">
                <Mail
                  className="w-4 h-4 text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shrink-0"
                  aria-hidden="true"
                />
                <span>{strings.contact.emailLabel}</span>
              </div>
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100 break-all">
                {data.contact.email}
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mb-2">
                <Clock
                  className="w-4 h-4 text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shrink-0"
                  aria-hidden="true"
                />
                <span>{strings.contact.hoursLabel}</span>
              </div>
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100 leading-relaxed">
                {pickText(data.contact.officeHours, language)}
              </p>
            </div>
          </div>

          {/* Responsive Embedded Google Map centered on Manipay, Jaffna */}
          <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-200 dark:bg-stone-800 shadow-sm h-[360px] sm:h-[420px]">
            <iframe
              title="J/Manipay Memorial English School Map — Manipay, Jaffna"
              src={data.contact.mapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

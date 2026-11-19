import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { PublicTab } from '../types/school';
import { pickText } from '../utils/schoolHelpers';
import { SafeImage } from './SafeImage';
import { SchoolCrest } from './SchoolCrest';

interface HeroSectionProps {
  onSelectTab: (tab: PublicTab) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectTab }) => {
  const { data, language, strings } = useSchoolData();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 72]);

  return (
    <section
      id="top"
      className="relative w-full min-h-[560px] lg:min-h-[640px] flex items-end overflow-hidden bg-stone-950"
    >
      {/* Parallax School Photography */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -top-8 -bottom-8 will-change-transform"
      >
        <SafeImage
          src={data.hero.bannerUrl}
          alt={pickText(data.schoolName, language)}
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Measured Contrast Scrim */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-stone-950/30"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-14 lg:pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3.5 mb-5"
          >
            <SchoolCrest className="w-12 h-12 sm:w-14 sm:h-14 shadow-md" />
            <div>
              <div className="text-xs sm:text-sm font-semibold text-white/95 tracking-wide">
                {pickText(data.schoolName, language)}
              </div>
              <p className="text-xs font-medium tracking-wider text-stone-300 mt-0.5">
                {pickText(data.hero.eyebrow, language)}
              </p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-semibold text-white leading-[1.12] tracking-tight mb-5"
          >
            {pickText(data.hero.title, language)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-stone-200 leading-relaxed max-w-2xl mb-8"
          >
            {pickText(data.hero.subtitle, language)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              onClick={() => onSelectTab('academics')}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm font-semibold text-white shadow-lg transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <span>{strings.hero.exploreAcademics}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('contact')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-white/12 hover:bg-white/20 backdrop-blur-md border border-white/25 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>{strings.hero.contactLocation}</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { PublicTab } from '../types/school';
import { pickText } from '../utils/schoolHelpers';
import { FormattedText } from './FormattedText';
import { SafeImage } from './SafeImage';
import { SchoolCrest } from './SchoolCrest';

interface HeroSectionProps {
  onSelectTab: (tab: PublicTab) => void;
}

type ImageBrightness = 'dark' | 'medium' | 'bright';

function detectLowerRegionBrightness(src: string): Promise<ImageBrightness> {
  return new Promise((resolve) => {
    if (!src) {
      resolve('medium');
      return;
    }

    let settled = false;
    const finish = (value: ImageBrightness) => {
      if (!settled) {
        settled = true;
        resolve(value);
      }
    };

    const timeout = window.setTimeout(() => finish('medium'), 2500);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      window.clearTimeout(timeout);
      try {
        const w = 48;
        const h = 32;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          finish('medium');
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        // Inspect the lower 60% of the banner where text & CTAs sit
        const startRow = Math.floor(h * 0.4);
        const { data } = ctx.getImageData(0, startRow, w, h - startRow);
        let luminanceSum = 0;
        let samples = 0;
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 20) continue;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          luminanceSum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
          samples += 1;
        }
        if (samples === 0) {
          finish('medium');
          return;
        }
        const avg = luminanceSum / samples;
        if (avg >= 150) finish('bright');
        else if (avg <= 85) finish('dark');
        else finish('medium');
      } catch {
        // Cross-origin canvas read blocked; safe balanced fallback
        finish('medium');
      }
    };

    img.onerror = () => {
      window.clearTimeout(timeout);
      finish('medium');
    };

    img.src = src;
  });
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectTab }) => {
  const { data, language, strings } = useSchoolData();
  const [brightness, setBrightness] = useState<ImageBrightness>('medium');

  useEffect(() => {
    let active = true;
    detectLowerRegionBrightness(data.hero.bannerUrl).then((tone) => {
      if (active) setBrightness(tone);
    });
    return () => {
      active = false;
    };
  }, [data.hero.bannerUrl]);

  const scrimBackground =
    brightness === 'bright'
      ? 'linear-gradient(to top, rgba(12, 10, 9, 0.94) 0%, rgba(12, 10, 9, 0.76) 46%, rgba(12, 10, 9, 0.44) 100%)'
      : brightness === 'dark'
        ? 'linear-gradient(to top, rgba(12, 10, 9, 0.84) 0%, rgba(12, 10, 9, 0.44) 48%, rgba(12, 10, 9, 0.16) 100%)'
        : 'linear-gradient(to top, rgba(12, 10, 9, 0.91) 0%, rgba(12, 10, 9, 0.62) 48%, rgba(12, 10, 9, 0.28) 100%)';

  const horizontalContrast =
    brightness === 'bright'
      ? 'linear-gradient(to right, rgba(12, 10, 9, 0.72) 0%, rgba(12, 10, 9, 0.42) 55%, rgba(12, 10, 9, 0.12) 100%)'
      : 'linear-gradient(to right, rgba(12, 10, 9, 0.52) 0%, rgba(12, 10, 9, 0.22) 55%, rgba(12, 10, 9, 0.04) 100%)';

  return (
    <section
      id="top"
      className="relative w-full min-h-[540px] lg:min-h-[620px] flex items-end overflow-hidden bg-stone-950"
    >
      {/* Campus Banner Photography */}
      <div className="absolute inset-0">
        <SafeImage
          src={data.hero.bannerUrl}
          alt={pickText(data.schoolName, language)}
          className="w-full h-full object-cover object-center transition-opacity duration-300"
        />
      </div>

      {/* Adaptive Dual Contrast Scrim calibrated to photo luminance */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: scrimBackground }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: horizontalContrast }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-14 lg:pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-5"
          >
            <SchoolCrest className="w-14 h-14 sm:w-16 sm:h-16 shadow-lg ring-2 ring-white/25" />
            <div className="min-w-0">
              <div
                className="font-display text-lg sm:text-2xl lg:text-[1.7rem] font-semibold text-white tracking-tight leading-snug"
                style={{ textShadow: '0 2px 12px rgba(0, 0, 0, 0.55)' }}
              >
                {pickText(data.schoolName, language)}
              </div>
              <p
                className="text-xs sm:text-sm font-medium tracking-wider text-stone-200/95 mt-0.5 whitespace-pre-line"
                style={{ textShadow: '0 1px 6px rgba(0, 0, 0, 0.5)' }}
              >
                {pickText(data.hero.eyebrow, language)}
              </p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold text-white leading-[1.12] tracking-tight mb-5 whitespace-pre-line"
            style={{ textShadow: '0 2px 16px rgba(0, 0, 0, 0.55)' }}
          >
            {pickText(data.hero.title, language)}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-[1.0625rem] text-stone-100/95 leading-relaxed max-w-2xl mb-8"
            style={{ textShadow: '0 1px 10px rgba(0, 0, 0, 0.55)' }}
          >
            <FormattedText
              text={pickText(data.hero.subtitle, language)}
              className="space-y-3"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3.5"
          >
            <button
              type="button"
              onClick={() => onSelectTab('academics')}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm font-semibold text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <span>
                {pickText(data.hero.primaryCtaLabel, language) || strings.hero.exploreAcademics}
              </span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('contact')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-stone-950/45 hover:bg-stone-950/65 backdrop-blur-md border border-white/30 transition-all duration-150 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>
                {pickText(data.hero.secondaryCtaLabel, language) || strings.hero.contactLocation}
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

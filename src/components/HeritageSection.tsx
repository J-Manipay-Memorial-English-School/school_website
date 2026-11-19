import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Compass, Pause, Play, RotateCcw, Shield, Sparkles } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { pickList, pickText } from '../utils/schoolHelpers';

type HeritageTab = 'history' | 'visionMission' | 'motto' | 'anthem';

export const HeritageSection: React.FC = () => {
  const { data, language, strings } = useSchoolData();
  const [activeTab, setActiveTab] = useState<HeritageTab>('history');
  const [isPlayingAnthem, setIsPlayingAnthem] = useState(false);
  const [activeStanza, setActiveStanza] = useState<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const verses = pickList(data.heritage.anthemVerses, language);

  const playSoftChime = (step: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      const notes = [261.63, 293.66, 329.63, 392.0];
      const freq = notes[step % notes.length];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.15);
    } catch {
      // Audio playback gracefully skipped if unavailable
    }
  };

  useEffect(() => {
    if (!isPlayingAnthem) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    playSoftChime(activeStanza);
    timerRef.current = window.setInterval(() => {
      setActiveStanza((prev) => {
        const next = (prev + 1) % Math.max(1, verses.length);
        playSoftChime(next);
        return next;
      });
    }, 4500);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlayingAnthem, verses.length]);

  const tabs: { id: HeritageTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'history', label: strings.heritage.tabs.history, icon: BookOpen },
    { id: 'visionMission', label: strings.heritage.tabs.visionMission, icon: Compass },
    { id: 'motto', label: strings.heritage.tabs.motto, icon: Shield },
    { id: 'anthem', label: strings.heritage.tabs.anthem, icon: Sparkles },
  ];

  return (
    <section
      id="heritage"
      className="py-14 lg:py-20 bg-[#FBF9F5] dark:bg-stone-950 min-h-[72vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 mb-2">
            {strings.heritage.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
            {strings.heritage.heading}
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed">
            {strings.heritage.subtitle}
          </p>
        </div>

        {/* Centered Sub-Navigation Tabs Row */}
        <div className="flex justify-center mb-10">
          <div
            className="flex flex-wrap justify-center gap-2 p-1.5 rounded-xl bg-stone-200/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
            role="tablist"
            aria-label={strings.heritage.heading}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panels */}
        <AnimatePresence mode="wait">
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 block mb-1">
                    {strings.heritage.foundedLabel}
                  </span>
                  <span
                    className="font-display text-4xl font-semibold font-mono-num"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    <span className="dark:text-[var(--brand-accent)]">
                      {data.heritage.foundedYear}
                    </span>
                  </span>
                </div>
                <div className="pt-5 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 block mb-1.5">
                    {strings.heritage.founderLabel}
                  </span>
                  <p className="text-base font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                    {pickText(data.heritage.foundedBy, language)}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8">
                <p className="text-base sm:text-lg text-stone-700 dark:text-stone-200 leading-relaxed max-w-3xl first-letter:text-4xl first-letter:font-display first-letter:font-semibold first-letter:float-left first-letter:mr-2.5 first-letter:leading-none first-letter:text-[var(--brand-primary)] dark:first-letter:text-[var(--brand-accent)]">
                  {pickText(data.heritage.history, language)}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'visionMission' && (
            <motion.div
              key="visionMission"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-7 sm:p-9">
                <span className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 block mb-3">
                  01 · {strings.heritage.visionLabel}
                </span>
                <p className="font-display text-xl sm:text-2xl text-stone-900 dark:text-stone-100 leading-snug">
                  {pickText(data.heritage.vision, language)}
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-7 sm:p-9">
                <span className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 block mb-3">
                  02 · {strings.heritage.missionLabel}
                </span>
                <p className="text-base sm:text-lg text-stone-700 dark:text-stone-200 leading-relaxed">
                  {pickText(data.heritage.mission, language)}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'motto' && (
            <motion.div
              key="motto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 sm:p-12 text-center"
            >
              <div className="max-w-2xl mx-auto">
                <span className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 block mb-3">
                  {strings.hero.mottoLabel}
                </span>
                <blockquote
                  className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold italic mb-6 py-4 border-y border-stone-200 dark:border-stone-800"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  <span className="dark:text-[var(--brand-accent)]">
                    “{pickText(data.heritage.motto, language)}”
                  </span>
                </blockquote>
                <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed">
                  {pickText(data.heritage.mottoExplanation, language)}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'anthem' && (
            <motion.div
              key="anthem"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 block mb-1">
                    {strings.heritage.tabs.anthem}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100">
                    {pickText(data.heritage.anthemTitle, language)}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAnthem((prev) => !prev)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    {isPlayingAnthem ? (
                      <>
                        <Pause className="w-4 h-4" aria-hidden="true" />
                        <span>{strings.heritage.pauseAnthem}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" aria-hidden="true" />
                        <span>{strings.heritage.playAnthem}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlayingAnthem(false);
                      setActiveStanza(0);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                    aria-label={strings.heritage.resetAnthem}
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{strings.heritage.resetAnthem}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {verses.map((verse, idx) => {
                  const isHighlighted = activeStanza === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveStanza(idx);
                        playSoftChime(idx);
                      }}
                      className={`text-left rounded-xl p-6 border transition-all cursor-pointer ${
                        isHighlighted
                          ? 'bg-white dark:bg-stone-900 border-[var(--brand-primary)] dark:border-[var(--brand-accent)] shadow-sm'
                          : 'bg-transparent border-stone-200 dark:border-stone-800 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="text-xs font-mono-num uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
                        {strings.heritage.stanzaPrefix} 0{idx + 1}
                      </div>
                      <p className="whitespace-pre-line font-display text-base leading-relaxed text-stone-800 dark:text-stone-200">
                        {verse}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

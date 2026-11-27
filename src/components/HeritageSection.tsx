import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Compass, Pause, Play, RotateCcw, Shield, Sparkles, Volume2 } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { pickList, pickText } from '../utils/schoolHelpers';
import { FormattedText } from './FormattedText';

type HeritageTab = 'history' | 'visionMission' | 'motto' | 'anthem';

function formatAudioClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export const HeritageSection: React.FC = () => {
  const { data, language, strings } = useSchoolData();
  const [activeTab, setActiveTab] = useState<HeritageTab>('history');
  const [isPlayingAnthem, setIsPlayingAnthem] = useState(false);
  const [activeStanza, setActiveStanza] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const verses = pickList(data.heritage.anthemVerses, language);
  const activeAnthemAudioUrl = data.heritage.anthemAudioUrl?.[language]?.trim() || '';
  const hasAudioRecording = Boolean(activeAnthemAudioUrl);

  // Cleanly stop/reset audio playback when switching language, switching tabs, or updating URL
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlayingAnthem(false);
    setCurrentTime(0);
    setDuration(0);
  }, [language, activeAnthemAudioUrl, activeTab]);

  const handleTogglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !hasAudioRecording) return;

    if (isPlayingAnthem) {
      audio.pause();
      setIsPlayingAnthem(false);
    } else {
      try {
        await audio.play();
        setIsPlayingAnthem(true);
      } catch {
        setIsPlayingAnthem(false);
      }
    }
  };

  const handleRestartAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlayingAnthem(false);
    setCurrentTime(0);
    setActiveStanza(0);
  };

  const tabs: { id: HeritageTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'history', label: strings.heritage.tabs.history, icon: BookOpen },
    { id: 'visionMission', label: strings.heritage.tabs.visionMission, icon: Compass },
    { id: 'motto', label: strings.heritage.tabs.motto, icon: Shield },
    { id: 'anthem', label: strings.heritage.tabs.anthem, icon: Sparkles },
  ];

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

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
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 ${
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
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
                <FormattedText
                  text={pickText(data.heritage.history, language)}
                  className="space-y-4 text-base sm:text-lg text-stone-700 dark:text-stone-200 leading-relaxed max-w-3xl"
                  firstParagraphClassName="first-letter:text-4xl first-letter:font-display first-letter:font-semibold first-letter:float-left first-letter:mr-2.5 first-letter:leading-none first-letter:text-[var(--brand-primary)] dark:first-letter:text-[var(--brand-accent)]"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'visionMission' && (
            <motion.div
              key="visionMission"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
            >
              <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-7 sm:p-9">
                <span className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 block mb-3">
                  01 · {strings.heritage.visionLabel}
                </span>
                <FormattedText
                  text={pickText(data.heritage.vision, language)}
                  className="space-y-3 font-display text-xl sm:text-2xl text-stone-900 dark:text-stone-100 leading-snug"
                />
              </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-7 sm:p-9">
                <span className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-stone-400 block mb-3">
                  02 · {strings.heritage.missionLabel}
                </span>
                <FormattedText
                  text={pickText(data.heritage.mission, language)}
                  className="space-y-3 text-base sm:text-lg text-stone-700 dark:text-stone-200 leading-relaxed"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'motto' && (
            <motion.div
              key="motto"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
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
                <FormattedText
                  text={pickText(data.heritage.mottoExplanation, language)}
                  className="space-y-3 text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'anthem' && (
            <motion.div
              key="anthem"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-10"
            >
              {hasAudioRecording && (
                <audio
                  ref={audioRef}
                  src={activeAnthemAudioUrl}
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    const dur = e.currentTarget.duration;
                    if (Number.isFinite(dur)) setDuration(dur);
                  }}
                  onTimeUpdate={(e) => {
                    const time = e.currentTarget.currentTime;
                    const dur = e.currentTarget.duration;
                    setCurrentTime(time);
                    if (Number.isFinite(dur) && dur > 0 && verses.length > 0) {
                      const nextIdx = Math.min(
                        verses.length - 1,
                        Math.floor((time / dur) * verses.length)
                      );
                      setActiveStanza(nextIdx);
                    }
                  }}
                  onEnded={() => {
                    setIsPlayingAnthem(false);
                    setCurrentTime(0);
                    setActiveStanza(0);
                  }}
                  onPause={() => setIsPlayingAnthem(false)}
                  onPlay={() => setIsPlayingAnthem(true)}
                />
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 block mb-1">
                    {strings.heritage.tabs.anthem}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100">
                    {pickText(data.heritage.anthemTitle, language)}
                  </h3>
                </div>

                {/* Strict Per-Language Rule: Play button renders ONLY when active language has an audio recording */}
                {hasAudioRecording && (
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98] cursor-pointer whitespace-nowrap"
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
                      onClick={handleRestartAudio}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-150 active:scale-[0.98] cursor-pointer"
                      aria-label={strings.heritage.resetAnthem}
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{strings.heritage.resetAnthem}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Compact progress bar shown only when active language has audio */}
              {hasAudioRecording && (isPlayingAnthem || currentTime > 0 || duration > 0) && (
                <div className="mb-6 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                  <Volume2
                    className="w-4 h-4 text-[var(--brand-primary)] dark:text-[var(--brand-accent)] shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex-1 h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-150"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: 'var(--brand-primary)',
                      }}
                    />
                  </div>
                  <span className="font-mono-num text-[11px] text-stone-500 dark:text-stone-400 shrink-0">
                    {formatAudioClock(currentTime)}
                    {duration > 0 ? ` / ${formatAudioClock(duration)}` : ''}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {verses.map((verse, idx) => {
                  const isHighlighted = activeStanza === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveStanza(idx)}
                      className={`text-left rounded-xl p-6 border transition-all duration-150 cursor-pointer ${
                        isHighlighted
                          ? 'bg-white dark:bg-stone-900 border-[var(--brand-primary)] dark:border-[var(--brand-accent)] shadow-sm'
                          : 'bg-transparent border-stone-200 dark:border-stone-800 opacity-80 hover:opacity-100'
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

import React from 'react';
import { DefaultAvatarKey } from '../../types/school';
import { DefaultAvatarArtwork } from '../ProfileAvatar';

export const AVATAR_CHOICES: { key: DefaultAvatarKey; label: string }[] = [
  { key: 'silhouette', label: 'Neutral' },
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' },
  { key: 'educator', label: 'Scholar' },
  { key: 'initials', label: 'Initials' },
];

interface DefaultAvatarPickerProps {
  value?: DefaultAvatarKey;
  namePreview?: string;
  onChange: (choice: DefaultAvatarKey) => void;
  compact?: boolean;
}

export const DefaultAvatarPicker: React.FC<DefaultAvatarPickerProps> = ({
  value = 'silhouette',
  namePreview = 'JM',
  onChange,
  compact = false,
}) => {
  return (
    <div className="space-y-1.5">
      <span className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400">
        Default Profile Icon (used when no photo is set)
      </span>
      <div className="flex flex-wrap gap-1.5">
        {AVATAR_CHOICES.map((opt) => {
          const selected = (value || 'silhouette') === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange(opt.key)}
              aria-pressed={selected}
              className={`inline-flex items-center gap-1.5 ${
                compact ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'
              } rounded-lg border font-medium transition-all cursor-pointer ${
                selected
                  ? 'border-[var(--brand-primary)] dark:border-[var(--brand-accent)] bg-stone-100 dark:bg-stone-800 text-stone-950 dark:text-white shadow-xs'
                  : 'border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600'
              }`}
            >
              <span className="w-5 h-5 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700 shrink-0 text-[9px]">
                <DefaultAvatarArtwork
                  choice={opt.key}
                  name={namePreview}
                  sizeClass="w-3.5 h-3.5"
                />
              </span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

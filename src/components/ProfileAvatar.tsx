import React, { useEffect, useState } from 'react';
import { GraduationCap, UserRound } from 'lucide-react';
import { DefaultAvatarKey } from '../types/school';

export function getProfileInitials(name: string): string {
  const cleaned = (name || '')
    .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Rev\.|Prof\.|திருமதி|திரு\.|செல்வி)\s*/i, '')
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'JM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

interface DefaultAvatarArtworkProps {
  choice?: DefaultAvatarKey;
  name: string;
  sizeClass?: string;
}

export const DefaultAvatarArtwork: React.FC<DefaultAvatarArtworkProps> = ({
  choice = 'silhouette',
  name,
  sizeClass = 'w-1/2 h-1/2',
}) => {
  if (choice === 'initials') {
    return (
      <div
        className="w-full h-full flex items-center justify-center text-white font-display font-semibold select-none"
        style={{ backgroundColor: 'var(--brand-primary)' }}
        aria-label={name}
      >
        <span className="text-[0.95em] tracking-wide">{getProfileInitials(name)}</span>
      </div>
    );
  }

  if (choice === 'educator') {
    return (
      <div
        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 text-[var(--brand-primary)] dark:text-[var(--brand-accent)]"
        aria-label={name}
      >
        <GraduationCap className={`${sizeClass} stroke-[1.6]`} aria-hidden="true" />
      </div>
    );
  }

  if (choice === 'male') {
    return (
      <div
        className="w-full h-full flex items-end justify-center bg-gradient-to-b from-slate-100 to-stone-200/90 dark:from-stone-800 dark:to-stone-900 text-slate-600 dark:text-stone-300 overflow-hidden"
        aria-label={name}
      >
        <svg
          viewBox="0 0 64 64"
          className="w-[84%] h-[84%] select-none"
          fill="none"
          aria-hidden="true"
        >
          {/* Head & short hair contour */}
          <path
            d="M21 24c0-7 4.8-12 11-12s11 5 11 12c0 6.2-4.7 11-11 11s-11-4.8-11-11Z"
            fill="currentColor"
            fillOpacity="0.16"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <path
            d="M20.5 22.5c.8-6.4 5.4-10.5 11.5-10.5 5.4 0 9.8 3.2 11 8.4-2.5-1.4-5.2-2-8.2-2-4.6 0-9.6 1.5-14.3 4.1Z"
            fill="currentColor"
            fillOpacity="0.82"
          />
          {/* Collared jacket shoulders */}
          <path
            d="M12 58c1.4-10.6 9.1-17 20-17s18.6 6.4 20 17"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M26 41.8 32 48l6-6.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (choice === 'female') {
    return (
      <div
        className="w-full h-full flex items-end justify-center bg-gradient-to-b from-amber-50/70 to-stone-200/85 dark:from-stone-800 dark:to-stone-900 text-stone-600 dark:text-stone-300 overflow-hidden"
        aria-label={name}
      >
        <svg
          viewBox="0 0 64 64"
          className="w-[84%] h-[84%] select-none"
          fill="none"
          aria-hidden="true"
        >
          {/* Soft swept hair framing face */}
          <path
            d="M18.5 28c0-9.2 5.7-16 13.5-16s13.5 6.8 13.5 16c0 4.8-1.4 8.5-3.4 10.6"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.82"
          />
          <path
            d="M18.5 28c0 4.8 1.4 8.5 3.4 10.6"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.82"
          />
          {/* Face */}
          <circle
            cx="32"
            cy="24.5"
            r="9.8"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="currentColor"
            strokeWidth="2.1"
          />
          {/* Hair parted arc */}
          <path
            d="M22.5 21.5c2.2-5 6.2-7.5 10.5-7.5 4.2 0 7.6 2.1 9.5 6.2-3.2-.6-6.5-2.1-9.3-4.3-2.9 2.4-6.4 4.2-10.7 5.6Z"
            fill="currentColor"
            fillOpacity="0.78"
          />
          {/* Traditional draped neckline / shoulders */}
          <path
            d="M12 58c1.5-10.4 9-16.8 20-16.8S50.5 47.6 52 58"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M24 42.6c2.5 3 5.2 4.6 8 4.6s5.5-1.6 8-4.6"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200/90 dark:from-stone-800 dark:to-stone-900 text-stone-400 dark:text-stone-500"
      aria-label={name}
    >
      <UserRound className={`${sizeClass} stroke-[1.5]`} aria-hidden="true" />
    </div>
  );
};

interface ProfileAvatarProps {
  photoUrl?: string;
  defaultAvatar?: DefaultAvatarKey;
  name: string;
  className?: string;
  iconSizeClass?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  photoUrl,
  defaultAvatar = 'silhouette',
  name,
  className = '',
  iconSizeClass = 'w-1/2 h-1/2',
}) => {
  const cleanUrl = photoUrl?.trim() || '';
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [cleanUrl]);

  if (!cleanUrl || hasError) {
    return (
      <div className={`w-full h-full ${className}`}>
        <DefaultAvatarArtwork
          choice={defaultAvatar}
          name={name}
          sizeClass={iconSizeClass}
        />
      </div>
    );
  }

  return (
    <img
      src={cleanUrl}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`w-full h-full object-cover object-top ${className}`}
    />
  );
};

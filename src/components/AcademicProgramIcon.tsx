import React from 'react';
import {
  Award,
  BookOpen,
  Calculator,
  Code,
  Compass,
  Cpu,
  FlaskConical,
  Globe,
  GraduationCap,
  LineChart,
  Palette,
} from 'lucide-react';
import { AcademicIconKey } from '../types/school';
import { SafeImage } from './SafeImage';

export const ACADEMIC_ICON_PRESETS: {
  key: AcademicIconKey;
  label: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}[] = [
  { key: 'book', label: 'Foundation Book', icon: BookOpen },
  { key: 'graduation', label: 'Graduation', icon: GraduationCap },
  { key: 'compass', label: 'Humanities', icon: Compass },
  { key: 'chart', label: 'Commerce', icon: LineChart },
  { key: 'cpu', label: 'Technology', icon: Cpu },
  { key: 'flask', label: 'Science Lab', icon: FlaskConical },
  { key: 'palette', label: 'Aesthetics', icon: Palette },
  { key: 'globe', label: 'Languages / Global', icon: Globe },
  { key: 'code', label: 'ICT & Coding', icon: Code },
  { key: 'calculator', label: 'Mathematics', icon: Calculator },
  { key: 'award', label: 'Honours', icon: Award },
];

export function resolveAcademicIconKey(
  iconKey?: AcademicIconKey,
  streamCode = ''
): AcademicIconKey {
  if (iconKey && ACADEMIC_ICON_PRESETS.some((p) => p.key === iconKey)) {
    return iconKey;
  }
  const code = streamCode.toUpperCase();
  if (code.includes('TECH')) return 'cpu';
  if (code.includes('COMM')) return 'chart';
  if (code.includes('ARTS')) return 'compass';
  if (code.includes('06')) return 'graduation';
  return 'book';
}

interface AcademicProgramIconProps {
  iconKey?: AcademicIconKey;
  iconImageUrl?: string;
  streamCode?: string;
  alt?: string;
  iconClassName?: string;
  imageClassName?: string;
}

export const AcademicProgramIcon: React.FC<AcademicProgramIconProps> = ({
  iconKey,
  iconImageUrl,
  streamCode = '',
  alt = 'Program icon',
  iconClassName = 'w-4 h-4',
  imageClassName = 'w-6 h-6 object-contain rounded',
}) => {
  if (iconImageUrl?.trim()) {
    return <SafeImage src={iconImageUrl} alt={alt} className={imageClassName} />;
  }

  const resolvedKey = resolveAcademicIconKey(iconKey, streamCode);
  const preset =
    ACADEMIC_ICON_PRESETS.find((item) => item.key === resolvedKey) ?? ACADEMIC_ICON_PRESETS[0];
  const Icon = preset.icon;

  return <Icon className={iconClassName} aria-hidden="true" />;
};

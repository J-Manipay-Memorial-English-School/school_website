import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { DEFAULT_SCHOOL_DATA } from '../data/defaultSchoolData';
import { pickText } from '../utils/schoolHelpers';

interface SchoolCrestProps {
  className?: string;
  srcOverride?: string;
}

export const SchoolCrest: React.FC<SchoolCrestProps> = ({
  className = 'w-9 h-9',
  srcOverride,
}) => {
  const { data, language } = useSchoolData();
  const targetSrc =
    (srcOverride ?? data.schoolLogoUrl)?.trim() || DEFAULT_SCHOOL_DATA.schoolLogoUrl;
  const [imgSrc, setImgSrc] = useState(targetSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setImgSrc(targetSrc);
    setFailed(false);
  }, [targetSrc]);

  return (
    <div
      className={`rounded-full bg-white border border-stone-200 dark:border-stone-700/80 shadow-xs flex items-center justify-center overflow-hidden p-0.5 shrink-0 ${className}`}
    >
      {imgSrc && !failed ? (
        <img
          src={imgSrc}
          alt={`${pickText(data.schoolName, language)} Crest`}
          onError={() => {
            if (imgSrc !== DEFAULT_SCHOOL_DATA.schoolLogoUrl) {
              setImgSrc(DEFAULT_SCHOOL_DATA.schoolLogoUrl);
            } else {
              setFailed(true);
            }
          }}
          className="w-full h-full object-contain rounded-full select-none"
        />
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: 'var(--brand-primary)' }}
          aria-label={`${pickText(data.schoolName, language)} Crest`}
        >
          <GraduationCap className="w-[58%] h-[58%]" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

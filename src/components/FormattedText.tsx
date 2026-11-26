import React from 'react';
import { splitParagraphs } from '../utils/schoolHelpers';

interface FormattedTextProps {
  text: string | undefined;
  className?: string;
  paragraphClassName?: string;
  firstParagraphClassName?: string;
}

/**
 * Renders multi-line CMS text cleanly:
 * - Blank lines (\n\n) render as separate <p> elements spaced by wrapper `className` (e.g. `space-y-3`).
 * - Single line breaks (\n) inside a paragraph are preserved via `whitespace-pre-line`.
 */
export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  className = 'space-y-3',
  paragraphClassName = '',
  firstParagraphClassName = '',
}) => {
  const paragraphs = splitParagraphs(text);
  if (paragraphs.length === 0) return null;

  return (
    <div className={className}>
      {paragraphs.map((para, idx) => (
        <p
          key={idx}
          className={`whitespace-pre-line ${paragraphClassName} ${
            idx === 0 ? firstParagraphClassName : ''
          }`.trim()}
        >
          {para}
        </p>
      ))}
    </div>
  );
};

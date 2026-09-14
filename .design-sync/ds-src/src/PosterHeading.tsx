import * as React from 'react';

/**
 * The display headline, set in Fraunces and broken into explicit lines. Each
 * line is its own masked element, which is what lets the live site reveal them
 * in sequence; statically they simply stack.
 *
 * You control the line breaks — that is the point. Give `lines` one entry per
 * typeset line and let the measure fall where the design wants it, rather than
 * where the viewport happens to wrap. Put the gold accent on one phrase only:
 * `<em className="text-gold-gradient">Hyperbaric</em>`.
 */
export interface PosterHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** One entry per typeset line. */
  lines: React.ReactNode[];
  /** Heading level. @default 'h1' */
  as?: 'h1' | 'h2';
  /** `poster` is the hero scale; `poster-sm` is the CTA-band scale. @default 'poster' */
  size?: 'poster' | 'poster-sm';
}

export function PosterHeading({ lines, as = 'h1', size = 'poster', className, ...rest }: PosterHeadingProps) {
  const Tag = as;
  const cls = [size, className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} {...rest}>
      {lines.map((line, i) => (
        <span className="line" key={i}><span className="line-inner">{line}</span></span>
      ))}
    </Tag>
  );
}

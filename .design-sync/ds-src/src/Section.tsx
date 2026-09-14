import * as React from 'react';

/**
 * A page band. `Section` owns the vertical rhythm, the surface colour, and the
 * two editorial marks that give the v2 system its character: the oversized
 * *ghost numeral* bled into the top-left corner and the rotated *vertical
 * label* running up the outer edge. Both are decorative and `aria-hidden`.
 *
 * Tones alternate down a page — `default` (cream) → `card-bg` (ivory) →
 * `default` → `dark` (emerald) — so neighbouring bands never repeat a surface.
 * Children are placed inside a `Container` unless you pass `bare`.
 */
export type SectionTone = 'default' | 'band' | 'card-bg' | 'dark' | 'mosaic';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Surface treatment. @default 'default' */
  tone?: SectionTone;
  /** Two-digit ghost numeral bled into the corner, e.g. `"02"`. */
  numeral?: string;
  /** Rotated label running up the outer edge, e.g. `"Why Oxygen Matters"`. */
  label?: string;
  /** Measure for the inner container. @default 'default' */
  width?: 'default' | 'wide' | 'text';
  /** Skip the inner `Container` and lay the children out yourself. @default false */
  bare?: boolean;
  children?: React.ReactNode;
}

export function Section({
  tone = 'default',
  numeral,
  label,
  width = 'default',
  bare = false,
  className,
  children,
  ...rest
}: SectionProps) {
  const cls = ['section', tone !== 'default' ? `section--${tone}` : null, className]
    .filter(Boolean)
    .join(' ');
  const containerCls = ['container', width === 'wide' ? 'container--wide' : null, width === 'text' ? 'container--text' : null]
    .filter(Boolean)
    .join(' ');
  return (
    <section className={cls} {...rest}>
      {numeral ? <span className="ghost ghost--tl" aria-hidden="true" data-n={numeral} /> : null}
      {label ? <span className="vlabel" aria-hidden="true" data-label={label} /> : null}
      {bare ? children : <div className={containerCls}>{children}</div>}
    </section>
  );
}

import * as React from 'react';

/**
 * The round icon badge that precedes a card heading, an index row title, or a
 * contact-list entry. It supplies the ring and the colour; the `Icon` inside
 * inherits it via `currentColor`.
 *
 * Use `tone="light"` on emerald surfaces, and `size="lg"` for the single-card
 * protocol layout.
 */
export interface ChipIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default 'default' — gold-on-cream. `light` is the on-emerald variant. */
  tone?: 'default' | 'light';
  /** @default 'md' */
  size?: 'md' | 'lg';
  /** An `<Icon>`. */
  children?: React.ReactNode;
}

export function ChipIcon({ tone = 'default', size = 'md', className, children, ...rest }: ChipIconProps) {
  const cls = ['chip-icon', size === 'lg' ? 'chip-icon--lg' : null, tone === 'light' ? 'chip-icon--light' : null, className]
    .filter(Boolean)
    .join(' ');
  return <span className={cls} aria-hidden="true" {...rest}>{children}</span>;
}

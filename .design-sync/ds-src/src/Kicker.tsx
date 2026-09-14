import * as React from 'react';

/**
 * The small caps-and-letterspaced eyebrow that labels almost every block on the
 * site — gold ink on light surfaces, champagne on emerald. It is the most-used
 * single class in the system.
 *
 * Set `onDark` on any emerald surface (`Section tone="dark"`, `Hero`, `CtaBand`,
 * `PageHero`); the light-surface gold is deliberately too dark to read there.
 */
export interface KickerProps extends React.HTMLAttributes<HTMLElement> {
  /** Use the on-emerald colour. @default false */
  onDark?: boolean;
  /** Element to render. `span` is correct inside cards and footer columns. @default 'p' */
  as?: 'p' | 'span';
  children?: React.ReactNode;
}

export function Kicker({ onDark = false, as = 'p', className, children, ...rest }: KickerProps) {
  const cls = ['kicker', onDark ? 'kicker--on-dark' : null, className].filter(Boolean).join(' ');
  const Tag = as;
  return <Tag className={cls} {...rest}>{children}</Tag>;
}

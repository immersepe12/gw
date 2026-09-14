import * as React from 'react';

/**
 * The site's only action element. Renders an `<a>` by default — every button on
 * generationswellness.net is a link (book, call, learn more) — or a `<button>`
 * when you pass `as="button"`.
 *
 * Variant picks the surface it is allowed to sit on:
 * `primary` is the gold gradient with ink-900 labels (the only combination that
 * clears contrast on every gradient stop) and works on light and dark alike;
 * `secondary` is the emerald outline for light backgrounds; `secondary-on-dark`
 * is its cream counterpart and is the ONLY secondary that may sit on emerald.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'secondary-on-dark';

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual treatment. @default 'primary' */
  variant?: ButtonVariant;
  /** Compact height, used in the header bar. @default false */
  small?: boolean;
  /** Render as a real `<button>` instead of a link. @default 'a' */
  as?: 'a' | 'button';
  /** Link target when rendering an `<a>`. */
  href?: string;
  /** Button type when rendering a `<button>`. */
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  small = false,
  as = 'a',
  href,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = ['btn', `btn--${variant}`, small ? 'btn--sm' : null, className]
    .filter(Boolean)
    .join(' ');
  if (as === 'button') return <button className={cls} {...rest}>{children}</button>;
  return <a className={cls} href={href} {...rest}>{children}</a>;
}

import * as React from 'react';

/**
 * The horizontal measure. Every block of content on the site sits in one.
 *
 * `default` is the standard column; `wide` is the header/hero measure; `text`
 * is the narrow reading measure used for long-form prose.
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default 'default' */
  width?: 'default' | 'wide' | 'text';
  children?: React.ReactNode;
}

export function Container({ width = 'default', className, children, ...rest }: ContainerProps) {
  const cls = ['container', width === 'wide' ? 'container--wide' : null, width === 'text' ? 'container--text' : null, className]
    .filter(Boolean)
    .join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}

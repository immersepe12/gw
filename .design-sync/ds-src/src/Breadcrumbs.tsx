import * as React from 'react';

export interface Crumb {
  label: string;
  /** Omit on the current page — it renders as plain text with `aria-current`. */
  href?: string;
}

/**
 * The breadcrumb trail inside a `PageHero`. Always starts at Home and ends on
 * the current page, which carries no link.
 */
export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: Crumb[];
}

export function Breadcrumbs({ items, className, ...rest }: BreadcrumbsProps) {
  return (
    <nav className={['breadcrumbs', className].filter(Boolean).join(' ')} aria-label="Breadcrumb" {...rest}>
      <ol>
        {items.map((c, i) => (
          <li key={i}>
            {c.href ? <a href={c.href}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
